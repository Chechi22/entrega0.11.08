
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
    const exchangeRate = 40; // Tasa de cambio fija de 1 USD = 40 UYU

    // Limpia el contenido existente del cuerpo de la tabla
    cartTableBody.innerHTML = "";

    // Variable para acumular el total general
    let totalGeneral = 0;

    carrito.forEach((producto, index) => {
        const row = document.createElement("tr");

        // Subtotal en USD si el producto está en UYU, o directamente en USD si ya lo está
        let productSubtotalInUSD = producto.subtotal;
        if (producto.currency === "UYU") {
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
                ${producto.quantity} 
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

        cartTableBody.appendChild(row);

        // Suma el subtotal al total general
        totalGeneral += parseFloat(productSubtotalInUSD); 
    });

    const tfoot = document.querySelector("tfoot");
    if (tfoot) {
        tfoot.innerHTML = `
            <tr>
                <td colspan="4" class="text-right"><strong>Total General:</strong></td>
                <td class="text-center">USD ${totalGeneral.toFixed(2)}</td> <!-- Cambia aquí -->
                <td></td>
            </tr>
        `;
    }

// Asigna el evento de eliminación a cada botón
const deleteButtons = document.querySelectorAll(".btn-danger");
// Recorre todos los botones de eliminación encontrados
deleteButtons.forEach(button => {
    // Asigna un evento de clic a cada botón
    button.addEventListener("click", function() {
        // Obtiene el índice del producto desde el atributo "data-index" del botón
        const index = this.getAttribute("data-index");
        
        // Llama a la función removeProduct y pasa el índice para eliminar el producto del carrito
        removeProduct(index);
    });
});

function removeProduct(index) {
    // Obtiene el carrito actual del localStorage
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');

    // Elimina el producto en el índice especificado
    carrito.splice(index, 1);

    // Actualiza el carrito en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Actualiza los totales después de eliminar un producto
    updateTotals();

    // Actualiza la lista de productos mostrados
    displayCartItems(carrito);
}

// Inicializa eventos de botones y entradas
function initEventListeners() {
    const removeButtons = document.querySelectorAll('.btn-danger');
    const quantityInputs = document.querySelectorAll('input[type="number"]');

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
    const price = parseFloat(row.querySelector('td:nth-child(3) strong').textContent.replace('$', ''));
    const quantity = Math.max(parseInt(input.value) || 0, 0); // Asegura que no sea negativo
    const total = quantity * price;

    row.querySelector('td:nth-child(4) strong').textContent = `$${total.toFixed(2)}`;
}

// Función para actualizar los totales de la tabla
function updateTotals() {
    const rows = document.querySelectorAll('tbody tr');
    let subtotal = 0;

    rows.forEach(row => {
        const total = parseFloat(row.querySelector('td:nth-child(4) strong')?.textContent.replace('$', '')) || 0;
        subtotal += total;
    });

    // Actualiza el subtotal
    const subtotalElement = document.getElementById('subtotal');
    if (subtotalElement) {
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    }

    const shippingCost = 0.00; // Opcional Costo de envío fijo
    const total = subtotal + shippingCost;

    // Actualiza el total
    const totalElement = document.getElementById('total');
    if (totalElement) {
        totalElement.textContent = `$${total.toFixed(2)}`;
    }
}
}
