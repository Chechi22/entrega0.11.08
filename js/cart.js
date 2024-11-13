let cantProductos = 0;

document.addEventListener("DOMContentLoaded", function () {
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    displayCartItems(carrito);
    document.getElementById('tipoEnvio').addEventListener('change', updateTotals);
    updateCantProductos();
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
    cartTableBody.innerHTML = "";

    // Si el carrito está vacío
    if (carrito.length === 0) {
        swal("¡Carrito vacío!", "No hay productos en el carrito.", "warning");
        
        // Establecemos todos los totales a 0
        document.getElementById('subtotal').textContent = "USD 0.00";
        document.getElementById('costoEnvio').textContent = "USD 0.00";
        document.getElementById('total').textContent = "USD 0.00";
        return;
    }

    carrito.forEach((producto, index) => {
        const row = document.createElement("tr");
        let productSubtotalInUSD = producto.subtotal;

        if (producto.currency === "UYU") {
            const exchangeRate = 40;
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
                ${producto.currency} ${producto.cost}
            </td>
            <td class="col-sm-1 col-md-1 text-center">
                USD ${productSubtotalInUSD}
            </td>
            <td class="col-sm-1 col-md-1">
                <button class="btn btn-danger" id="btnClear" data-index="${index}">Eliminar</button>
            </td>
        `;

        cartTableBody.appendChild(row);
    });

    updateCantProductos();
    attachDeleteButtons();
    attachQuantityChangeEvents();
    updateTotals(); // Actualiza los totales después de mostrar los productos
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

// Función para actualizar la cantidad de un producto
function updateProductQuantity(index, quantity) {
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    const producto = carrito[index];
    producto.quantity = Math.max(1, parseInt(quantity));
    producto.subtotal = producto.quantity * producto.cost;

    localStorage.setItem('carrito', JSON.stringify(carrito));
    displayCartItems(carrito);
}

// Función para eliminar un producto del carrito
function removeProduct(index) {
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    updateCantProductos();
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
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    
    // Si el carrito está vacío, establecer todos los totales a 0
    if (carrito.length === 0) {
        document.getElementById('subtotal').textContent = "USD 0.00";
        document.getElementById('costoEnvio').textContent = "USD 0.00";
        document.getElementById('total').textContent = "USD 0.00";
        return;
    }

    // Si hay productos, calcular normalmente
    const rows = document.querySelectorAll('tbody tr');
    let subtotal = 0;

    rows.forEach(row => {
        const total = parseFloat(row.querySelector('td:nth-child(5)').textContent.replace('USD ', '')) || 0;
        subtotal += total;
    });

    // Actualiza el subtotal en la sección de costos finales
    document.getElementById('subtotal').textContent = `USD ${subtotal.toFixed(2)}`;

    // Calcula el costo de envío
    const tipoEnvio = document.getElementById('tipoEnvio').value;
    let shippingCost = 0;

    if (tipoEnvio === "premium") {
        shippingCost = subtotal * 0.15;
    } else if (tipoEnvio === "express") {
        shippingCost = subtotal * 0.07;
    } else if (tipoEnvio === "standard") {
        shippingCost = subtotal * 0.05;
    }

    // Actualiza el costo de envío en la sección de costos finales
    document.getElementById('costoEnvio').textContent = `USD ${shippingCost.toFixed(2)}`;

    // Calcula y actualiza el total final
    const total = subtotal + shippingCost;
    document.getElementById('total').textContent = `USD ${total.toFixed(2)}`;
}


    // Llamar a updateTotals al cargar la página para el cálculo inicial
    updateTotals();

    // Agregar el evento change al select de tipo de envío porque el usuario puede cambiar de opinión y elegir otro tipo de envío
    document.getElementById('tipoEnvio').addEventListener('change', updateTotals);

    // Al cargar el DOM, establece la cantidad de productos
    document.addEventListener('DOMContentLoaded', function(){
    updateCantProductos();
});
