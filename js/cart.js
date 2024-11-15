let cantProductos = 0;
// Obtener el valor del usuario logueado (login.js) desde Local Storage
const emailUsuarioLogueado = localStorage.getItem("usuarioLogueado");

document.addEventListener("DOMContentLoaded", function () {
    // Obtiene el carrito del localStorage y lo convierte en un array
    const carrito = JSON.parse(localStorage.getItem('carrito-'+emailUsuarioLogueado) || '[]');

    // Muestra los productos en la página
    displayCartItems(carrito);
    document.getElementById('tipoEnvio').addEventListener('change', updateTotals);
    updateCantProductos();
    ocultarDetalleTarjeta();
});

// Función para actualizar la cantidad de productos en el carrito
function updateCantProductos() {
    const carrito = JSON.parse(localStorage.getItem('carrito-'+emailUsuarioLogueado) || '[]');
    const totalCant = carrito.reduce((acc, producto) => acc + producto.quantity, 0);
    localStorage.setItem('cantProductos-'+emailUsuarioLogueado, totalCant);
    document.getElementById('cantCarrito').innerText = totalCant;
}

function displayCartItems(carrito) {
    const cartTableBody = document.getElementById("cart-table-body");
    cartTableBody.innerHTML = "";

    // Si el carrito está vacío
    if (carrito.length === 0) {
        swal.fire({
            icon: 'warning',
            title: '¡Carrito vacío!',
            text: 'No hay productos en el carrito.',
            confirmButtonText: 'Aceptar',
            timer: 3000
        });
        
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
            <td class="col-sm-1 col-md-1 text-center">
                ${producto.currency} ${producto.cost}
            </td>
            <td class="col-sm-1 col-md-1" style="text-align: center">
                <input type="number" value="${producto.quantity}" min="1" class="quantity-input" style="width: 60px; text-align: center" data-index="${index}"> 
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
    const carrito = JSON.parse(localStorage.getItem('carrito-'+emailUsuarioLogueado) || '[]');
    const producto = carrito[index]; // Obtiene el producto a actualizar
    producto.quantity = Math.max(1, parseInt(quantity)); // Asegura que la cantidad no sea menos de 1
    producto.subtotal = producto.quantity * producto.cost; // Actualiza el subtotal

    localStorage.setItem('carrito-'+emailUsuarioLogueado, JSON.stringify(carrito)); // Guarda el carrito actualizado
    displayCartItems(carrito); // Muestra los productos actualizados
   // updateTotals(); // Actualiza los totales
}

// Función para eliminar un producto del carrito
function removeProduct(index) {
    // Obtiene el carrito actual del localStorage
    const carrito = JSON.parse(localStorage.getItem('carrito-'+emailUsuarioLogueado) || '[]');

    // Elimina el producto en el índice especificado
    carrito.splice(index, 1);

    // Actualiza el carrito en localStorage
    localStorage.setItem('carrito-'+emailUsuarioLogueado, JSON.stringify(carrito));

    // Actualiza la cantidad de productos
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

document.getElementById('finalizar').addEventListener('click', function(){
    const departamento = document.getElementById('departamento').value;
    const localidad = document.getElementById('localidad').value;
    const calle = document.getElementById('calle').value;
    const numero = document.getElementById('numero').value;
    const esquina = document.getElementById('esquina').value;
    const cantidadProductos = localStorage.getItem('cantProductos-'+emailUsuarioLogueado);
    const tarjeta = document.getElementById('tarjeta').checked;
    const numeroTarjeta = document.getElementById('numeroTarjeta').value;
    const fechaVencimiento = document.getElementById('fechaVencimiento').value;
    const codigoSeguridad = document.getElementById('codigoSeguridad').value;

    // Validar campos obligatorios
if ((departamento=="" || localidad=="" || calle=="" || numero=="" || esquina=="" || cantidadProductos == 0) ||
(tarjeta && (numeroTarjeta=="" || fechaVencimiento=="" || codigoSeguridad==""))) {
    // SweetAlert para campos obligatorios
    swal.fire({
        icon: 'error',
        title: '¡Oops!',
        text: 'Por favor completa los campos obligatorios.',
        confirmButtonText: 'Aceptar',
        timer: 3000
    });
    return;
}
else {
    swal.fire({
        icon: 'success',
        title: 'Compra exitosa',
        text: 'Gracias por comprar.',
        showConfirmButton: false,
        timer: 3000
    });
}
})
// Seleccionamos los elementos relevantes
const tarjetaOption = document.getElementById("tarjeta");
const transferenciaOption = document.getElementById("transferencia");
const detalleTarjeta = document.getElementById("detalleTarjeta");

// Función para mostrar u ocultar los detalles de la tarjeta de crédito
function actualizarVistaFormaPago() {
  if (tarjetaOption.checked) {
    detalleTarjeta.style.display = "block"; // Mostramos los detalles de la tarjeta
  } else {
    detalleTarjeta.style.display = "none"; // Ocultamos los detalles de la tarjeta
  }
}

// Escuchamos los cambios en las opciones de pago
tarjetaOption.addEventListener("change", actualizarVistaFormaPago);
transferenciaOption.addEventListener("change", actualizarVistaFormaPago);

// Ejecutamos la función al cargar la página para mostrar/ocultar según la opción seleccionada inicialmente
actualizarVistaFormaPago();