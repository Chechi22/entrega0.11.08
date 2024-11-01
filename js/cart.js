let cantProductos = 0;

// Espera a que el contenido del documento esté completamente cargado
document.addEventListener("DOMContentLoaded", function() {
    // Obtiene el carrito del localStorage y lo convierte en un array
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');

    // Muestra los productos en la página
    displayCartItems(carrito);
    // Inicializa los eventos de botones y entradas
    initEventListeners();
    // Actualiza los totales al cargar
    updateTotals();
});

function displayCartItems(carrito) {
    const cartTableBody = document.getElementById("cart-table-body");
    // Limpia el contenido existente del cuerpo de la tabla
    cartTableBody.innerHTML = "";

    // Si el carrito está vacío, muestra una alerta y sale de la función
    if (carrito.length === 0) {
        swal("¡Carrito vacío!", "No hay productos en el carrito.", "warning");
        return; // Salir de la función si no hay productos
    }

    // Itera sobre cada producto en el carrito y lo agrega a la tabla
    carrito.forEach((producto, index) => {
        const row = createCartRow(producto, index);
        cartTableBody.appendChild(row);
    });

    // Asigna eventos a los botones de eliminación y cambios de cantidad
    attachDeleteButtons();
    attachQuantityChangeEvents();
}

// Crea una fila de la tabla para un producto
function createCartRow(producto, index) {
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
        <td class="col-sm-1 col-md-1 text-center subtotal">
            ${producto.currency} ${producto.subtotal.toFixed(2)}
        </td>
        <td class="col-sm-1 col-md-1">
            <button class="btn btn-danger" data-index="${index}">Eliminar</button>
        </td>
    `;
    return row; // Devuelve la fila creada
}

// Asigna eventos a los botones de eliminación
function attachDeleteButtons() {
    const deleteButtons = document.querySelectorAll(".btn-danger");
    deleteButtons.forEach(button => {
        button.addEventListener("click", function() {
            const index = this.getAttribute("data-index"); // Obtiene el índice del producto a eliminar
            removeProduct(index); // Llama a la función para eliminar el producto
        });
    });
}

// Asigna eventos para cambios en la cantidad de productos
function attachQuantityChangeEvents() {
    const quantityInputs = document.querySelectorAll('.quantity-input');
    quantityInputs.forEach(input => {
        input.addEventListener('change', () => {
            const index = input.getAttribute('data-index'); // Obtiene el índice del producto
            updateProductQuantity(index, input.value); // Llama a la función para actualizar la cantidad
        });
    });
}

// Elimina un producto del carrito
function removeProduct(index) {
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    carrito.splice(index, 1); // Elimina el producto del carrito
    localStorage.setItem('carrito', JSON.stringify(carrito)); // Guarda el carrito actualizado
    updateTotals(); // Actualiza los totales
    displayCartItems(carrito); // Muestra los productos restantes
}

// Actualiza la cantidad de un producto
function updateProductQuantity(index, quantity) {
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    const producto = carrito[index]; // Obtiene el producto a actualizar
    producto.quantity = Math.max(1, parseInt(quantity)); // Asegura que la cantidad no sea menos de 1
    producto.subtotal = producto.quantity * producto.cost; // Actualiza el subtotal

    localStorage.setItem('carrito', JSON.stringify(carrito)); // Guarda el carrito actualizado
    displayCartItems(carrito); // Muestra los productos actualizados
    updateTotals(); // Actualiza los totales
}

// Actualiza los totales del carrito
function updateTotals() {
    const rows = document.querySelectorAll('tbody tr');
    let subtotal = 0;

    // Suma los subtotales de cada fila
    rows.forEach(row => {
        const total = parseFloat(row.querySelector('.subtotal').textContent.replace(/[^0-9.-]+/g,"")) || 0;
        subtotal += total; // Suma el subtotal
    });

    // Actualiza el subtotal en el DOM
    const subtotalElement = document.getElementById('subtotal');
    if (subtotalElement) {
        subtotalElement.textContent = `${rows[0].querySelector('.price').textContent.split(' ')[0]} ${subtotal.toFixed(2)}`;
    }

    const shippingCost = 0.00; // Costo de envío fijo (puede ser modificado)
    const total = subtotal + shippingCost; // Calcula el total

    // Actualiza el total en el DOM
    const totalElement = document.getElementById('total');
    if (totalElement) {
        totalElement.textContent = `${rows[0].querySelector('.price').textContent.split(' ')[0]} ${total.toFixed(2)}`;
    }
}
