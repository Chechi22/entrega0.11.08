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

    // Limpia el contenido existente del cuerpo de la tabla
    cartTableBody.innerHTML = "";

    carrito.forEach((producto, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td class="col-sm-2 col-md-2 text-center">
                <img src="${producto.image}" alt="${producto.name}" class="img-thumbnail">
            </td>
            <td class="col-sm-8 col-md-6">
                <h4>${producto.name}</h4> 
                <p>${producto.description}</p> 
            </td>
            <td class="col-sm-1 col-md-1" style="text-align: center">
                <input type="number" value="${producto.quantity}" min="1" class="quantity-input" style="width: 60px; text-align: center" data-index="${index}"> 
            </td>
            <td class="col-sm-1 col-md-1 text-center">
                ${producto.currency} ${producto.cost}
            </td>
            <td class="col-sm-1 col-md-1 text-center">
                ${producto.currency} ${producto.subtotal.toFixed(2)}
            </td>
            <td class="col-sm-1 col-md-1">
                <button class="btn btn-danger" data-index="${index}">Eliminar</button>
            </td>
        `;

        cartTableBody.appendChild(row);
    });

    // Asigna el evento de eliminación a cada botón
    const deleteButtons = document.querySelectorAll(".btn-danger");
    deleteButtons.forEach(button => {
        button.addEventListener("click", function() {
            const index = this.getAttribute("data-index");
            removeProduct(index);
        });
    });

    // Asigna el evento para cambiar las cantidades
    const quantityInputs = document.querySelectorAll('.quantity-input');
    quantityInputs.forEach(input => {
        input.addEventListener('change', () => {
            const index = input.getAttribute('data-index');
            updateProductQuantity(index, input.value);
        });
    });
}

function removeProduct(index) {
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    updateTotals();
    displayCartItems(carrito);
}

function updateProductQuantity(index, quantity) {
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    const producto = carrito[index];
    producto.quantity = Math.max(1, parseInt(quantity)); // Asegura que no sea menos de 1
    producto.subtotal = producto.quantity * producto.cost; // Actualiza el subtotal

    localStorage.setItem('carrito', JSON.stringify(carrito));
    displayCartItems(carrito);
    updateTotals();
}

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
