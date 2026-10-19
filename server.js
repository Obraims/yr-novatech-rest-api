const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const { body, param, query, validationResult } = require('express-validator');
require('dotenv').config();

const db = require('./database');
const swaggerDocument = require('./swagger.json');

const app = express();
const PORT = process.env.PORT || 5000;

// Standard Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger Middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// Middleware to ensure SQLite database & seeds are fully initialized before requests (critical for serverless cold-starts)
app.use(async (req, res, next) => {
  try {
    if (db.initPromise) {
      await db.initPromise;
    }
    next();
  } catch (err) {
    next(err);
  }
});

// Swagger UI CDN Configuration (ensures CSS/JS render flawlessly on serverless Vercel)
const SWAGGER_UI_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0';

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customSiteTitle: 'YR NOVATECH REST API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
    customCssUrl: `${SWAGGER_UI_CDN}/swagger-ui.min.css`,
    customJs: [
      `${SWAGGER_UI_CDN}/swagger-ui-bundle.min.js`,
      `${SWAGGER_UI_CDN}/swagger-ui-standalone-preset.min.js`
    ],
    swaggerOptions: { docExpansion: 'list' }
  })
);

// Validation Error Formatter Middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path || err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// ==========================================
// 1. Health Check & Root Welcome Route
// ==========================================
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Financial Transaction & Expense Tracker REST API',
    version: '1.0.0',
    platform: process.env.VERCEL ? 'Vercel Serverless' : 'Node.js Express',
    documentation: '/api-docs',
    timestamp: new Date().toISOString(),
    endpoints: {
      healthCheck: 'GET /',
      swaggerDocs: 'GET /api-docs',
      getAllTransactions: 'GET /api/transactions',
      getTransactionsFiltered: 'GET /api/transactions?type={income|expense}&category={name}',
      getTransactionById: 'GET /api/transactions/:id',
      createTransaction: 'POST /api/transactions',
      updateTransaction: 'PUT /api/transactions/:id',
      deleteTransaction: 'DELETE /api/transactions/:id'
    }
  });
});

// ==========================================
// 2. GET /api/transactions (Read All & Filter)
// ==========================================
app.get(
  '/api/transactions',
  [
    query('type')
      .optional()
      .isIn(['income', 'expense'])
      .withMessage("Query parameter 'type' must be either 'income' or 'expense'"),
    query('category')
      .optional()
      .trim()
      .isString()
      .withMessage("Query parameter 'category' must be a valid string")
  ],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const { type, category } = req.query;
      let sql = 'SELECT * FROM transactions WHERE 1=1';
      const params = [];

      if (type) {
        sql += ' AND type = ?';
        params.push(type.toLowerCase());
      }

      if (category) {
        sql += ' AND LOWER(category) LIKE ?';
        params.push(`%${category.toLowerCase()}%`);
      }

      sql += ' ORDER BY created_at DESC, id DESC';

      const rows = await db.allAsync(sql, params);

      res.status(200).json({
        success: true,
        count: rows.length,
        filtersApplied: {
          type: type || null,
          category: category || null
        },
        data: rows
      });
    } catch (err) {
      next(err);
    }
  }
);

// ==========================================
// 3. GET /api/transactions/:id (Read Single)
// ==========================================
app.get(
  '/api/transactions/:id',
  [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Transaction ID must be a positive integer')
  ],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const row = await db.getAsync('SELECT * FROM transactions WHERE id = ?', [id]);

      if (!row) {
        return res.status(404).json({
          success: false,
          error: `Transaction with ID ${id} not found`
        });
      }

      res.status(200).json({
        success: true,
        data: row
      });
    } catch (err) {
      next(err);
    }
  }
);

