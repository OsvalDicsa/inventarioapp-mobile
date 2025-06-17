# Inventario Backend

Servidor Express para la aplicación de inventario.

## Instalación

```bash
cd backend
npm install
```

## Variables de entorno

Copiar el archivo `.env.example` a `.env` y completar los valores.

## Uso

```bash
npm start
```

## Endpoints de Registros

- `POST /api/records` – Crear un registro con foto (requiere autenticación)
- `GET /api/records` – Listar registros del usuario
- `PUT /api/records/:id` – Actualizar un registro (sin modificar la foto)
- `DELETE /api/records/:id` – Eliminar un registro y su foto

Las fotos se exponen de forma pública mediante la ruta `/uploads/<nombre>`.
