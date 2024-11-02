let cantProductos = 0;
document.addEventListener("DOMContentLoaded", function() {
    // Obtiene el carrito del localStorage y lo convierte en un array
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    
    // Muestra los productos en la página
    displayCartItems(carrito);

    // Inicializa los eventos de botones y entradas
    initEventListeners();

    // Actualiza totales iniciales al cargar
    updateTotals();
});

function displayCartItems(carrito) {
    const cartTableBody = document.getElementById("cart-table-body");

    carrito.forEach(producto => {
        // Crea elementos HTML para cada producto del carrito
        const row = document.createElement("tr");   // Crea una nueva fila para cada producto

        row.innerHTML = `
        <td class="col-sm-8 col-md-6">
            <h4>${producto.name}</h4> 
            <p>${producto.description}</p> 
        </td>
        <td class="col-sm-1 col-md-1" style="text-align: center">
            <input type="number" value="${producto.quantity}" min="1" class="quantity-input" style="width: 60px; text-align: center"> 
        </td>
        <td class="col-sm-1 col-md-1 text-center">
            <span class="price">${producto.currency} ${producto.cost}</span> <!-- Precio unitario -->
        </td>
        <td class="col-sm-1 col-md-1 text-center">
            <span class="subtotal">${producto.currency} ${producto.subtotal.toFixed(2)}</span> <!-- Subtotal del producto -->
        </td>
        <td class="col-sm-1 col-md-1">
            <button class="btn btn-danger">Eliminar</button> <!-- Botón para eliminar el producto -->
        </td>
    `;

        // Agregar la fila creada al cuerpo de la tabla
        cartTableBody.appendChild(row);
        cantProductos += 1;
    });
}

// Inicializa eventos de botones y entradas
function initEventListeners() {
    const removeButtons = document.querySelectorAll('.btn-danger');
    const quantityInputs = document.querySelectorAll('.quantity-input');

    removeButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.closest('tr').remove();
            updateTotals();
        });
    });

    quantityInputs.forEach(input => {
        input.addEventListener('change', () => {
            updateRowTotal(input);
            updateTotals();
        });
    });
}

// Función para actualizar el total de una fila
function updateRowTotal(input) {
    const row = input.closest('tr');
    const price = parseFloat(row.querySelector('.price').textContent.replace(/[^0-9.-]+/g,""));
    const quantity = Math.max(parseInt(input.value) || 0, 0); // Asegura que no sea negativo
    const total = quantity * price;

    row.querySelector('.subtotal').textContent = `${row.querySelector('.price').textContent.split(' ')[0]} ${total.toFixed(2)}`;
}

// Función para actualizar los totales de la tabla
function updateTotals() {
    const rows = document.querySelectorAll('tbody tr');
    let subtotal = 0;

    rows.forEach(row => {
        const total = parseFloat(row.querySelector('.subtotal').textContent.replace(/[^0-9.-]+/g,"")) || 0;
        subtotal += total;
    });

    // Actualiza el subtotal
    const subtotalElement = document.getElementById('subtotal');
    if (subtotalElement) {
        subtotalElement.textContent = `${rows[0].querySelector('.price').textContent.split(' ')[0]} ${subtotal.toFixed(2)}`;
    }

    const shippingCost = 0.00; // Opcional Costo de envío fijo
    const total = subtotal + shippingCost;

    // Actualiza el total
    const totalElement = document.getElementById('total');
    if (totalElement) {
        totalElement.textContent = `${rows[0].querySelector('.price').textContent.split(' ')[0]} ${total.toFixed(2)}`;
    }
}

document.addEventListener("DOMContentLoaded", function() {
    localStorage.setItem('cantProductos', cantProductos);
});
