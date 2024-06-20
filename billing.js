document.addEventListener('DOMContentLoaded', async function () {
    const billingForm = document.getElementById('billing-form');
    const productSelect = document.getElementById('productSelect');
    const billTable = document.getElementById('bill-table').getElementsByTagName('tbody')[0];
    const totalProductsElement = document.getElementById('total-products');
    const totalAmountElement = document.getElementById('total-amount');

    let totalProducts = 0;
    let totalAmount = 0;

    // Fetch products and populate the select options
    async function loadProducts() {
        try {
            const response = await fetch('http://localhost:3000/products');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const products = await response.json();
            productSelect.innerHTML = ''; // Clear existing options
            products.forEach(product => {
                const option = document.createElement('option');
                option.value = JSON.stringify(product);
                option.textContent = `${product.name} (Stock: ${product.stock})`;
                productSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Failed to load products:', error);
        }
    }

    // Update totals
    function updateTotals(quantity, totalPrice, isAdding) {
        if (isAdding) {
            totalProducts += quantity;
            totalAmount += totalPrice;
        } else {
            totalProducts -= quantity;
            totalAmount -= totalPrice;
        }

        totalProductsElement.textContent = totalProducts;
        totalAmountElement.textContent = totalAmount.toFixed(2);
    }

    // Check if product is already in the bill
    function isProductInBill(productName) {
        const rows = billTable.getElementsByTagName('tr');
        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].getElementsByTagName('td');
            if (cells[0].textContent === productName) {
                return true;
            }
        }
        return false;
    }

    // Add product to bill
    billingForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const selectedProduct = JSON.parse(productSelect.value);
        const quantity = parseInt(document.getElementById('productQuantity').value);
        const price = parseFloat(selectedProduct.price);
        const totalPrice = price * quantity;

        // Validate quantity
        if (quantity <= 0) {
            alert("Quantity must be greater than zero.");
            return;
        }

        // Check if product is already in the bill
        if (isProductInBill(selectedProduct.name)) {
            alert("Product is already in the bill.");
            return;
        }

        // Check if stock is sufficient
        if (quantity > selectedProduct.stock) {
            alert(`Insufficient stock. Only ${selectedProduct.stock} units available.`);
            return;
        }

        console.log("Adding to bill: ", selectedProduct, quantity, totalPrice);  // Debugging

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${selectedProduct.name}</td>
            <td>${quantity}</td>
            <td>$${!isNaN(price) ? price.toFixed(2) : 'N/A'}</td>
            <td>$${!isNaN(totalPrice) ? totalPrice.toFixed(2) : 'N/A'}</td>
            <td><button class="delete-button">Remove</button></td>
        `;
        billTable.appendChild(row);

        // Update totals
        updateTotals(quantity, totalPrice, true);

        // Update stock
        selectedProduct.stock -= quantity;

        // Add event listener for delete button
        const deleteButton = row.querySelector('.delete-button');
        deleteButton.addEventListener('click', function () {
            billTable.removeChild(row);
            updateTotals(quantity, totalPrice, false);
            selectedProduct.stock += quantity; // Restore stock on delete
        });
    });

    loadProducts();
});
