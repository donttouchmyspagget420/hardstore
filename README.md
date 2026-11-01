# HardStore · Gestor de Productos

Trabajo Práctico Final de **Aplicaciones Móviles** (Plataformas de Desarrollo).

Aplicación web construida con **React + Vite**, estilizada con **Bootstrap 5** y conectada a un
backend provisional con **JSON Server**. Incluye catálogo público, detalle de producto, panel de
administración con CRUD completo, autenticación simulada, roles, rutas protegidas y persistencia de
sesión.

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
| Administrador | `admin@hardstore.com` | `admin123` | Consultar, crear, editar y eliminar productos |
| Usuario | `user@hardstore.com` | `user123` | Solo consultar el catálogo |
| Visitante | — | — | Solo consultar el catálogo |

La autenticación es **simulada** con fines académicos. En LocalStorage solo se guardan `id`, `name`,
`email` y `role` del usuario; **nunca la contraseña**.

---

## Funcionalidades

### Consignas obligatorias

- Proyecto React + Vite con carpetas organizadas (`components`, `pages`, `context`, `hooks`,
  `services`, `data`, `utils`).
- Componentes reutilizables con props: `Navbar`, `ProductCard`, `ProductForm`, `Footer`, más
  `SearchBar`, `ConfirmModal`, `Loader`, `ErrorMessage`, `EmptyState`, `ProtectedRoute`, `Layout`.
- Catálogo con 14 productos cargados desde JSON Server y renderizados dinámicamente con `map()` y
  `key`. Cada producto tiene nombre, descripción, precio, categoría, stock e imagen.
- `useState` + `useEffect` para consultar la API, con estados de carga, error y reintento.
- React Router DOM con navegación sin recarga:
  - `/` → Inicio
  - `/productos` → Catálogo
  - `/productos/:id` → Detalle con parámetro dinámico
  - `/admin` → Administración (protegida)
- CRUD completo contra JSON Server:
  - **GET** `/products` y `/products/:id`
  - **POST** `/products`
  - **PATCH** `/products/:id`
  - **DELETE** `/products/:id`
- Formulario reutilizable para crear y editar, con validaciones y vista previa de imagen.

### Nivel intermedio

- Buscador dinámico por nombre en tiempo real.
- Filtro por categoría, ordenamiento por precio/nombre y limpieza de filtros.
- Hook personalizado `useProducts` (datos, carga, error y `refetch`) y `useProduct` para el detalle.
- Modal de confirmación antes de eliminar.
- Notificaciones Toast para altas, modificaciones, bajas y errores.

### Nivel avanzado

- Autenticación con React Context (`AuthProvider` / `useAuth`).
- Roles `admin` y `user` con funcionalidades diferenciadas.
- Rutas protegidas: un usuario común que intenta entrar a `/admin` por URL es redirigido a una
  página 403.
- Persistencia de sesión en LocalStorage y limpieza al cerrar sesión.

---

## Tecnologías

| Paquete | Uso |
| --- | --- |
| React 19 | Interfaz y componentes |
| Vite 8 | Bundler y servidor de desarrollo |
| Bootstrap 5.3 | Estilos y grilla responsive |
| Bootstrap Icons | Iconografía |
| React Router DOM 7 | Navegación SPA |
| JSON Server 0.17 | Backend provisional y persistencia en `db.json` |
| ESLint 10 | Calidad de código |

> Requiere Node.js 20+ (recomendado Node 22).

## Estructura del proyecto

```text
hardstore/
├── db.json                     # Base de datos de JSON Server (14 productos)
├── docs/                       # Consigna del trabajo
├── public/
│   ├── images/                 # Imágenes SVG locales de los productos
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
│   │   ├── ProductCard.jsx
│   │   ├── ProductForm.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── SearchBar.jsx
│   │   └── ToastItem.jsx
│   ├── context/
│   │   ├── AuthContext.jsx     # Provider de autenticación
│   │   ├── auth-context.js     # Contexto + useAuth
│   │   ├── ToastContext.jsx    # Provider de notificaciones
│   │   └── toast-context.js    # Contexto + useToast
│   ├── data/
│   │   ├── categories.js
│   │   └── users.js            # Usuarios simulados
│   ├── hooks/
│   │   └── useProducts.js      # useProducts + useProduct
│   ├── pages/
│   │   ├── AccessDenied.jsx    # 403
│   │   ├── Admin.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── NotFound.jsx        # 404
│   │   ├── ProductDetail.jsx
│   │   └── Products.jsx
│   ├── services/
│   │   └── api.js              # Cliente fetch de JSON Server
│   ├── utils/
│   │   └── format.js           # Moneda, números y estado de stock
│   ├── App.jsx                 # Rutas
│   ├── index.css               # Tema Bootstrap personalizado
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
- Respuestas 404 (producto inexistente).
- Otros errores HTTP.

## Rutas

| Ruta | Acceso | Descripción |
| --- | --- | --- |
| `/` | Público | Landing con destacados y categorías |
| `/productos` | Público | Catálogo con búsqueda, filtro y orden |
| `/productos/:id` | Público | Detalle dinámico del producto |
| `/login` | Público | Inicio de sesión simulado |
| `/admin` | Solo `admin` | Panel CRUD, estadísticas e inventario |
| `/acceso-denegado` | Público | Página 403 para roles sin permiso |
| `*` | Público | Página 404 |

## Prueba sugerida del CRUD

1. Iniciar sesión con `admin@hardstore.com` / `admin123`.
2. En `/admin`, crear un producto con el formulario (nombre, descripción, precio, stock, categoría e
   imagen). Verificar el Toast de confirmación.
3. Editar un producto desde el panel o desde su detalle (`Editar`).
4. Eliminar un producto: se abre el modal de confirmación antes de enviar el `DELETE`.
5. Recargar la página: los cambios siguen en `db.json`; la sesión sigue activa (LocalStorage).
6. Cerrar sesión e ingresar con `user@hardstore.com` / `user123`. Intentar abrir `/admin`
   manualmente: la app muestra la página de acceso denegado.

## Imágenes

Las imágenes de los 14 productos son SVG locales en `public/images`, por lo que no dependen de
servicios externos. El formulario permite indicar otra ruta local (`/images/...`) o una URL externa.

## Notas académicas

- Las restricciones de rol son **demostrativas del lado del cliente**; no representan seguridad real
  de backend, tal como indica la consigna.
- JSON Server persiste los datos en `db.json`. No se requiere base de datos real.
- Para entregar, comprimir el proyecto como `ACT4AV-APELLIDO-FINAL.zip` (sin `node_modules`).
