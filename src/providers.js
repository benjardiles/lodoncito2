// providers.js
document.addEventListener('DOMContentLoaded', async () => {
    const providersTable = document.getElementById('providers-table');
    const tbody = providersTable.querySelector('tbody');

    // Realizar una solicitud para obtener los datos de los proveedores
    const response = await fetch('http://localhost:3000/providers'); // Cambia la URL según la ruta de tu servidor
    const providers = await response.json();

    // Limpiar el contenido anterior de la tabla
    tbody.innerHTML = '';

    // Iterar sobre los datos de los proveedores y agregar filas a la tabla
    providers.forEach(provider => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${provider.id}</td>
            <td>${provider.nombre}</td>
            <td>${provider.telefono}</td>
            <td>${provider.email}</td>
            <td>${provider.direccion}</td>
        `;
        tbody.appendChild(row);
    });
});
