# HardStore · Gestor de Productos

Trabajo Práctico Final de **Aplicaciones Móviles** (Plataformas de Desarrollo).

Aplicación web construida con **React + Vite**, estilizada con **Bootstrap 5** y conectada a un
backend provisional con **JSON Server**. Además del catálogo público y el CRUD administrativo
pedidos por la consigna, el proyecto incluye carrito, checkout con pagos simulados, reseñas con
likes/dislikes, perfil con historial y dashboard, y modo claro/oscuro.

---

## Demo rápida

```bash
npm install
npm run dev:full
```

- Aplicación: <http://localhost:5173>
- API JSON Server: <http://localhost:3001/products>

`npm run dev:full` levanta la API y Vite al mismo tiempo con `concurrently`.

También se pueden ejecutar en dos terminales:

```bash
npm run server   # JSON Server en http://localhost:3001
npm run dev      # Vite en http://localhost:5173
```

## Cuentas de prueba

| Rol | Correo | Contraseña | Permisos |
| --- | --- | --- | --- |
| Administrador | `admin@hardstore.com` | `admin123` | Comprar, opinar, ver su perfil y gestionar el catálogo |
| Usuario | `user@hardstore.com` | `user123` | Comprar, opinar y consultar su historial |
| Visitante | — | — | Catálogo, detalle, carrito y acceso al login |

La autenticación es **simulada** con fines académicos. En LocalStorage solo se guardan `id`,
`name`, `email` y `role` del usuario; **nunca la contraseña**. El carrito y la preferencia de tema
también se persisten en LocalStorage.

---

## Funcionalidades

### Consignas obligatorias

- Proyecto React + Vite con carpetas organizadas (`components`, `pages`, `context`, `hooks`,
  `services`, `data`, `utils`).
- Componentes reutilizables con props: `Navbar`, `ProductCard`, `ProductForm`, `Footer`, más
  `SearchBar`, `ConfirmModal`, `Loader`, `ErrorMessage`, `EmptyState`, `ProtectedRoute`, `Layout`,
  `QuantityControl`, `StarRating`, `ReviewsSection`, `OrderStatusBadge` y `ThemeToggle`.
- Catálogo con **18 productos** cargados desde JSON Server y renderizados dinámicamente con
  `map()` y `key`. Cada producto tiene nombre, descripción, precio, categoría, stock, imagen y datos
  ampliados (marca, SKU, descripción larga, destacados, especificaciones y garantía).
- `useState` + `useEffect` para consultar la API, con estados de carga, error y reintento.
- React Router DOM con navegación sin recarga:
  - `/` → Inicio
  - `/productos` → Catálogo
  - `/productos/:id` → Detalle con parámetro dinámico
  - `/admin` → Administración (protegida por rol)
- CRUD completo contra JSON Server sobre `products`:
  - **GET** `/products` y `/products/:id`
  - **POST** `/products`
  - **PATCH** `/products/:id`
  - **DELETE** `/products/:id`
- Formulario reutilizable para crear y editar, con validaciones y vista previa de imagen. También
  permite editar los campos ampliados del producto.
- Persistencia real en `db.json` y actualización automática de la interfaz.

### Nivel intermedio

- Buscador dinámico por nombre en tiempo real.
- Filtro por categoría, ordenamiento por precio/nombre y limpieza de filtros.
- Hook personalizado `useProducts` (datos, carga, error y `refetch`) y `useProduct` para el detalle.
- Modal de confirmación antes de eliminar.
- Notificaciones Toast para altas, modificaciones, bajas y errores. También se usan en carrito,
  reseñas y checkout.

### Nivel avanzado

- Autenticación con React Context (`AuthProvider` / `useAuth`).
- Roles `admin` y `user` con funcionalidades diferenciadas.
- Rutas protegidas: un usuario común que intenta entrar a `/admin` por URL es redirigido a una
  página 403.
- Persistencia de sesión en LocalStorage y limpieza al cerrar sesión.

### Ampliaciones solicitadas en `todo`

- **Comentarios, likes y dislikes**: cada producto tiene reseñas con calificación de 1 a 5,
  promedio, distribución de estrellas, comentario, votos positivos/negativos y borrado para el autor
  o un administrador.
- **Carrito con métodos de pago**: carrito persistente en LocalStorage, control de cantidades,
  envío gratis desde `$300`, checkout protegido y pago simulado con tarjeta de crédito, débito,
  transferencia o efectivo. Solo se guardan la marca y los últimos 4 dígitos de la tarjeta.
