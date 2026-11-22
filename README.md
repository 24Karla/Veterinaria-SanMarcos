# Veterinaria San Marcos

## Conectar el frontend con el backend

1. En el repositorio `Veterinaria-SanMarcos-Backend`, prepara MySQL y arranca Eureka, los microservicios y el API Gateway según su README. React envía las peticiones al gateway en `http://localhost:8080`.
2. En este repositorio, ejecuta `npm ci` si faltan las dependencias. Inicia Vite con `npm run dev -- --port 5173 --strictPort`.
3. Abre `http://localhost:5173/contacto` y envía un mensaje de prueba. Puedes comprobar el registro en Postman con `GET http://localhost:8080/mensajeria/api/contactos`.

El gateway admite las peticiones desde el puerto 5173. Si cambia de dirección, define `VITE_API_GATEWAY_URL` en `.env.local` y reinicia Vite. La variable `VITE_CONTACTOS_URL` permite configurar una URL completa para el formulario de contacto.

Proyecto frontend desarrollado con React y Vite para una veterinaria. Permite revisar productos, agregarlos al carrito, reservar citas e iniciar sesión según el tipo de usuario.

## Tecnologías utilizadas

- React
- TypeScript
- Vite
- React Router DOM
- Bootstrap
- Vitest
- React Testing Library

## Funcionalidades

- Visualización y búsqueda de productos.
- Filtro de productos por categoría.
- Detalle de producto.
- Carrito de compras.
- Página de pago y confirmación de compra.
- Historial de compras del cliente.
- Reserva de citas veterinarias.
- Inicio de sesión por tipo de usuario.
- Perfil de cliente, veterinario y administrador.
- Gestión básica de mascotas.
- Visualización de citas, recetas, ventas e inventario.
- Pruebas unitarias separadas por funcionalidad.
