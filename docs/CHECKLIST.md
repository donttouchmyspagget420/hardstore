# Checklist de alineación con la consigna

Este documento verifica el cumplimiento de `docs/ACT4AV - TP2.pdf` y de las ampliaciones pedidas
en el archivo `todo`.

## Consignas mínimas obligatorias (7 pts)

### 1. Estructura del proyecto y componentes

- [x] Proyecto creado con **React + Vite** (`package.json`, `vite.config.js`, `src/main.jsx`).
- [x] Organización por carpetas: `components`, `pages`, `context`, `hooks`, `services`, `data`,
      `utils`.
- [x] Componentes reutilizables mínimos:
  - `src/components/Navbar.jsx`
  - `src/components/ProductCard.jsx`
  - `src/components/ProductForm.jsx`
  - `src/components/Footer.jsx`
- [x] Uso de **props** para transmitir información:
  - `ProductCard` recibe `product`, `showAdminActions`, `onEdit`, `onDelete`.
  - `ProductForm` recibe `initialValues`, `submitting`, `onSubmit`, `onCancel`.
  - `ReviewsSection` recibe `productId` y `productName`.
  - `QuantityControl`, `StarRating`, `OrderStatusBadge`, `Loader`, `ErrorMessage`, `EmptyState`,
    `SearchBar`, `ConfirmModal`, `ProtectedRoute` y `Layout` también reciben props.

### 2. Catálogo de productos

- [x] Listado con **18 productos** (mínimo exigido: 10) en `db.json`.
- [x] Cada producto incluye nombre, descripción, precio, categoría, stock e imagen.
- [x] Renderización dinámica con `map()` y `key`:
  - `src/pages/Products.jsx`
  - `src/pages/Home.jsx`
  - `src/pages/Admin.jsx`
  - `src/pages/Cart.jsx`
  - `src/pages/Checkout.jsx`
  - `src/pages/Profile.jsx`
  - `src/pages/OrderDetail.jsx`
  - `src/components/ReviewsSection.jsx`
- [x] Presentación mediante tarjetas reutilizables (`ProductCard`).

### 3. Estados, efectos y consultas

- [x] `useState` y `useEffect` para obtener productos desde JSON Server.
- [x] Consumo HTTP con `fetch` en `src/services/api.js`.
- [x] Estado de carga (`Loader`) y estado de error con reintento (`ErrorMessage`).
- [x] Actualización de la interfaz después de cada operación.
- [x] Hook `useProducts` con datos, carga, error y `refetch`; `useProduct` para el detalle.
- [x] Hooks adicionales `useReviews`, `useOrders` y `useOrder`.

### 4. Navegación con React Router DOM

- [x] `/` → Inicio (`src/pages/Home.jsx`).
- [x] `/productos` → Catálogo (`src/pages/Products.jsx`).
- [x] `/productos/:id` → Detalle dinámico (`src/pages/ProductDetail.jsx`).
- [x] `/admin` → Administración (`src/pages/Admin.jsx`).
- [x] Navegación sin recarga completa mediante `BrowserRouter`, `Routes`, `Route`, `Link` y
      `NavLink`.
- [x] Uso de parámetros dinámicos con `useParams` en el detalle de producto y de pedido.
- [x] Rutas adicionales: `/carrito`, `/checkout`, `/perfil`, `/perfil/pedidos/:id`,
      `/acceso-denegado` y `*` (404).

### 5. Operaciones CRUD con JSON Server

- [x] Backend provisional configurado con JSON Server (`npm run server`, puerto 3001).
- [x] Base de datos en `db.json`.
- [x] **GET** `/products` y `/products/:id` (`productApi.getAll`, `productApi.getById`).
- [x] **POST** `/products` (`productApi.create`).
- [x] **PATCH** `/products/:id` (`productApi.update`).
- [x] **DELETE** `/products/:id` (`productApi.remove`).
- [x] Formulario para crear y modificar productos (`ProductForm`).
- [x] Persistencia y recarga automática después de cada operación.
- [x] CRUD verificado contra JSON Server 0.17:
  - `GET /products` → 200
  - `POST /products` → 201
  - `PATCH /products/:id` → 200
  - `DELETE /products/:id` → 200

## Nivel intermedio (1 pt adicional)

- [x] **Buscador dinámico** por nombre en tiempo real (`useDeferredValue` en `Products.jsx`).
- [x] Filtro por categoría, orden por nombre/precio y limpieza de filtros.
- [x] **Custom Hook** `useProducts` con datos, carga, errores y `refetch`.
- [x] **Modal de confirmación** antes de eliminar un producto (`ConfirmModal`), reutilizado en
      reseñas.
- [x] **Notificaciones Toast** para altas, modificaciones, bajas y errores (`ToastProvider`,
      `ToastItem`), reutilizadas en carrito, checkout y reseñas.

