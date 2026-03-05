async function loadCategories() {
  const el = document.getElementById('categories');
  el.innerHTML = '<p class="text-gray-500">Loading...</p>';
  try {
    const res = await fetch('/api/categories');
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      el.innerHTML = '<p class="text-gray-600">No categories found.</p>';
      return;
    }

    el.innerHTML = data.map(cat => {
      return `
      <a href="/category.html?id=${cat._id}" class="block bg-white rounded shadow hover:shadow-md overflow-hidden">
        <div class="p-4">
          <h3 class="font-medium">${escapeHtml(cat.name)}</h3>
          <p class="text-sm text-gray-600 mt-1">${escapeHtml(cat.description || '')}</p>
        </div>
      </a>
    `}).join('');
  } catch (err) {
    el.innerHTML = `<p class="text-red-600">Error loading categories</p>`;
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

document.addEventListener('DOMContentLoaded', loadCategories);
