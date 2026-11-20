# Amaïa Beauty Studio

Sitio web del salón: página de inicio, lista de servicios y precios, y el estudio
digital de uñas donde se diseña un set y se cotiza al instante (precios en RD$).

## Requisitos

- **Node.js 20 o superior** — descárgalo de <https://nodejs.org> (elige la versión LTS).
  Para comprobar que ya lo tienes instalado, abre una terminal y ejecuta:

  ```sh
  node --version
  ```

## Cómo ejecutarlo en tu PC

1. Descomprime este archivo ZIP en una carpeta.
2. Abre una terminal dentro de esa carpeta.
3. Instala las dependencias (solo la primera vez):

   ```sh
   npm install
   ```

4. Configura la conexión local con Odoo. Copia `.env.example` a `.env.local` y
   define `VITE_ODOO_URL` con la dirección base del servidor Odoo. Para este
   entorno local, Odoo escucha en `http://localhost:8030`.

5. Inicia el sitio en modo desarrollo:

   ```sh
   npm run dev
   ```

6. Abre en tu navegador la dirección que aparece en la terminal
   (normalmente <http://localhost:3000> o <http://localhost:5173>).

Para detenerlo, presiona `Ctrl + C` en la terminal.

## Otros comandos útiles

| Comando           | Qué hace                                              |
| ----------------- | ----------------------------------------------------- |
| `npm run build`   | Genera la versión lista para publicar (carpeta `dist`) |
| `npm run preview` | Muestra localmente la versión generada con `build`     |
| `npm test`        | Ejecuta las pruebas automáticas (precios, rutas, etc.) |
| `npm run lint`    | Revisa el código en busca de errores                   |

## Estructura del proyecto

- `src/routes/` — las páginas del sitio (inicio, servicios, estudio).
- `src/components/` — piezas reutilizables de la interfaz.
- `src/lib/nails.ts` — lista oficial de precios de uñas y cálculo del total.
- `src/lib/services.ts` — lista de servicios y precios del salón.
- `src/assets/` — fotos e imágenes del sitio.

## Sincronización de precios con Odoo

Los precios de servicios, variantes por tamaño, acabados y cotizaciones se
consultan en tiempo real desde `GET /api/amaia/catalog` del módulo Odoo
`amaia_catalog_api`. El catálogo se actualiza cada minuto y al volver a enfocar
la página. La moneda esperada es DOP (RD$); si Odoo no responde o la compañía no
está configurada en DOP, la web muestra un error de conexión y no presenta una
tarifa local desactualizada.

En producción, `VITE_ODOO_URL` debe ser la URL HTTPS pública de Odoo que puedan
alcanzar los visitantes del sitio; `localhost` solo sirve para desarrollo en la
misma computadora.

## Tecnologías

- TanStack Start (React 19 + TypeScript)
- Tailwind CSS 4
- Vite
