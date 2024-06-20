document.addEventListener('DOMContentLoaded', function () {
    const productForm = document.getElementById('product-form');
    const successMessage = document.getElementById('success-message');
    const adminProductTable = document.getElementById('admin-product-table').getElementsByTagName('tbody')[0];

    if (productForm) {
        productForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const productName = document.getElementById('productName').value;
            const productDescription = document.getElementById('productDescription').value;
            const productPrice = document.getElementById('productPrice').value;
            const productQuantity = document.getElementById('productQuantity').value;

            const product = {
                name: productName,
                description: productDescription,
                price: productPrice,
                quantity: productQuantity
            };

            const response = await fetch('http://localhost:3000/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });

            if (response.ok) {
                successMessage.style.display = 'block';
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 3000);
                displayProducts();
                productForm.reset();
            }
        });
    }

    async function displayProducts() {
        adminProductTable.innerHTML = '';
        const response = await fetch('http://localhost:3000/products');
        const products = await response.json();
        products.forEach((product, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${product.name}</td>
                <td>${product.description}</td>
                <td>$${product.price}</td>
                <td>${product.quantity}</td>
                <td><button class="delete-button" data-id="${product.id}">Delete</button></td>
            `;
            adminProductTable.appendChild(row);
        });

        const deleteButtons = document.querySelectorAll('.delete-button');
        deleteButtons.forEach(button => {
            button.addEventListener('click', async function () {
                const id = this.getAttribute('data-id');
                await fetch(`http://localhost:3000/products/${id}`, {
                    method: 'DELETE'
                });
                displayProducts();
            });
        });
    }

    displayProducts();
});
