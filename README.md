# Queemchi

Sitio de Queemchi con dos destinos de despliegue desde este repositorio:

- `main`: sitio estático Astro publicado en GitHub Pages.
- `shopify-theme`: tema completo Dawn/Shopify, listo para conectar con la tienda.

## Desarrollo del sitio

```bash
npm ci
npm run dev
```

La publicación en GitHub Pages se ejecuta automáticamente con
`.github/workflows/deploy.yml` después de cada cambio en `main`.

## Desarrollo del tema Shopify

Las personalizaciones propias viven también en `shopify/` para que puedan
revisarse junto al sitio. La rama `shopify-theme` contiene el tema instalable
completo con las carpetas `assets`, `config`, `layout`, `locales`, `sections`,
`snippets` y `templates` en la raíz.

Para probar esa rama con Shopify CLI:

```bash
git switch shopify-theme
shopify theme dev --store tu-tienda.myshopify.com
```

En el administrador de Shopify, la integración con GitHub debe apuntar a este
repositorio y a la rama `shopify-theme`.