- **Fotos reales**: los 18 productos usan fotografías remotas de Unsplash. Si una imagen no carga,
  se muestra `/images/placeholder.svg` como respaldo.
- **Base de datos ampliada**: `db.json` incluye `products` (18), `reviews` (13) y `orders` (4), con
  campos ampliados en cada producto.
- **Perfil con historial y dashboard**: pedidos con estado, detalle de cada compra, total invertido,
  ticket promedio, productos comprados, categoría favorita, consumo por categoría y reseñas propias.
- **Modo claro/oscuro**: contexto de tema, persistencia en LocalStorage, detección de preferencia del
  sistema y botón en la barra de navegación.
- **Descripciones ampliadas**: descripción larga, puntos destacados y ficha técnica visible en el
  detalle de cada producto.

> El mapeo completo contra la consigna está en [`docs/CHECKLIST.md`](docs/CHECKLIST.md).

---

## Rutas

| Ruta | Acceso | Descripción |
| --- | --- | --- |
| `/` | Público | Landing con destacados y categorías |
| `/productos` | Público | Catálogo con búsqueda, filtro y orden |
| `/productos/:id` | Público | Detalle, ficha técnica y reseñas |
| `/carrito` | Público | Carrito persistente con resumen de compra |
| `/login` | Público | Inicio de sesión simulado |
| `/checkout` | Autenticado | Datos de envío, pago simulado y confirmación |
| `/perfil` | Autenticado | Historial, dashboard, reseñas y datos de cuenta |
| `/perfil/pedidos/:id` | Autenticado | Detalle de un pedido propio (o cualquiera si es admin) |
| `/admin` | Solo `admin` | Panel CRUD, estadísticas e inventario |
| `/acceso-denegado` | Público | Página 403 para roles sin permiso |
| `*` | Público | Página 404 |

## Prueba sugerida del flujo completo

1. Iniciar sesión con `admin@hardstore.com` / `admin123`.
2. En `/admin`, crear un producto con el formulario (datos básicos y ampliados). Verificar el Toast.
3. Editar un producto desde el panel o desde su detalle (`Editar`).
4. Eliminar un producto: se abre el modal de confirmación antes del `DELETE`.
5. Recargar la página: los cambios siguen en `db.json`; la sesión sigue activa.
6. Agregar productos al carrito desde el catálogo o el detalle y ajustar cantidades en `/carrito`.
7. Ir a `/checkout`, completar dirección y elegir un método de pago. Confirmar y ver el pedido en
   `/perfil/pedidos/:id`.
8. En `/perfil`, revisar el historial, el dashboard y las reseñas. El stock de los productos se
   descuenta al confirmar la compra.
9. Desde el detalle de un producto, publicar una reseña, dar like/dislike a otras opiniones y
   eliminar una reseña propia.
10. Probar el botón de tema claro/oscuro en la navbar y recargar: la preferencia se conserva.
11. Cerrar sesión e ingresar con `user@hardstore.com` / `user123`. Intentar abrir `/admin`
    manualmente: la app muestra la página de acceso denegado.

## Prueba sugerida del CRUD con la API

```bash
curl http://localhost:3001/products
curl -X POST http://localhost:3001/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Producto de prueba","description":"Descripción de prueba","price":10,"category":"Accesorios","stock":2,"image":"/images/placeholder.svg"}'
curl -X PATCH http://localhost:3001/products/19 \
  -H "Content-Type: application/json" \
  -d '{"stock":5}'
curl -X DELETE http://localhost:3001/products/19
```

Los endpoints de reseñas y pedidos también están disponibles en `/reviews` y `/orders`.

---

## Tecnologías

| Paquete | Uso |
| --- | --- |
| React 19 | Interfaz, contexto y componentes |
| Vite 8 | Bundler y servidor de desarrollo |
| Bootstrap 5.3 | Estilos, grilla responsive y modo oscuro |
| Bootstrap Icons | Iconografía |
| React Router DOM 7 | Navegación SPA |
| JSON Server 0.17 | Backend provisional y persistencia en `db.json` |
| ESLint 10 | Calidad de código |

> Requiere Node.js 20+ (recomendado Node 22).

## Estructura del proyecto

