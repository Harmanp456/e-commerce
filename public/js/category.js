function qs(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

async function loadCategory() {
  const id = qs('id');
  if (!id) {
    document.getElementById('category-name').textContent = 'Category not specified';
    return;
  }

  try {
    const res = await fetch(`/api/categories/${id}`);
    if (!res.ok) {
      document.getElementById('category-name').textContent = 'Category not found';
      return;
    }
    const cat = await res.json();
    document.getElementById('category-name').textContent = cat.name;
    document.getElementById('category-desc').textContent = cat.description || '';

    const productsEl = document.getElementById('products');
    const products = cat.products || [];
    if (!products.length) {
      productsEl.innerHTML = '<p class="text-gray-600">No products in this category.</p>';
      return;
    }

    productsEl.innerHTML = products.map(p => {
      return `
      <div class="bg-white rounded shadow overflow-hidden">
        <div class="p-4">
          <h3 class="font-medium">${escapeHtml(p.name)}</h3>
          <p class="text-sm text-gray-600 mt-1">${escapeHtml(p.description || '')}</p>
          <div class="mt-3 text-sm font-semibold">$${p.price?.toFixed(2) ?? '0.00'}</div>
        </div>
      </div>
    `}).join('');
  } catch (err) {
    document.getElementById('category-name').textContent = 'Error loading category';
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

document.addEventListener('DOMContentLoaded', loadCategory);
