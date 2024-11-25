let cantProductos = 0;
// Obtener el valor del usuario logueado (login.js) desde Local Storage
const emailUsuarioLogueado = localStorage.getItem("usuarioLogueado");

document.addEventListener("DOMContentLoaded", function () {
    // Obtiene el carrito del localStorage y lo convierte en un array
    const carrito = JSON.parse(localStorage.getItem('carrito-' + emailUsuarioLogueado) || '[]');

    // Muestra los productos en la página llamando a la función displayCartItems
    displayCartItems(carrito);
   
     // Agrega un evento para actualizar los totales cuando el tipo de envío cambia
    document.getElementById('tipoEnvio').addEventListener('change', updateTotals);
   
    // Actualiza la cantidad de productos en el carrito al cargar la página
    updateCantProductos();
}); 

// Función para actualizar la cantidad total de productos en el carrito
function updateCantProductos() {

     // Obtiene el carrito del localStorage
    const carrito = JSON.parse(localStorage.getItem('carrito-' + emailUsuarioLogueado) || '[]');
    
     // Calcula el total de productos sumando las cantidades de cada uno
    const totalCant = carrito.reduce((acc, producto) => acc + producto.quantity, 0);
   
    // Guarda el total de productos en localStorage
    localStorage.setItem('cantProductos-' + emailUsuarioLogueado, totalCant);
   
    // Muestra la cantidad total en el elemento correspondiente de la página
    document.getElementById('cantCarrito').innerText = totalCant;
}


// Función para mostrar los productos del carrito en la página
function displayCartItems(carrito) {
    const cartTableBody = document.getElementById("cart-table-body");
    cartTableBody.innerHTML = "";  // Limpia la tabla de productos

    // Si el carrito está vacío
    if (carrito.length === 0) {
        swal.fire({
            icon: 'warning',
            title: '¡Carrito vacío!',
            text: 'No hay productos en el carrito.',
            confirmButtonText: 'Aceptar',
            timer: 3000
        });

        // Establecemos todos los totales a 0 cuando no hay productos
        document.getElementById('subtotal').textContent = "USD 0.00";
        document.getElementById('costoEnvio').textContent = "USD 0.00";
        document.getElementById('total').textContent = "USD 0.00";
        return;
    }

      // Muestra cada producto del carrito
    carrito.forEach((producto, index) => {
        const row = document.createElement("tr");
        let productSubtotalInUSD = producto.subtotal;


 // Si la moneda es "UYU", convierte el subtotal a USD
        if (producto.currency === "UYU") {
            const exchangeRate = 40; // Tasa de cambio a USD
            productSubtotalInUSD = (producto.subtotal / exchangeRate).toFixed(2);
        }

          // Construye una fila para cada producto
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

         // Agrega la fila a la tabla del carrito
        cartTableBody.appendChild(row);
    });

      // Actualiza la cantidad de productos y asigna eventos de eliminación y cambio de cantidad
    updateCantProductos();
    attachDeleteButtons();
    attachQuantityChangeEvents();
    updateTotals(); // Actualiza los totales después de mostrar los productos
}

// Asigna eventos a los botones de eliminación para cada producto
function attachDeleteButtons() {
    const deleteButtons = document.querySelectorAll(".btn-danger");
    deleteButtons.forEach(button => {
        button.addEventListener("click", function () {
            const index = this.getAttribute("data-index"); // Obtiene el índice del producto a eliminar
            removeProduct(index); // Llama a la función para eliminar el producto
        });
    });
}

// Asigna eventos a los campos de cantidad para actualizar la cantidad del producto
function attachQuantityChangeEvents() {
    const quantityInputs = document.querySelectorAll('.quantity-input');
    quantityInputs.forEach(input => {
        input.addEventListener('change', () => {
            const index = input.getAttribute('data-index'); // Obtiene el índice del producto
            updateProductQuantity(index, input.value); // Llama a la función para actualizar la cantidad
        });
    });
}

// Función para actualizar la cantidad de un producto en el carrito
function updateProductQuantity(index, quantity) {
    const carrito = JSON.parse(localStorage.getItem('carrito-' + emailUsuarioLogueado) || '[]');
    const producto = carrito[index]; // Obtiene el producto a actualizar
    producto.quantity = Math.max(1, parseInt(quantity)); // Asegura que la cantidad no sea menos de 1
    producto.subtotal = producto.quantity * producto.cost; // Actualiza el subtotal


     // Guarda el carrito actualizado en localStorage
    localStorage.setItem('carrito-' + emailUsuarioLogueado, JSON.stringify(carrito)); // Guarda el carrito actualizado
    displayCartItems(carrito); // Muestra los productos actualizados
    // updateTotals(); // Actualiza los totales
}

// Función para eliminar un producto del carrito
function removeProduct(index) {
    // Obtiene el carrito actual del localStorage
    const carrito = JSON.parse(localStorage.getItem('carrito-' + emailUsuarioLogueado) || '[]');

    // Elimina el producto del carrito en la posición indicada
    carrito.splice(index, 1);

   // Guarda el carrito actualizado
    localStorage.setItem('carrito-' + emailUsuarioLogueado, JSON.stringify(carrito));

    // Actualiza la cantidad de productos en el carrito
    updateCantProductos();
    // Muestra los productos restantes
    displayCartItems(carrito);
}

