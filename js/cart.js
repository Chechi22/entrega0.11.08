let cantProductos = 0;

document.addEventListener("DOMContentLoaded", function () {
    // Obtiene el carrito del localStorage y lo convierte en un array
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');

    // Muestra los productos en la página
    displayCartItems(carrito);

    // Inicializa los eventos de botones y entradas
    initEventListeners();

    // Actualiza totales iniciales al cargar
    updateTotals();
});

// Función para actualizar la cantidad de productos en el carrito
function updateCantProductos() {
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    const totalCant = carrito.reduce((acc, producto) => acc + producto.quantity, 0);
    localStorage.setItem('cantProductos', totalCant);
    document.getElementById('cantCarrito').innerText = totalCant;
}

function displayCartItems(carrito) {
    const cartTableBody = document.getElementById("cart-table-body");
    // Limpia el contenido existente del cuerpo de la tabla
    cartTableBody.innerHTML = "";

    // Si el carrito está vacío, muestra una alerta y sale de la función
    if (carrito.length === 0) {
        swal("¡Carrito vacío!", "No hay productos en el carrito.", "warning");
        return; // Salir de la función si no hay productos
    }

    // Variable para acumular el total general
    let totalGeneral = 0;

    carrito.forEach((producto, index) => {
        const row = document.createElement("tr");

        // Obtiene el subtotal del producto en USD si ya está en esa moneda,
        // o realiza la conversión si el subtotal está en UYU.  
        let productSubtotalInUSD = producto.subtotal;  // Inicialmente asigna el subtotal tal cual

        // Verifica si la moneda del producto es UYU para realizar la conversión
        if (producto.currency === "UYU") {
            const exchangeRate = 40; // Tasa de cambio fija de 1 USD = 40 UYU
            // Convierte el subtotal de UYU a USD usando la tasa de cambio (exchangeRate) y limita a 2 decimales
            productSubtotalInUSD = (producto.subtotal / exchangeRate).toFixed(2);
        }

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
                ${producto.currency} ${producto.cost} <!-- Precio en moneda original -->
            </td>
            <td class="col-sm-1 col-md-1 text-center">
                USD ${productSubtotalInUSD} <!-- Subtotal siempre en USD -->
            </td>
            <td class="col-sm-1 col-md-1">
                <button class="btn btn-danger" id="btnClear" data-index="${index}">Eliminar</button>
            </td>
        `;

        // Agregar la fila creada al cuerpo de la tabla
        cartTableBody.appendChild(row);

        // Suma el subtotal al total general
        totalGeneral += parseFloat(productSubtotalInUSD); 
    });

    // Selecciona el elemento <tfoot> de la tabla en el documento
    const tfoot = document.querySelector("tfoot");
    // Verifica si el elemento <tfoot> existe en la página
    if (tfoot) {
        // Establece el contenido HTML del <tfoot> con una fila para el total general
        tfoot.innerHTML = `
            <tr>
                <td colspan="4" class="text-right"><strong>Total General:</strong></td>
                <td class="text-center">USD ${totalGeneral.toFixed(2)}</td> 
                <td></td>
            </tr>
        `;
    }

    // Actualiza la cantidad de productos
    updateCantProductos();

    // Asigna eventos a los botones de eliminación y cambios de cantidad
    attachDeleteButtons();
    attachQuantityChangeEvents();
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

// Elimina un producto del carrito
function removeProduct(index) {
    // Obtiene el carrito actual del localStorage
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');

    // Elimina el producto en el índice especificado
    carrito.splice(index, 1);

    // Actualiza el carrito en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Actualiza la cantidad de productos
    updateCantProductos();

    // Actualiza los totales después de eliminar un producto
    updateTotals();

    // Actualiza la lista de productos mostrados
    displayCartItems(carrito);
}

// Función para actualizar el total de una fila
function updateRowTotal(input) {
    const row = input.closest('tr');
    const price = parseFloat(row.querySelector('td:nth-child(4)').textContent.replace('USD ', ''));
    const quantity = Math.max(parseInt(input.value) || 0, 0); // Asegura que no sea negativo
    const total = quantity * price;

    row.querySelector('td:nth-child(5)').textContent = `USD ${total.toFixed(2)}`;
}

// Función para actualizar los totales de la tabla
function updateTotals() {
    const rows = document.querySelectorAll('tbody tr');
    let subtotal = 0;

    rows.forEach(row => {
        const total = parseFloat(row.querySelector('td:nth-child(5)').textContent.replace('USD ', '')) || 0;
        subtotal += total;
    });

    // Actualiza el subtotal
    const subtotalElement = document.getElementById('subtotal');
    if (subtotalElement) {
        subtotalElement.textContent = `USD ${subtotal.toFixed(2)}`;
    }

    const shippingCost = 0.00; // Opcional Costo de envío fijo
    const total = subtotal + shippingCost;

    // Actualiza el total
    const totalElement = document.getElementById('total');
    if (totalElement) {
        totalElement.textContent = `USD ${total.toFixed(2)}`;
    }
}

// Al cargar el DOM, establece la cantidad de productos
document.addEventListener('DOMContentLoaded', function(){
    updateCantProductos();
});
