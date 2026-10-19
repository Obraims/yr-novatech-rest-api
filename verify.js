const http = require('http');
const app = require('./server');

const PORT = 5055;
process.env.PORT = PORT;

const server = app.listen(PORT, async () => {
  console.log(`🧪 Test server started on http://localhost:${PORT}`);

  const request = (path, options = {}, body = null) => {
    return new Promise((resolve, reject) => {
      const req = http.request(`http://localhost:${PORT}${path}`, options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, headers: res.headers, body: data });
          }
        });
      });
      req.on('error', reject);
      if (body) {
        req.write(typeof body === 'string' ? body : JSON.stringify(body));
      }
      req.end();
    });
  };

  try {
    console.log('\n--- Test 1: GET / (Health Check) ---');
    const healthRes = await request('/');
    console.log('Status:', healthRes.status);
    console.log('Success:', healthRes.body.success, '| Message:', healthRes.body.message);
    if (healthRes.status !== 200) throw new Error('Health check failed');

    // Wait 500ms for sqlite seed if async
    await new Promise(r => setTimeout(r, 600));

    console.log('\n--- Test 2: GET /api/transactions (Seeded Data) ---');
    const allRes = await request('/api/transactions');
    console.log('Status:', allRes.status);
    console.log('Count:', allRes.body.count);
    console.log('First Record Title:', allRes.body.data[0]?.title);
    if (allRes.status !== 200 || allRes.body.count < 3) throw new Error('Transactions check failed');

    console.log('\n--- Test 3: POST /api/transactions (Create Valid) ---');
    const createRes = await request('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      title: 'Automated Test Transaction',
      amount: 888.50,
      type: 'income',
      category: 'Testing'
    });
    console.log('Status:', createRes.status);
    console.log('Created ID:', createRes.body.data?.id);
    if (createRes.status !== 201) throw new Error('Create transaction failed');
    const createdId = createRes.body.data.id;

    console.log('\n--- Test 4: GET /api/transactions/:id ---');
    const singleRes = await request(`/api/transactions/${createdId}`);
    console.log('Status:', singleRes.status);
    console.log('Fetched Title:', singleRes.body.data?.title);
    if (singleRes.status !== 200) throw new Error('Single transaction fetch failed');

    console.log('\n--- Test 5: PUT /api/transactions/:id (Update) ---');
    const updateRes = await request(`/api/transactions/${createdId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    }, {
      title: 'Updated Test Transaction',
      amount: 999.00,
      type: 'income',
      category: 'Updated Category'
    });
    console.log('Status:', updateRes.status);
    console.log('Updated Amount:', updateRes.body.data?.amount);
    if (updateRes.status !== 200) throw new Error('Update transaction failed');

    console.log('\n--- Test 6: DELETE /api/transactions/:id ---');
    const deleteRes = await request(`/api/transactions/${createdId}`, {
      method: 'DELETE'
    });
    console.log('Status:', deleteRes.status);
    console.log('Deleted ID:', deleteRes.body.deletedId);
    if (deleteRes.status !== 200) throw new Error('Delete transaction failed');

    console.log('\n--- Test 7: POST /api/transactions (Validation Error Test) ---');
    const invalidRes = await request('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      title: '',
      amount: -10,
      type: 'invalid_type',
      category: ''
    });
    console.log('Status (expect 400):', invalidRes.status);
    console.log('Errors caught:', invalidRes.body.errors?.length);
    if (invalidRes.status !== 400 || !invalidRes.body.errors) throw new Error('Validation error check failed');

    console.log('\n--- Test 8: GET /api-docs (Swagger UI CDN) ---');
    const swaggerRes = await request('/api-docs');
    console.log('Status:', swaggerRes.status);
    console.log('Contains CDN CSS:', typeof swaggerRes.body === 'string' && swaggerRes.body.includes('cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css'));
    console.log('Contains CDN JS:', typeof swaggerRes.body === 'string' && swaggerRes.body.includes('cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.js'));
    if (swaggerRes.status !== 200 || !swaggerRes.body.includes('swagger-ui-bundle.js')) throw new Error('Swagger UI CDN check failed');

    console.log('\n--- Test 9: GET / with Accept: text/html (Interactive HTML Dashboard) ---');
    const htmlRes = await request('/', { headers: { 'Accept': 'text/html' } });
    console.log('Status:', htmlRes.status);
    console.log('Content-Type:', htmlRes.headers['content-type']);
    const isHtml = typeof htmlRes.body === 'string' && htmlRes.body.includes('Online &amp; Connected to SQLite') && htmlRes.body.includes('transactions');
    console.log('Contains Dashboard Markers:', isHtml);
    if (htmlRes.status !== 200 || !isHtml) throw new Error('HTML dashboard check failed');

    console.log('\n--- Test 10: GET /api/health (Raw JSON Health Check) ---');
    const healthApiRes = await request('/api/health');
    console.log('Status:', healthApiRes.status);
    console.log('Success:', healthApiRes.body.success, '| Platform:', healthApiRes.body.platform);
    if (healthApiRes.status !== 200 || !healthApiRes.body.success) throw new Error('/api/health check failed');

    console.log('\n🎉 ALL 10 TESTS PASSED SUCCESSFULLY! The REST API, HTML Dashboard & Swagger UI are 100% operational.\n');
  } catch (err) {
    console.error('❌ Test execution error:', err.message);
    process.exitCode = 1;
  } finally {
    server.close(() => {
      console.log('🛑 Test server stopped.');
      process.exit(process.exitCode || 0);
    });
  }
});