// ==========================================
// 4. POST /api/transactions (Create)
// ==========================================
app.post(
  '/api/transactions',
  [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required and cannot be empty')
      .isLength({ min: 2, max: 150 })
      .withMessage('Title must be between 2 and 150 characters'),
    body('amount')
      .notEmpty()
      .withMessage('Amount is required')
      .isFloat({ gt: 0 })
      .withMessage('Amount must be a positive number greater than 0'),
    body('type')
      .notEmpty()
      .withMessage('Type is required')
      .isIn(['income', 'expense'])
      .withMessage("Type must be either 'income' or 'expense'"),
    body('category')
      .trim()
      .notEmpty()
      .withMessage('Category is required and cannot be empty')
      .isLength({ min: 2, max: 80 })
      .withMessage('Category must be between 2 and 80 characters')
  ],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const { title, amount, type, category } = req.body;
      const parsedAmount = parseFloat(parseFloat(amount).toFixed(2));
      const normalizedType = type.toLowerCase();

      const insertResult = await db.runAsync(
        'INSERT INTO transactions (title, amount, type, category) VALUES (?, ?, ?, ?)',
        [title, parsedAmount, normalizedType, category]
      );

      const newRecord = await db.getAsync('SELECT * FROM transactions WHERE id = ?', [
        insertResult.lastID
      ]);

      res.status(201).json({
        success: true,
        message: 'Transaction created successfully',
        data: newRecord
      });
    } catch (err) {
      next(err);
    }
  }
);

// ==========================================
// 5. PUT /api/transactions/:id (Update)
// ==========================================
app.put(
  '/api/transactions/:id',
  [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Transaction ID must be a positive integer'),
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required and cannot be empty')
      .isLength({ min: 2, max: 150 })
      .withMessage('Title must be between 2 and 150 characters'),
    body('amount')
      .notEmpty()
      .withMessage('Amount is required')
      .isFloat({ gt: 0 })
      .withMessage('Amount must be a positive number greater than 0'),
    body('type')
      .notEmpty()
      .withMessage('Type is required')
      .isIn(['income', 'expense'])
      .withMessage("Type must be either 'income' or 'expense'"),
    body('category')
      .trim()
      .notEmpty()
      .withMessage('Category is required and cannot be empty')
      .isLength({ min: 2, max: 80 })
      .withMessage('Category must be between 2 and 80 characters')
  ],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { title, amount, type, category } = req.body;

      // Check existence first
      const existing = await db.getAsync('SELECT * FROM transactions WHERE id = ?', [id]);
      if (!existing) {
        return res.status(404).json({
          success: false,
          error: `Transaction with ID ${id} not found`
        });
      }

      const parsedAmount = parseFloat(parseFloat(amount).toFixed(2));
      const normalizedType = type.toLowerCase();

      await db.runAsync(
        `UPDATE transactions
         SET title = ?, amount = ?, type = ?, category = ?
         WHERE id = ?`,
        [title, parsedAmount, normalizedType, category, id]
      );

      const updatedRecord = await db.getAsync('SELECT * FROM transactions WHERE id = ?', [id]);

      res.status(200).json({
        success: true,
        message: 'Transaction updated successfully',
        data: updatedRecord
      });
    } catch (err) {
      next(err);
    }
  }
);

// ==========================================
// 6. DELETE /api/transactions/:id (Delete)
// ==========================================
app.delete(
  '/api/transactions/:id',
  [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Transaction ID must be a positive integer')
  ],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const existing = await db.getAsync('SELECT * FROM transactions WHERE id = ?', [id]);
      if (!existing) {
        return res.status(404).json({
          success: false,
          error: `Transaction with ID ${id} not found`
        });
      }

      await db.runAsync('DELETE FROM transactions WHERE id = ?', [id]);

      res.status(200).json({
        success: true,
        message: `Transaction with ID ${id} deleted successfully`,
        deletedId: parseInt(id, 10),
        deletedRecord: existing
      });
    } catch (err) {
      next(err);
    }
  }
);

// ==========================================
// 7. 404 Catch-All Route for Unknown Paths
// ==========================================
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found`,
    documentation: '/api-docs'
  });
});

// ==========================================
// 8. Centralized Global Error Handler
// ==========================================
app.use((err, req, res, next) => {
  console.error('🔥 Server Error Handler caught:', err.stack || err.message || err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// ==========================================
// Server Start (Only when executed directly)
// ==========================================
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 Financial Transaction REST API is live!`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`📚 Interactive Swagger Docs: http://localhost:${PORT}/api-docs`);
    console.log(`=======================================================`);
  });
}

// Export Express app for Vercel Serverless Function & testing
module.exports = app;
