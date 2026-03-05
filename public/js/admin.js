function el(id) { return document.getElementById(id); }

function show(obj, status) {
  const out = el('output');
  const payload = { status: status || (obj && obj.status) || 'ok', data: obj };
  out.textContent = JSON.stringify(payload, null, 2);
}

async function api(path, method='GET', body) {
  const opts = { method, headers: {} };
  if (body) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(path, opts);
  const text = await res.text();
  try { return { status: res.status, body: JSON.parse(text) }; } catch(e) { return { status: res.status, body: text }; }
}

function sampleCategory() {
  const id = Math.random().toString(36).slice(2,8);
  return { name: `Category ${id}`, description: `Sample category ${id}` };
}

function sampleProduct(categoryId) {
  const id = Math.random().toString(36).slice(2,8);
  return { name: `Product ${id}`, description: `Sample product ${id}`, price: Math.floor(Math.random()*100)+1, sku: `sku-${id}`, categoryId };
}

function clearCategoryInputs() {
  const categoryName = el('cat-name');
  const categoryDescription = el('cat-desc');
  if (categoryName) categoryName.value = '';
  if (categoryDescription) categoryDescription.value = '';
}

function clearProductInputs() {
  const productName = el('prod-name');
  const productPrice = el('prod-price');
  const productCategory = el('prod-category');
  if (productName) productName.value = '';
  if (productPrice) productPrice.value = '';
  if (productCategory) productCategory.value = '';
}

el('btn-list-cats').addEventListener('click', async () => {
  show({});
  const r = await api('/api/categories');
  show(r.body, `HTTP ${r.status}`);
});

el('btn-list-prods').addEventListener('click', async () => {
  show({});
  const r = await api('/api/products');
  show(r.body, `HTTP ${r.status}`);
});

el('btn-add-cat').addEventListener('click', async () => {
  const name = el('cat-name')?.value.trim();
  const description = el('cat-desc')?.value.trim();
  const body = {
    ...(name ? { name } : sampleCategory()),
    ...(description ? { description } : {})
  };

  const r = await api('/api/categories', 'POST', body);
  show(r.body, `HTTP ${r.status}`);
  if (r.status >= 200 && r.status < 300) {
    clearCategoryInputs();
  }
});

el('btn-add-prod').addEventListener('click', async () => {
  const name = el('prod-name')?.value.trim();
  const priceRaw = el('prod-price')?.value;
  const categoryId = el('prod-category')?.value.trim();
  const parsedPrice = Number(priceRaw);
  const body = name && Number.isFinite(parsedPrice)
    ? { name, price: parsedPrice, ...(categoryId ? { categoryId } : {}) }
    : sampleProduct(categoryId || undefined);

  const r = await api('/api/products', 'POST', body);
  show(r.body, `HTTP ${r.status}`);
  if (r.status >= 200 && r.status < 300) {
    clearProductInputs();
  }
});

el('btn-clear').addEventListener('click', () => {
  el('output').textContent = '';
});

// initial ready
show({ service: 'Catalog API invoker ready' });