// Función para actualizar el total de una fila cuando cambia la cantidad de un producto
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

     // Calcula el subtotal sumando los totales de cada fila
    const rows = document.querySelectorAll('tbody tr');
    let subtotal = 0;

    rows.forEach(row => {
        const total = parseFloat(row.querySelector('td:nth-child(5)').textContent.replace('USD ', '')) || 0;
        subtotal += total;
    });

    // Actualiza el subtotal en la sección de costos finales
    document.getElementById('subtotal').textContent = `USD ${subtotal.toFixed(2)}`;

    // Calcula el costo de envío según el tipo de envío seleccionado
    const tipoEnvio = document.getElementById('tipoEnvio').value;
    let shippingCost = 0;

    if (tipoEnvio === "premium") {
        shippingCost = subtotal * 0.15;
    } else if (tipoEnvio === "express") {
        shippingCost = subtotal * 0.07;
    } else if (tipoEnvio === "standard") {
        shippingCost = subtotal * 0.05;
    }

      // Actualiza el costo de envío
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
document.addEventListener('DOMContentLoaded', function () {
    updateCantProductos();
});

// Función para validar la compra al hacer clic en "finalizar"
document.getElementById('finalizar').addEventListener('click', (event) => {
    event.preventDefault();
    const formularioDeCompra = document.getElementById('formularioDeCompra');
    const cantidadProductos = localStorage.getItem('cantProductos-' + emailUsuarioLogueado);
    if ( cantidadProductos == 0) {

// Muestra un mensaje de advertencia si el carrito está vacío
swal.fire({
    icon: 'error',
    title: '¡No es posible comprar!',
    text: 'Carrito vacío.',
    showConfirmButton: false,
    timer: 3000
});
    }
   
    else if (formularioDeCompra.checkValidity() ) {

       // Muestra un mensaje de éxito si la compra es válida
        swal.fire({
            icon: 'success',
            title: 'Compra exitosa',
            text: 'Gracias por comprar.',
            showConfirmButton: false,
            timer: 3000
        });
        //}
    }
    else {
        formularioDeCompra.reportValidity();  // Muestra los mensajes de error del formulario
        // Hacer visibles los spans de error asociados
        const invalidInputs = formularioDeCompra.querySelectorAll(':invalid');
        invalidInputs.forEach(input => {
            const errorSpan = document.getElementById(input.getAttribute('aria-describedby'));
            if (errorSpan) {
                errorSpan.style.display = 'block';
            }
        });
         // Muestra un mensaje de error si el formulario tiene campos obligatorios sin llenar
        swal.fire({
            icon: 'error',
            title: '¡Oops!',
            text: 'Por favor completa los campos obligatorios.',
            showConfirmButton: false,
            timer: 3000
        });
    }
})

// Seleccionamos los elementos relevantes
const tarjetaOption = document.getElementById("tarjeta");
const transferenciaOption = document.getElementById("transferencia");
const detalleTarjeta = document.getElementById("detalleTarjeta");

// Función para mostrar u ocultar los detalles de la tarjeta de crédito según la opción seleccionada
function actualizarVistaFormaPago() {
    if (tarjetaOption.checked) {
        detalleTarjeta.style.display = "block"; // Mostramos los detalles de la tarjeta
        document.getElementById('numeroTarjeta').disabled = false;
        document.getElementById('fechaVencimiento').disabled = false;
        document.getElementById('codigoSeguridad').disabled = false;

    } else {
        detalleTarjeta.style.display = "none"; // Ocultamos los detalles de la tarjeta
        document.getElementById('numeroTarjeta').disabled = true;
        document.getElementById('fechaVencimiento').disabled = true;
        document.getElementById('codigoSeguridad').disabled = true;
    }
}

// Escucha los cambios en las opciones de pago para mostrar u ocultar los campos correspondientes
tarjetaOption.addEventListener("change", actualizarVistaFormaPago);
transferenciaOption.addEventListener("change", actualizarVistaFormaPago);

// Ejecuta la función para establecer la vista correcta de los métodos de pago
actualizarVistaFormaPago();


// Ocultar errores cuando los campos sean corregidos
document.getElementById('formularioDeCompra').addEventListener('input', (event) => {
    const input = event.target;
    if (input.validity.valid) {
        const errorSpan = document.getElementById(input.getAttribute('aria-describedby'));
        if (errorSpan) {
            errorSpan.style.display = 'none';
        }
    }
});

// Formato del número de la tarjeta de crédito (con espacio y guiones)
document.getElementById('numeroTarjeta').addEventListener('input', function () {
    let value = this.value.replace(/\D/g, ''); // Eliminar cualquier carácter que no sea un número
    if (value.length > 16) {
        value = value.slice(0, 16); // Limitar a 16 dígitos
    }
    // Formatear el número en el formato 1234-1234-1234-1234
    this.value = value.replace(/(\d{4})(?=\d)/g, '$1-');
});