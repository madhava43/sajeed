document.addEventListener('DOMContentLoaded', function () {
    const adminForm = document.getElementById('admin-form');
    const productTable = document.getElementById('product-table').getElementsByTagName('tbody')[0];

    const loadProducts = async () => {
        try {
            const response = await fetch('http://localhost:3000/products');
            if (!response.ok) throw new Error('Network response was not ok');
            const products = await response.json();
            productTable.innerHTML = ''; // Clear existing rows
            products.forEach(product => addProductToTable(product));
        } catch (error) {
            console.error('Failed to load products:', error);
        }
    };

    const addProductToTable = (product) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.description}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.stock}</td>
            <td>
                <button class="edit-button" data-id="${product.id}">Edit</button>
                <button class="delete-button" data-id="${product.id}">Delete</button>
            </td>
        `;
        productTable.appendChild(row);

        const editButton = row.querySelector('.edit-button');
        const deleteButton = row.querySelector('.delete-button');

        editButton.addEventListener('click', () => editProduct(product));
        deleteButton.addEventListener('click', () => deleteProduct(product.id));
    };

    const addProduct = async (product) => {
        try {
            const response = await fetch('http://localhost:3000/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(product)
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const newProduct = await response.json();
            addProductToTable(newProduct);
        } catch (error) {
            console.error('Failed to add product:', error);
        }
    };

    const updateProduct = async (product) => {
        try {
            const response = await fetch(`http://localhost:3000/products/${product.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(product)
            });
            if (!response.ok) throw new Error('Network response was not ok');
            await loadProducts();
        } catch (error) {
            console.error('Failed to update product:', error);
        }
    };

    const deleteProduct = async (productId) => {
        try {
            const response = await fetch(`http://localhost:3000/products/${productId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Network response was not ok');
            await loadProducts();
        } catch (error) {
            console.error('Failed to delete product:', error);
        }
    };

    const editProduct = (product) => {
        document.getElementById('productName').value = product.name;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productStock').value = product.stock;
        adminForm.dataset.id = product.id;
    };

    adminForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const productName = document.getElementById('productName').value;
        const productDescription = document.getElementById('productDescription').value;
        const productPrice = parseFloat(document.getElementById('productPrice').value);
        const productStock = parseInt(document.getElementById('productStock').value);

        const product = {
            name: productName,
            description: productDescription,
            price: productPrice,
            stock: productStock
        };

        if (adminForm.dataset.id) {
            product.id = parseInt(adminForm.dataset.id);
            updateProduct(product);
        } else {
            addProduct(product);
        }

        adminForm.reset();
        delete adminForm.dataset.id;
    });

    loadProducts();
});