## Nivel avanzado (2 pts adicionales)

- [x] **React Context** para autenticación (`AuthProvider`, `useAuth`).
- [x] Inicio y cierre de sesión simulados con `login()` y `logout()`.
- [x] **Roles** `admin` y `user` con permisos diferenciados.
- [x] **Rutas protegidas**:
  - `ProtectedRoute` sin rol exige sesión (`/checkout`, `/perfil`, detalle de pedido).
  - `ProtectedRoute role="admin"` exige administrador (`/admin`).
  - Acceso manual por URL a `/admin` con rol `user` redirige a `/acceso-denegado`.
- [x] **LocalStorage**:
  - Sesión en `hardstore_session` (solo `id`, `name`, `email`, `role`).
  - Carrito en `hardstore_cart`.
  - Tema en `hardstore_theme`.
  - Al cerrar sesión se elimina `hardstore_session` y nunca se guardan contraseñas.
- [x] Restricciones de rol documentadas como demostrativas del lado del cliente.

## Ampliaciones del archivo `todo`

- [x] **Comentarios, likes y dislikes**
  - Colección `reviews` en `db.json` (13 reseñas iniciales).
  - Calificación de 1 a 5 estrellas, comentario, promedio y distribución.
  - Votos positivos/negativos con persistencia en JSON Server.
  - Alta y baja de reseñas para usuarios autenticados; moderación para administradores.
- [x] **Carrito con métodos de pago**
  - Carrito persistente en LocalStorage.
  - Control de cantidades y stock máximo.
  - Envío gratis desde `$300`; costo de `$19.99` por debajo.
  - Checkout con tarjeta de crédito, débito, transferencia y efectivo.
  - Validación de dirección, tarjeta, vencimiento y CVV.
  - Pago simulado; solo se guardan marca y últimos 4 dígitos.
  - Descuento de stock al confirmar el pedido.
  - Pedidos persistidos en `orders`.
- [x] **Fotos de productos reales**
  - 18 URLs remotas de Unsplash en `db.json`.
  - Respaldo local `/images/placeholder.svg` ante errores de carga.
- [x] **Base de datos ampliada**
  - `products`: 18 registros con `brand`, `sku`, `longDescription`, `highlights`, `specs`,
    `warranty`, `featured` e `image`.
  - `reviews`: 13 registros.
  - `orders`: 4 registros con items, totales, pago, estado y dirección.
- [x] **Perfil con historial y dashboard**
  - `/perfil` con datos de cuenta, historial de pedidos y accesos rápidos.
  - Métricas: pedidos, total invertido, productos comprados, ticket promedio, categoría favorita.
  - Consumo por categoría con barras de progreso.
  - Reseñas propias y votos recibidos.
  - `/perfil/pedidos/:id` con estado, línea de tiempo, productos, pago y envío.
- [x] **Modo claro y oscuro**
  - `ThemeProvider` con `data-bs-theme`.
  - Persistencia en LocalStorage.
  - Detección inicial de la preferencia del sistema.
  - Botón de alternancia en la navbar y variables CSS para todos los componentes.
- [x] **Descripciones más extensas**
  - `longDescription` con párrafos.
  - Lista de `highlights`.
  - Ficha técnica `specs` en formato clave/valor.
  - Garantía y marca visibles en el detalle.
  - Formulario administrativo ampliado para editar todos esos campos.

## Verificación técnica realizada

- [x] `npm run lint` sin errores.
- [x] `npm run build` exitoso con Vite 8.
- [x] `db.json` válido: 18 productos, 13 reseñas y 4 pedidos; sin referencias huérfanas.
- [x] Totales de pedidos coherentes con la regla de envío (`$300`).
- [x] CRUD de productos, reseñas y pedidos probado contra JSON Server 0.17 en una copia temporal de
      la base.
- [x] Smoke test DOM automatizado (jsdom + React DOM) sobre una copia temporal de `db.json`:
      catálogo de 18 productos, buscador, tema claro/oscuro, redirección de rutas protegidas,
      login usuario/admin, autorización por rol, carrito, checkout con efectivo, detalle e historial
      de pedido, alta/like/baja de reseñas y CRUD completo desde el panel de administración.
      **17 verificaciones aprobadas.**
- [x] Las 18 URLs de imágenes respondieron HTTP 200 al momento de la verificación.

## Observaciones de entrega

- El proyecto no debe incluir `node_modules` ni `dist` en el comprimido.
- Nombre sugerido del archivo: `ACT4AV-APELLIDO-FINAL.zip`.
- La app requiere ejecutar `npm run dev:full` (o `npm run server` + `npm run dev`) para consumir la
  API.
- Las fotografías son remotas; se necesita conexión a internet para verlas, con fallback local.
