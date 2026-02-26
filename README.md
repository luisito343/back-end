# Back-end - Administrador de Productos

API REST para gestionar productos (crear, listar, consultar, actualizar y eliminar) usando **Node.js**, **TypeScript**, **Express** y **Sequelize**.

## Estado del proyecto

Proyecto en desarrollo activo. Este README se irá actualizando conforme evolucione la API.

> Próximamente se incorporará documentación formal de la API con **Swagger (OpenAPI)**.

## Stack

- Node.js
- TypeScript
- Express
- Sequelize + sequelize-typescript
- PostgreSQL
- Jest + Supertest
- pnpm

## Requisitos

- Node.js 18+
- pnpm 8+
- Base de datos PostgreSQL disponible

## Instalación

```bash
pnpm install
```

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con:

```env
DATA_BASE_URL=postgres://USUARIO:PASSWORD@HOST:PUERTO/NOMBRE_DB
```

> `DATA_BASE_URL` es obligatoria para conectar Sequelize con PostgreSQL.

## Scripts disponibles

- `pnpm dev` → inicia el servidor en modo desarrollo con recarga (`tsx watch`).
- `pnpm build` → compila TypeScript a `dist/`.
- `pnpm start` → ejecuta el build compilado.
- `pnpm test` → ejecuta tests con Jest.
- `pnpm test:coverage` → limpia datos de prueba y genera cobertura.

## Ejecución

### Desarrollo

```bash
pnpm dev
```

Servidor por defecto: `http://localhost:3000`

### Producción local

```bash
pnpm build
pnpm start
```

## Endpoints base

Prefijo global: `/api`

### Health check

- `GET /api/` → `{ ok: true }`

### Productos

- `GET /api/products`
  - Lista productos.
  - Soporta filtros y ordenamiento por query params:
    - `sortBy`: `name | nombre | price | precio | available | disponibilidad | createdAt`
    - `order`: `ASC | DESC` (por defecto `DESC`)
    - `minPrice | precioMin`
    - `maxPrice | precioMax`
    - `name | nombre` (búsqueda parcial)

- `GET /api/products/:id`
  - Obtiene un producto por id.

- `POST /api/products`
  - Crea un producto.
  - Body esperado:

```json
{
  "name": "Teclado mecánico",
  "price": 79.99,
  "available": true
}
```

- `PUT /api/products/:id`
  - Actualiza uno o más campos de un producto.
  - Body parcial permitido (`name`, `price`, `available`).

- `DELETE /api/products/:id`
  - Elimina un producto por id.

## Validaciones actuales

En creación (`POST /api/products`) se valida:

- `name` requerido.
- `price` numérico y mayor a 0.

## Testing

Los tests están en:

- `src/handlers/__test__/product.test.ts`

Ejecutar:

```bash
pnpm test
```

Cobertura:

```bash
pnpm test:coverage
```

## Roadmap corto

- Documentación de endpoints con Swagger/OpenAPI.
- Mayor cobertura de tests para casos de error y validaciones.
- Estandarización de respuestas y manejo de errores.

## Swagger / OpenAPI (base inicial)

Se agregó una plantilla inicial en:

- `docs/openapi.yaml`

Esta especificación ya incluye los endpoints actuales.

Swagger UI ya está disponible en:

- `http://localhost:3000/api/docs`

Archivo OpenAPI en crudo:

- `http://localhost:3000/api/docs/openapi.yaml`

## Notas

- El servidor escucha en `process.env.PORT` (si no existe, usa `3000`).
- La conexión a base de datos se omite automáticamente durante tests (`NODE_ENV=test`).

## Deploy en Render

Este proyecto ya incluye configuración base en `render.yaml`.

### Opción A: Blueprint (recomendado)

1. Sube el repo a GitHub.
2. En Render, elige **New +** → **Blueprint**.
3. Selecciona el repositorio y Render detectará `render.yaml`.
4. Configura los valores de variables sensibles:
   - `DATA_BASE_URL` (obligatoria)
   - `FRONT_END_URL` (URL de tu frontend)

### Opción B: Web Service manual

- **Build Command:** `pnpm install --frozen-lockfile && pnpm build`
- **Start Command:** `pnpm start`
- **Health Check Path:** `/api/`
- **Environment:**
  - `NODE_ENV=production`
  - `DATA_BASE_URL=...`
  - `FRONT_END_URL=...`