```text
hardstore/
├── db.json                     # Productos, reseñas y pedidos
├── docs/
│   ├── ACT4AV - TP2.pdf        # Consigna del trabajo
│   └── CHECKLIST.md            # Mapeo requisito → implementación
├── public/
│   ├── images/                 # Imágenes SVG de respaldo
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── ConfirmModal.jsx
│   │   ├── EmptyState.jsx
│   │   ├── ErrorMessage.jsx
│   │   ├── Footer.jsx
│   │   ├── Layout.jsx
│   │   ├── Loader.jsx
│   │   ├── Navbar.jsx
│   │   ├── OrderStatusBadge.jsx
│   │   ├── ProductCard.jsx
│   │   ├── ProductForm.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── QuantityControl.jsx
│   │   ├── ReviewsSection.jsx
│   │   ├── SearchBar.jsx
│   │   ├── StarRating.jsx
│   │   ├── ThemeToggle.jsx
│   │   └── ToastItem.jsx
│   ├── context/
│   │   ├── AuthContext.jsx     # Provider de autenticación
│   │   ├── auth-context.js     # Contexto + useAuth
│   │   ├── CartContext.jsx     # Carrito persistente
│   │   ├── cart-context.js     # Contexto + useCart
│   │   ├── ThemeContext.jsx    # Tema claro/oscuro
│   │   ├── theme-context.js    # Contexto + useTheme
│   │   ├── ToastContext.jsx    # Provider de notificaciones
│   │   └── toast-context.js    # Contexto + useToast
│   ├── data/
│   │   ├── categories.js
│   │   ├── shop.js             # Envío, pagos, estados y provincias
│   │   └── users.js            # Usuarios simulados
│   ├── hooks/
│   │   ├── useOrders.js        # useOrders + useOrder
│   │   ├── useProducts.js      # useProducts + useProduct
│   │   └── useReviews.js       # Reseñas y votos
│   ├── pages/
│   │   ├── AccessDenied.jsx    # 403
│   │   ├── Admin.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── NotFound.jsx        # 404
│   │   ├── OrderDetail.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Products.jsx
│   │   └── Profile.jsx
│   ├── services/
│   │   └── api.js              # Cliente fetch de JSON Server
│   ├── utils/
│   │   ├── cart.js             # Subtotal, envío y totales
│   │   └── format.js           # Moneda, fechas, iniciales y stock
│   ├── App.jsx                 # Providers y rutas
│   ├── index.css               # Tema Bootstrap claro/oscuro
│   └── main.jsx
├── .env.example
├── index.html
├── package.json
└── vite.config.js
```

## Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia Vite en el puerto 5173 |
| `npm run server` | Inicia JSON Server en el puerto 3001 |
| `npm run dev:full` | Inicia API y frontend juntos |
| `npm run build` | Genera la build de producción en `dist/` |
| `npm run preview` | Previsualiza la build |
| `npm run lint` | Ejecuta ESLint |

## Configuración de la API

Por defecto la app consume `http://localhost:3001`. Para cambiarlo, copiá `.env.example` a `.env`:

```bash
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:3001
```

El cliente HTTP está en `src/services/api.js` y contempla:

- Error de conexión con un mensaje que recuerda ejecutar `npm run server`.
- Respuestas 404 (recurso inexistente).
- Otros errores HTTP.
- Endpoints para `products`, `reviews` y `orders`.

## Datos y pagos simulados

- `products`: 18 productos con datos comerciales y técnicos.
- `reviews`: 13 reseñas iniciales con calificación, comentario y votos.
- `orders`: 4 pedidos iniciales con distintos estados y medios de pago.
- El checkout simula la pasarela de pago y **no procesa dinero real**.
- Nunca se persiste el número completo de tarjeta ni el CVV; solo se guarda una etiqueta como
  `Visa •••• 4242 · 3 cuotas`.
- El stock se descuenta al confirmar una compra.

## Imágenes

Las fotografías de los productos son URLs remotas de Unsplash, verificadas al momento de la
entrega. La app necesita conexión a internet para mostrarlas; ante un error se usa
`/images/placeholder.svg`, por lo que el catálogo sigue siendo funcional sin conexión. El formulario
de administración permite indicar otra ruta local (`/images/...`) o una URL externa.

## Notas académicas

- Las restricciones de rol son **demostrativas del lado del cliente**; no representan seguridad real
  de backend, tal como indica la consigna.
- JSON Server persiste los datos en `db.json`. No se requiere base de datos real.
- La autenticación y el pago son simulados con fines académicos.
- Para entregar, comprimir el proyecto como `ACT4AV-APELLIDO-FINAL.zip` (sin `node_modules` ni
  `dist`).
