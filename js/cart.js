
document.addEventListener("DOMContentLoaded", function() {
    // Inicializa los eventos de botones y entradas
    initEventListeners();

    // Actualiza totales iniciales al cargar
    updateTotals();
});

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

    const shippingCost = 6.94; // Opcional un Costo de envío fijo
    const total = subtotal + shippingCost;

    // Actualiza el total
    const totalElement = document.getElementById('total');
    if (totalElement) {
        totalElement.textContent = `$${total.toFixed(2)}`;
    }
}
