# UAMIShop Frontend (Angular 21 + Tailwind CSS v4)

Bienvenido al frontend de **UAMIShop**, una plataforma de comercio electrónico moderna, elegante e innovadora diseñada para la venta de productos físicos. Este proyecto consume tres microservicios independientes y ofrece una experiencia de usuario fluida basada en **Angular Signals**.

---

## Tecnologías Principales

- **Angular 21**: Uso de _Standalone Components_ y _Zoneless Change Detection_.
- **Signals**: Reactividad de vanguardia para la gestión del carrito, autenticación y estados de UI.
- **Tailwind CSS v4**: Estilos modernos, responsivos y altamente personalizables.
- **Reactive Forms**: Validaciones estrictas y flujos de datos robustos.
- **Docker + Nginx**: Empaquetado ligero y configuración de proxy inverso para evitar problemas de CORS.

---

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js 22.12.0** o superior.
- **Yarn** (recomendado) o npm.
- **Docker** (para despliegue en contenedores).

---

## Arquitectura de Microservicios

El frontend está configurado para conectarse a tres servicios en el host local. La comunicación se realiza a través de un **Proxy Nginx** en producción o mediante `proxy.conf.json` en desarrollo:

- **Catálogo API**: `http://localhost:8081`
- **Órdenes API**: `http://localhost:8082`
- **Ventas/Carrito API**: `http://localhost:8083`

---

## Desarrollo Local

Para ejecutar el proyecto en modo desarrollo con recarga automática:

1. **Instalar dependencias:**

   ```bash
   yarn install
   ```

2. **Iniciar servidor de desarrollo (Port 4200):**

   ```bash
   yarn start
   ```

3. **Acceder a la aplicación:**
   Abre [http://localhost:4200](http://localhost:4200) en tu navegador.

---

## Despliegue con Docker (Recomendado)

Para empaquetar y ejecutar la aplicación en el puerto **8084** de forma aislada:

1. **Construir la imagen:**

   ```bash
   docker build -t uamishop-front:latest .
   ```

2. **Levantar el contenedor:**

   ```bash
   docker run -d -p 8084:80 --name uamishop-front uamishop-front:latest
   ```

3. **Verificar:**
   La aplicación estará disponible en [http://localhost:8084](http://localhost:8084).

---

## Autenticación (Simulada)

El sistema utiliza una autenticación simulada persistente en `localStorage`. Puedes probar los dos roles principales:

- **Rol ADMIN**: Permite acceder al Panel de Administración (`/admin`), gestionar categorías, productos y ver métricas reales.
- **Rol CUSTOMER**: Permite navegar el catálogo, gestionar el carrito y realizar pedidos reales.

> **Nota:** Al iniciar sesión, se utiliza un `TEST_CLIENT_ID` predefinido para vincular tus órdenes en el backend.

---

## Estructura del Proyecto

- `src/app/core`: Modelos, servicios API y guards de seguridad.
- `src/app/shared`: Componentes UI reutilizables (Navbar, Footer, Toasts, Badges).
- `src/app/features`: Módulos principales (Catalog, Cart, Orders, Admin Dashboard).
- `src/app/environments`: Configuración de URLs de microservicios.

---

## Notas de Implementación

- **Gestión de Imágenes**: El formulario de productos incluye una URL de imagen por defecto (Unsplash) para asegurar que la activación del producto sea exitosa en el backend sin requerir carga manual de archivos.
- **Zoneless**: La aplicación funciona sin `zone.js`, optimizando el rendimiento mediante el uso exclusivo de Signals para la detección de cambios.
- **SEO**: Se han incluido etiquetas meta dinámicas y estructura semántica HTML5.
