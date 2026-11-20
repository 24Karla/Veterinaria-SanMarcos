# Veterinaria San Marcos

## Conectar Contacto con el backend

1. En el repositorio `Veterinaria-SanMarcos-Backend`, prepara la base de MySQL y arranca `mensajeria-service` según su README. Por defecto escucha en `http://127.0.0.1:8082`.
2. En este repositorio, ejecuta `npm ci` si faltan las dependencias. Inicia Vite con `npm run dev -- --port 5173 --strictPort`.
3. Abre `http://localhost:5173/contacto` y envía un mensaje de prueba. La confirmación aparece después de que la API acepta el envío. Puedes comprobar el registro con `GET http://127.0.0.1:8082/api/contactos` en Postman.

El backend permite los orígenes locales del frontend en el puerto 5173. Si solo cambia la URL de mensajería, puedes definir `VITE_CONTACTOS_URL` en `.env.local` con la URL completa del endpoint y reiniciar Vite.

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
