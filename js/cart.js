
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

    // Obtiene el subtotal del producto en USD si ya está en esa moneda,
    // o realiza la conversión si el subtotal está en UYU.  
    let productSubtotalInUSD = producto.subtotal;  // Inicialmente asigna el subtotal tal cual

    // Verifica si la moneda del producto es UYU para realizar la conversión
    if (producto.currency === "UYU") {
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
        // Convertimos el subtotal del producto a un número decimal con parseFloat()
        totalGeneral += parseFloat(productSubtotalInUSD); 
    });

    // Selecciona el elemento <tfoot> de la tabla en el documento
    const tfoot = document.querySelector("tfoot");

// Verifica si el elemento <tfoot> existe en la página
if (tfoot) {
    // Establece el contenido HTML del <tfoot> con una fila para el total general
    tfoot.innerHTML = `
        <tr>
            <!-- Celda que ocupa 4 columnas y alinea el texto a la derecha, mostrando "Total General:" en negrita -->
            <td colspan="4" class="text-right"><strong>Total General:</strong></td>
            
            <!-- Celda que muestra el total general en USD, formateado a dos decimales, y alineado al centro -->
            <td class="text-center">USD ${totalGeneral.toFixed(2)}</td> 
            
            <!-- Celda vacía para mantener el diseño de la tabla -->
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
