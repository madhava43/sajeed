document.addEventListener('DOMContentLoaded', async function () {
    const productTable = document.getElementById('product-table').getElementsByTagName('tbody')[0];

    async function loadProducts() {
        try {
            const response = await fetch('http://localhost:3000/products');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const products = await response.json();
            productTable.innerHTML = ''; // Clear existing rows
            products.forEach((product, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${product.name}</td>
                    <td>${product.description}</td>
                    <td>$${product.price.toFixed(2)}</td>
                    <td>${product.stock}</td>
                `;
                productTable.appendChild(row);
            });
        } catch (error) {
            console.error('Failed to load products:', error);
        }
    }

    loadProducts();
});
