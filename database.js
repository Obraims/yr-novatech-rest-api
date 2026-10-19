const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Determine database file path based on environment
// On Vercel serverless, root filesystem is read-only, but /tmp is writable
let dbPath;
if (process.env.VERCEL) {
  dbPath = '/tmp/database.sqlite';
  console.log('⚡ Running on Vercel Serverless environment. Using /tmp/database.sqlite');
} else {
  dbPath = path.resolve(__dirname, process.env.DB_FILE || 'database.sqlite');
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Failed to connect to SQLite database:', err.message);
  } else {
    console.log(`✅ Connected to SQLite database at: ${dbPath}`);
  }
});

// Promise-based initialization tracking for serverless cold-starts
let isInitialized = false;
let initPromise = null;

function initDatabase() {
  if (isInitialized) return Promise.resolve();
  if (initPromise) return initPromise;

  initPromise = new Promise((resolve, reject) => {
    db.serialize(() => {
      // Enable foreign keys
      db.run('PRAGMA foreign_keys = ON');

      // Create transactions table
      db.run(`
        CREATE TABLE IF NOT EXISTS transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          amount REAL NOT NULL,
          type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
          category TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('❌ Error creating transactions table:', err.message);
          return reject(err);
        }

        // Check if table needs initial sample seeding
        db.get('SELECT COUNT(*) AS count FROM transactions', (countErr, row) => {
          if (countErr) {
            console.error('❌ Error checking transaction count:', countErr.message);
            return reject(countErr);
          }

          if (row.count === 0) {
            console.log('🌱 Seeding initial financial transactions into SQLite database...');
            const seedStmt = db.prepare(`
              INSERT INTO transactions (title, amount, type, category, created_at)
              VALUES (?, ?, ?, ?, datetime('now', ?))
            `);

            const sampleRecords = [
              ['Freelance Full-Stack Development', 1250.00, 'income', 'Software Consulting', '-2 days'],
              ['Cloud Server Infrastructure & VPS', 45.50, 'expense', 'DevOps & Hosting', '-1 day'],
              ['Algorithmic Financial Data Subscription', 120.00, 'expense', 'Market Data', 'now']
            ];

            sampleRecords.forEach(([title, amount, type, category, timeOffset]) => {
              seedStmt.run(title, amount, type, category, timeOffset);
            });

            seedStmt.finalize((seedErr) => {
              if (seedErr) {
                console.error('❌ Error finalizing seed statement:', seedErr.message);
                return reject(seedErr);
              }
              console.log('✨ Database successfully seeded with 3 sample financial records.');
              isInitialized = true;
              resolve();
            });
          } else {
            isInitialized = true;
            resolve();
          }
        });
      });
    });
  });

  return initPromise;
}

// Auto-run schema & seed initialization immediately on module load
db.initPromise = initDatabase().catch((err) => {
  console.error('❌ Database initialization error:', err.message);
});

// Promise-based helper methods for async/await route handlers
db.allAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

db.getAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

db.runAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

module.exports = db;
