/**
 * Generates the Interactive API Documentation & Live Tester Dashboard
 * for YR NOVATECH Task 3 REST API.
 */
function renderDashboardHtml(healthData) {
  const platform = healthData.platform || 'Node.js Express';
  const isVercel = platform.includes('Vercel');

  return `<!DOCTYPE html>
<html lang="en" class="dark scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>YR NOVATECH Task 3 | Financial Transaction REST API Dashboard</title>
  <meta name="description" content="Interactive API Documentation, Schema Reference, and Live Testing Console for the Financial Transaction & Expense Tracker REST API.">
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  
  <!-- Tailwind CSS via CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            mono: ['"JetBrains Mono"', 'monospace'],
          },
          colors: {
            brand: {
              emerald: '#10b981',
              cyan: '#06b6d4',
              violet: '#8b5cf6',
              dark: '#070a12',
              card: '#0f172a',
              border: '#1e293b'
            }
          }
        }
      }
    }
  </script>

  <style>
    /* Custom Scrollbars */
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: #070a12; }
    ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #10b981; }

    /* Background Grid Mesh */
    .bg-grid {
      background-size: 32px 32px;
      background-image: 
        linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    }

    /* Glassmorphism */
    .glass-card {
      background: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
  </style>
</head>

<body class="bg-[#070a12] text-slate-100 font-sans antialiased min-h-screen selection:bg-emerald-500 selection:text-black relative overflow-x-hidden">

  <!-- Ambient Glow Orbs -->
  <div class="fixed top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full filter blur-[120px] pointer-events-none -z-10"></div>
  <div class="fixed top-1/3 right-10 w-[28rem] h-[28rem] bg-cyan-500/10 rounded-full filter blur-[140px] pointer-events-none -z-10"></div>
  <div class="fixed inset-0 bg-grid pointer-events-none opacity-40 -z-10"></div>

  <!-- ==================== HEADER ==================== -->
  <header class="sticky top-0 z-50 backdrop-blur-xl bg-[#070a12]/85 border-b border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3.5 flex items-center justify-between">
      
      <!-- Brand Logo -->
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 p-[2px] shadow-lg shadow-emerald-500/20">
          <div class="w-full h-full bg-[#070a12] rounded-[10px] flex items-center justify-center font-display font-black text-emerald-400 text-lg">
            YR
          </div>
        </div>
        <div>
          <div class="flex items-center space-x-2">
            <span class="font-bold text-white tracking-tight text-base sm:text-lg">YR NOVATECH</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Task 3</span>
          </div>
          <span class="text-xs text-slate-400 font-mono hidden sm:block">Financial Transaction &amp; Expense Tracker REST API</span>
        </div>
      </div>

      <!-- Header Actions -->
      <div class="flex items-center space-x-3">
        <!-- Live Status Pill -->
        <div class="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Online &amp; Connected to SQLite</span>
        </div>

        <!-- Platform Badge -->
        <span class="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-slate-800 text-cyan-300 border border-slate-700">
          ${isVercel ? '⚡ Vercel Serverless' : '🖥️ Node.js Local'}
        </span>

        <!-- Swagger Docs Button -->
        <a href="/api-docs" class="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 transition-all shadow-md shadow-emerald-500/20 flex items-center space-x-1.5">
          <span>Swagger UI</span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
        </a>

        <!-- Raw JSON Link -->
        <a href="/api/health" class="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors" title="Raw JSON Health Check">
          <span class="font-mono text-xs">{ }</span>
        </a>
      </div>

    </div>
  </header>

  <!-- ==================== MAIN CONTENT ==================== -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">

    <!-- Hero / Title Section -->
    <section class="space-y-4">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
        RESTful Architecture • SQLite Persistent Storage • Express-Validator • OpenAPI 3.0
      </div>
      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
        Financial Transaction &amp; <span class="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Expense Tracker API</span>
      </h1>
      <p class="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
        Production-ready backend service providing complete CRUD operations, query-based filtering, strict input sanitization, and automated Swagger OpenAPI documentation. Test all endpoints interactively below.
      </p>

      <!-- Quick Metrics Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
        <div class="glass-card p-4 rounded-xl border border-slate-800">
          <span class="block text-2xl font-bold font-mono text-emerald-400">5+</span>
          <span class="text-xs text-slate-400 font-medium">CRUD Endpoints</span>
        </div>
        <div class="glass-card p-4 rounded-xl border border-slate-800">
          <span class="block text-2xl font-bold font-mono text-cyan-400">SQLite</span>
          <span class="text-xs text-slate-400 font-medium">${isVercel ? '/tmp/database.sqlite' : 'Persistent Storage'}</span>
        </div>
        <div class="glass-card p-4 rounded-xl border border-slate-800">
          <span class="block text-2xl font-bold font-mono text-violet-400">100%</span>
          <span class="text-xs text-slate-400 font-medium">Schema Validated</span>
        </div>
        <div class="glass-card p-4 rounded-xl border border-slate-800">
          <span class="block text-2xl font-bold font-mono text-amber-400">OpenAPI 3.0</span>
          <span class="text-xs text-slate-400 font-medium">Interactive Swagger UI</span>
        </div>
      </div>
    </section>

    <!-- ==================== DATABASE SCHEMA TABLE ==================== -->
    <section class="glass-card rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <h2 class="text-lg font-bold text-white flex items-center space-x-2">
            <span>📊 Database Model:</span>
            <code class="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">transactions</code>
          </h2>
          <p class="text-xs text-slate-400 mt-1">Managed automatically with SQLite DDL on application startup.</p>
        </div>
        <span class="text-xs font-mono text-slate-400">Seeded with 3 initial records</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs font-mono">
          <thead>
            <tr class="border-b border-slate-800 text-slate-400">
              <th class="py-2.5 px-3">Column</th>
              <th class="py-2.5 px-3">Type</th>
              <th class="py-2.5 px-3">Constraints</th>
              <th class="py-2.5 px-3">Description</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60 text-slate-300">
            <tr>
              <td class="py-2.5 px-3 text-cyan-400 font-semibold">id</td>
              <td class="py-2.5 px-3 text-amber-300">INTEGER</td>
              <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">PRIMARY KEY AUTOINCREMENT</span></td>
              <td class="py-2.5 px-3 text-slate-400 font-sans">Unique numeric identifier for the financial transaction</td>
            </tr>
            <tr>
              <td class="py-2.5 px-3 text-cyan-400 font-semibold">title</td>
              <td class="py-2.5 px-3 text-amber-300">TEXT</td>
              <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded bg-slate-800 text-rose-300 border border-slate-700">NOT NULL (2–150 chars)</span></td>
              <td class="py-2.5 px-3 text-slate-400 font-sans">Descriptive title or purpose of the transaction</td>
            </tr>
            <tr>
              <td class="py-2.5 px-3 text-cyan-400 font-semibold">amount</td>
              <td class="py-2.5 px-3 text-amber-300">REAL</td>
              <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded bg-slate-800 text-emerald-300 border border-slate-700">NOT NULL (> 0.00)</span></td>
              <td class="py-2.5 px-3 text-slate-400 font-sans">Monetary transaction value, strictly positive float</td>
            </tr>
            <tr>
              <td class="py-2.5 px-3 text-cyan-400 font-semibold">type</td>
              <td class="py-2.5 px-3 text-amber-300">TEXT</td>
              <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded bg-slate-800 text-purple-300 border border-slate-700">CHECK ('income', 'expense')</span></td>
              <td class="py-2.5 px-3 text-slate-400 font-sans">Transaction cash flow direction</td>
            </tr>
            <tr>
              <td class="py-2.5 px-3 text-cyan-400 font-semibold">category</td>
              <td class="py-2.5 px-3 text-amber-300">TEXT</td>
              <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">NOT NULL (2–80 chars)</span></td>
              <td class="py-2.5 px-3 text-slate-400 font-sans">Categorization label (e.g. Software Consulting, DevOps)</td>
            </tr>
            <tr>
              <td class="py-2.5 px-3 text-cyan-400 font-semibold">created_at</td>
              <td class="py-2.5 px-3 text-amber-300">DATETIME</td>
              <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">DEFAULT CURRENT_TIMESTAMP</span></td>
              <td class="py-2.5 px-3 text-slate-400 font-sans">Automatic UTC timestamp of creation</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ==================== LIVE INTERACTIVE API TESTER ==================== -->
    <section class="space-y-6">
      <div>
        <div class="flex items-center justify-between">
          <h2 class="text-xl sm:text-2xl font-bold text-white flex items-center space-x-2">
            <span>⚡ Interactive API Live Tester</span>
          </h2>
          <button onclick="executeCurrentEndpoint()" class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 transition-all flex items-center space-x-1.5 shadow-md shadow-emerald-500/20 active:scale-95">
            <span id="run-btn-text">Execute Request</span>
            <svg id="run-spinner" class="w-3.5 h-3.5 animate-spin hidden" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          </button>
        </div>
        <p class="text-xs sm:text-sm text-slate-400 mt-1">Click any endpoint tab below to test live HTTP requests and view formatted SQLite responses in real time.</p>
      </div>

      <!-- Endpoint Tab Bar -->
      <div class="flex flex-wrap gap-2 p-1.5 rounded-xl bg-slate-900/80 border border-slate-800" role="tablist">
        <button onclick="setTab('get-all')" id="tab-get-all" class="tab-btn px-3 py-2 rounded-lg text-xs font-mono font-semibold transition-all bg-emerald-500 text-slate-950 flex items-center space-x-1.5">
          <span class="px-1.5 py-0.5 rounded bg-black/20 text-[10px]">GET</span>
          <span>/api/transactions</span>
        </button>
        <button onclick="setTab('get-single')" id="tab-get-single" class="tab-btn px-3 py-2 rounded-lg text-xs font-mono font-semibold transition-all text-slate-400 hover:text-white flex items-center space-x-1.5">
          <span class="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 text-[10px]">GET</span>
          <span>/api/transactions/:id</span>
        </button>
        <button onclick="setTab('post')" id="tab-post" class="tab-btn px-3 py-2 rounded-lg text-xs font-mono font-semibold transition-all text-slate-400 hover:text-white flex items-center space-x-1.5">
          <span class="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 text-[10px]">POST</span>
          <span>/api/transactions</span>
        </button>
        <button onclick="setTab('put')" id="tab-put" class="tab-btn px-3 py-2 rounded-lg text-xs font-mono font-semibold transition-all text-slate-400 hover:text-white flex items-center space-x-1.5">
          <span class="px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 text-[10px]">PUT</span>
          <span>/api/transactions/:id</span>
        </button>
        <button onclick="setTab('delete')" id="tab-delete" class="tab-btn px-3 py-2 rounded-lg text-xs font-mono font-semibold transition-all text-slate-400 hover:text-white flex items-center space-x-1.5">
          <span class="px-1.5 py-0.5 rounded bg-slate-800 text-rose-400 text-[10px]">DELETE</span>
          <span>/api/transactions/:id</span>
        </button>
      </div>

      <!-- Live Tester Workspace (Inputs & Live Response) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <!-- Left: Request Configuration Form -->
        <div class="lg:col-span-5 glass-card rounded-2xl border border-slate-800 p-5 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Request Configuration</span>
            <span id="req-method-badge" class="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">GET</span>
          </div>

          <!-- URL Bar Preview -->
          <div class="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 break-all flex items-center justify-between">
            <span id="request-url-preview">/api/transactions</span>
            <span class="text-[10px] text-slate-500 uppercase">live</span>
          </div>

          <!-- Dynamic Form Inputs -->
          <div id="form-container" class="space-y-3 text-xs">
            <!-- Injected via JavaScript based on active tab -->
          </div>

          <!-- Execute Button -->
          <button onclick="executeCurrentEndpoint()" class="w-full py-3 rounded-xl font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 transition-all text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 active:scale-[0.99]">
            <span>Send Live Request</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </div>

        <!-- Right: Live Response Viewer -->
        <div class="lg:col-span-7 glass-card rounded-2xl border border-slate-800 p-5 space-y-3">
          <div class="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div class="flex items-center space-x-2">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Response Payload</span>
              <span id="response-status-badge" class="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">200 OK</span>
              <span id="response-time-badge" class="text-[11px] font-mono text-slate-500">14ms</span>
            </div>
            <button onclick="copyResponseJson()" id="copy-btn" class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 transition-colors flex items-center space-x-1">
              <span>Copy JSON</span>
            </button>
          </div>

          <!-- Code Block Output -->
          <div class="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800/90 p-4">
            <pre class="font-mono text-xs text-emerald-300 overflow-x-auto max-h-[380px] leading-relaxed" id="response-json-viewer">Loading live transactions from SQLite database...</pre>
          </div>

          <div class="flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>Content-Type: application/json</span>
            <span>Origin: live server instance</span>
          </div>
        </div>

      </div>
    </section>

    <!-- ==================== SWAGGER & DOCS BANNER ==================== -->
    <section class="glass-card rounded-2xl border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
      <div class="space-y-1 text-center md:text-left">
        <h3 class="text-lg font-bold text-white">Interactive OpenAPI / Swagger Documentation</h3>
        <p class="text-slate-400 text-xs sm:text-sm">Explore interactive API request schemas, code generation, and live execution via the official Swagger UI.</p>
      </div>
      <div class="flex items-center space-x-3">
        <a href="/api-docs" class="px-5 py-2.5 rounded-xl font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-xs transition-all shadow-md shadow-cyan-500/20 flex items-center space-x-2">
          <span>Open Swagger UI (/api-docs)</span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
        </a>
        <a href="/api/health" class="px-4 py-2.5 rounded-xl text-xs font-mono font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700">
          Raw /api/health JSON
        </a>
      </div>
    </section>

  </main>

  <!-- ==================== FOOTER ==================== -->
  <footer class="border-t border-slate-800/80 bg-[#05070c] py-8 text-xs text-slate-500 font-mono">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <span class="text-slate-400 font-bold">Stephen Baraka Kakui (@Obraims)</span> &bull; YR NOVATECH Task 3 Backend Evaluation
      </div>
      <div class="flex items-center space-x-4 text-slate-400">
        <a href="/api-docs" class="hover:text-emerald-400 transition-colors">Swagger UI</a>
        <a href="/api/health" class="hover:text-emerald-400 transition-colors">Health JSON</a>
        <a href="https://github.com/Obraims/yr-novatech-rest-api" target="_blank" rel="noopener noreferrer" class="hover:text-emerald-400 transition-colors">GitHub Repository</a>
      </div>
    </div>
  </footer>

  <!-- ==================== LIVE TESTER JAVASCRIPT ==================== -->
  <script>
    let activeTab = 'get-all';
    let lastResponseText = '';

    const tabsConfig = {
      'get-all': {
        method: 'GET',
        path: '/api/transactions',
        badgeClass: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
        renderInputs: () => \`
          <div class="space-y-1">
            <label class="block text-slate-300 font-medium">Filter by Type (Optional)</label>
            <select id="input-type-filter" onchange="updateUrlPreview()" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-400">
              <option value="">All Transactions (No filter)</option>
              <option value="income">income</option>
              <option value="expense">expense</option>
            </select>
          </div>
          <div class="space-y-1">
            <label class="block text-slate-300 font-medium">Filter by Category (Optional)</label>
            <input type="text" id="input-cat-filter" oninput="updateUrlPreview()" placeholder="e.g. Consulting, DevOps" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-400">
          </div>
        \`,
        buildRequest: () => {
          const type = document.getElementById('input-type-filter')?.value;
          const cat = document.getElementById('input-cat-filter')?.value?.trim();
          const params = new URLSearchParams();
          if (type) params.append('type', type);
          if (cat) params.append('category', cat);
          const qs = params.toString() ? '?' + params.toString() : '';
          return { url: '/api/transactions' + qs, method: 'GET' };
        }
      },
      'get-single': {
        method: 'GET',
        path: '/api/transactions/:id',
        badgeClass: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
        renderInputs: () => \`
          <div class="space-y-1">
            <label class="block text-slate-300 font-medium">Transaction ID</label>
            <input type="number" id="input-single-id" oninput="updateUrlPreview()" value="1" min="1" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-400">
          </div>
        \`,
        buildRequest: () => {
          const id = document.getElementById('input-single-id')?.value || '1';
          return { url: '/api/transactions/' + encodeURIComponent(id), method: 'GET' };
        }
      },
      'post': {
        method: 'POST',
        path: '/api/transactions',
        badgeClass: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
        renderInputs: () => \`
          <div class="space-y-1">
            <label class="block text-slate-300 font-medium">Title <span class="text-rose-400">*</span></label>
            <input type="text" id="input-post-title" value="FinTech Payment Gateway License" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-400">
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div class="space-y-1">
              <label class="block text-slate-300 font-medium">Amount ($) <span class="text-rose-400">*</span></label>
              <input type="number" id="input-post-amount" value="350.00" step="0.01" min="0.01" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-400">
            </div>
            <div class="space-y-1">
              <label class="block text-slate-300 font-medium">Type <span class="text-rose-400">*</span></label>
              <select id="input-post-type" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-400">
                <option value="income">income</option>
                <option value="expense" selected>expense</option>
              </select>
            </div>
          </div>
          <div class="space-y-1">
            <label class="block text-slate-300 font-medium">Category <span class="text-rose-400">*</span></label>
            <input type="text" id="input-post-category" value="Infrastructure & Software" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-400">
          </div>
        \`,
        buildRequest: () => {
          const body = {
            title: document.getElementById('input-post-title').value.trim(),
            amount: parseFloat(document.getElementById('input-post-amount').value),
            type: document.getElementById('input-post-type').value,
            category: document.getElementById('input-post-category').value.trim()
          };
          return { url: '/api/transactions', method: 'POST', body };
        }
      },
      'put': {
        method: 'PUT',
        path: '/api/transactions/:id',
        badgeClass: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
        renderInputs: () => \`
          <div class="space-y-1">
            <label class="block text-slate-300 font-medium">Target Transaction ID</label>
            <input type="number" id="input-put-id" oninput="updateUrlPreview()" value="1" min="1" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400">
          </div>
          <div class="space-y-1">
            <label class="block text-slate-300 font-medium">Updated Title</label>
            <input type="text" id="input-put-title" value="Freelance Web Development (Full Retainer)" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400">
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div class="space-y-1">
              <label class="block text-slate-300 font-medium">Updated Amount ($)</label>
              <input type="number" id="input-put-amount" value="1500.00" step="0.01" min="0.01" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400">
            </div>
            <div class="space-y-1">
              <label class="block text-slate-300 font-medium">Updated Type</label>
              <select id="input-put-type" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400">
                <option value="income" selected>income</option>
                <option value="expense">expense</option>
              </select>
            </div>
          </div>
          <div class="space-y-1">
            <label class="block text-slate-300 font-medium">Updated Category</label>
            <input type="text" id="input-put-category" value="Consulting & Architecture" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400">
          </div>
        \`,
        buildRequest: () => {
          const id = document.getElementById('input-put-id').value || '1';
          const body = {
            title: document.getElementById('input-put-title').value.trim(),
            amount: parseFloat(document.getElementById('input-put-amount').value),
            type: document.getElementById('input-put-type').value,
            category: document.getElementById('input-put-category').value.trim()
          };
          return { url: '/api/transactions/' + encodeURIComponent(id), method: 'PUT', body };
        }
      },
      'delete': {
        method: 'DELETE',
        path: '/api/transactions/:id',
        badgeClass: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
        renderInputs: () => \`
          <div class="space-y-1">
            <label class="block text-slate-300 font-medium">Transaction ID to Delete</label>
            <input type="number" id="input-del-id" oninput="updateUrlPreview()" value="3" min="1" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-400">
          </div>
          <p class="text-[11px] text-slate-400">Note: Deleting will permanently remove the record from the SQLite database.</p>
        \`,
        buildRequest: () => {
          const id = document.getElementById('input-del-id').value || '3';
          return { url: '/api/transactions/' + encodeURIComponent(id), method: 'DELETE' };
        }
      }
    };

    function setTab(tabKey) {
      activeTab = tabKey;
      const config = tabsConfig[tabKey];

      // Update Tab Bar Active Classes
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.className = 'tab-btn px-3 py-2 rounded-lg text-xs font-mono font-semibold transition-all text-slate-400 hover:text-white flex items-center space-x-1.5';
      });
      const activeBtn = document.getElementById('tab-' + tabKey);
      if (activeBtn) {
        activeBtn.className = 'tab-btn px-3 py-2 rounded-lg text-xs font-mono font-semibold transition-all bg-emerald-500 text-slate-950 flex items-center space-x-1.5';
      }

      // Update Method Badge
      const methodBadge = document.getElementById('req-method-badge');
      methodBadge.textContent = config.method;
      methodBadge.className = 'px-2 py-0.5 rounded text-[11px] font-mono font-bold ' + config.badgeClass;

      // Render Dynamic Inputs
      document.getElementById('form-container').innerHTML = config.renderInputs();
      updateUrlPreview();
    }

    function updateUrlPreview() {
      const config = tabsConfig[activeTab];
      const req = config.buildRequest();
      document.getElementById('request-url-preview').textContent = req.method + ' ' + req.url;
    }

    async function executeCurrentEndpoint() {
      const config = tabsConfig[activeTab];
      const reqInfo = config.buildRequest();

      const runBtnText = document.getElementById('run-btn-text');
      const runSpinner = document.getElementById('run-spinner');
      const viewer = document.getElementById('response-json-viewer');
      const statusBadge = document.getElementById('response-status-badge');
      const timeBadge = document.getElementById('response-time-badge');

      runBtnText.textContent = 'Sending...';
      runSpinner.classList.remove('hidden');

      const startTime = performance.now();

      try {
        const fetchOptions = {
          method: reqInfo.method,
          headers: {
            'Accept': 'application/json'
          }
        };

        if (reqInfo.body) {
          fetchOptions.headers['Content-Type'] = 'application/json';
          fetchOptions.body = JSON.stringify(reqInfo.body);
        }

        const res = await fetch(reqInfo.url, fetchOptions);
        const duration = Math.round(performance.now() - startTime);
        timeBadge.textContent = duration + 'ms';

        // Status Badge Styling
        statusBadge.textContent = res.status + ' ' + res.statusText;
        if (res.status >= 200 && res.status < 300) {
          statusBadge.className = 'px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
        } else if (res.status >= 400 && res.status < 500) {
          statusBadge.className = 'px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30';
        } else {
          statusBadge.className = 'px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30';
        }

        const data = await res.json();
        lastResponseText = JSON.stringify(data, null, 2);
        viewer.textContent = lastResponseText;
      } catch (err) {
        statusBadge.textContent = 'Error';
        statusBadge.className = 'px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30';
        viewer.textContent = JSON.stringify({ success: false, error: err.message }, null, 2);
      } finally {
        runBtnText.textContent = 'Execute Request';
        runSpinner.classList.add('hidden');
      }
    }

    function copyResponseJson() {
      if (!lastResponseText) return;
      navigator.clipboard.writeText(lastResponseText).then(() => {
        const copyBtn = document.getElementById('copy-btn');
        const orig = copyBtn.innerHTML;
        copyBtn.innerHTML = '<span>✓ Copied!</span>';
        setTimeout(() => copyBtn.innerHTML = orig, 1500);
      });
    }

    // Initialize Dashboard with 'get-all' on load and execute initial fetch
    window.addEventListener('DOMContentLoaded', () => {
      setTab('get-all');
      executeCurrentEndpoint();
    });
  </script>
</body>
</html>`;
}

module.exports = { renderDashboardHtml };
