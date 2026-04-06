# Chefsitos Frontend (Angular 21 + Tailwind CSS v4)

Bienvenido al frontend de **Chefsitos**, una plataforma de comercio electrónico profesional diseñada para operar con una arquitectura de microservicios reales. Este proyecto ha evolucionado de una temática gastronómica hacia un lenguaje de **tienda en línea universal y neutra**, alineada meticulosamente con los contratos de backend para ofrecer una experiencia de usuario robusta.

## Tecnologías Principales

- **Angular 21**: Uso de _Standalone Components_, _Signals_ y _Zoneless Change Detection_.
- **Signals**: Reactividad de vanguardia para la gestión del carrito, autenticación y estados de UI.
- **Tailwind CSS v4**: Estilos modernos con el motor de alto rendimiento v4.
- **Arquitectura de Seguridad**: Implementación de `guards` avanzados (`adminGuard` y `customerGuard`) para la separación estricta de experiencias.
- **Gestión Global de Errores**: Sistema de 3 niveles (GlobalHandler, HttpInterceptor y UI) para prevenir pantallas en blanco.
- **Docker + Nginx**: Configuración optimizada para despliegue en el puerto **8084**.

## Arquitectura de Microservicios

El Frontend de **Chefsitos** adopta una política de seguridad estricta y ruteo centralizado llamado **Flujo Cerrado**.
ESTÁ ESTRICTAMENTE PROHIBIDO (y deshabilitado por diseño) que el Frontend se comunique directamente con los microservicios individuales (8081, 8082, 8083). Todo debe pasar a través del **API Gateway**.

**Flujo de Comunicación Oficial:**
`Frontend (UI) --> API Gateway (localhost:8080) --> Sistema Interno de Microservicios`

- **API Gateway (Port 8080)**: Único punto de acceso al clúster de backend para resolver:
  - Rutas de `/api/v1/productos` & `/api/v1/categorias` (Catálogo API)
  - Rutas de `/api/v1/ordenes` (Órdenes API)
  - Rutas de `/api/v1/carritos` (Ventas API)

En el marco de desarrollo, Angular realiza este mapeo automáticamente usando `proxy.conf.json`. Para Nginx (producción dockerizada), ver `nginx.conf`. Las URL base no se harcodean.

## Despliegue con Docker (Recomendado)

Para levantar la aplicación en el puerto **8084**:

1. **Construir la imagen:**

   ```bash
   docker build -t chefsitos-front:latest .
   ```

2. **Levantar el contenedor:**

   ```bash
   docker run -d -p 8084:80 --name chefsitos-front --add-host=host.docker.internal:host-gateway chefsitos-front:latest
   ```

3. **Verificación:**
   Accede a [http://localhost:8084](http://localhost:8084).

## Gestión de Errores

La aplicación implementa una estrategia de resiliencia avanzada:

- **Páginas de Error Visuales**: Componentes dedicados para errores 404 y fallos críticos (500).
- **Global Error Handler**: Captura excepciones de ejecución en TypeScript sin detener la aplicación.
- **Interceptores Resilientes**: Redirecciones automáticas ante fallos de servidor o sesiones expiradas.

## Autenticación y Experiencias de Usuario

El sistema utiliza una arquitectura de **Experiencias Separadas** basada en roles reales simulados localmente:

- **Admin**: Acceso exclusivo al panel de control y gestión. Los administradores tienen restringido el acceso a las vistas de cliente (Catálogo, Carrito, etc.) y son redirigidos automáticamente a su Dashboard. El Navbar también se simplifica para ocultar herramientas de compra.
- **Customer**: Flujo de compra completo. Pueden explorar productos, gestionar su carrito y crear órdenes. No pueden acceder a ninguna ruta bajo el path `/admin`.
- **Seguridad**: Implementada a través de `customerGuard` y `adminGuard` para garantizar que cada usuario permanezca en su entorno designado.
