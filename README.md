# Chefsitos Frontend (Angular 21 + Tailwind CSS v4)

Bienvenido al frontend de **Chefsitos**, una plataforma de comercio electrónico profesional diseñada para operar con una arquitectura de microservicios reales. Este proyecto ha sido alineado meticulosamente con los contratos de backend para ofrecer una experiencia de usuario robusta y sin mocks.

---

## Tecnologías Principales

- **Angular 21**: Uso de _Standalone Components_ y _Zoneless Change Detection_.
- **Signals**: Reactividad de vanguardia para la gestión del carrito, autenticación y estados de UI.
- **Tailwind CSS v4**: Estilos modernos con el motor de alto rendimiento v4.
- **Gestión Global de Errores**: Sistema de 3 niveles (GlobalHandler, HttpInterceptor y UI) para prevenir pantallas en blanco.
- **Docker + Nginx**: Configuración optimizada para despliegue en el puerto **8084**.

---

## Arquitectura de Microservicios

El frontend consume directamente los siguientes microservicios reales a través de un proxy inverso configurado en Nginx:

- **Catálogo API** (Port 8081): Gestión de productos y categorías.
- **Órdenes API** (Port 8082): Ciclo de vida completo del pedido.
- **Ventas API** (Port 8083): Gestión del carrito de compras.

> **Nota de Alineación**: Se han eliminado todos los mocks. Los payloads de las peticiones (ej. `nuevaCantidad` en carrito, transiciones de estado en órdenes) coinciden 100% con los contratos del backend.

---

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

---

## Gestión de Errores

La aplicación implementa una estrategia de resiliencia avanzada:

- **Páginas de Error Visuales**: Componentes dedicados para errores 404 y fallos críticos (500).
- **Global Error Handler**: Captura excepciones de ejecución en TypeScript sin detener la aplicación.
- **Interceptores Resilientes**: Redirecciones automáticas ante fallos de servidor o sesiones expiradas.

---

## Autenticación (Modo Demo)

El sistema utiliza una autenticación persistente basada en LocalStorage para simular roles reales sin necesidad de un microservicio de seguridad externo:

- **Admin**: Acceso al panel de control con métricas reales calculadas desde el catálogo.
- **Customer**: Flujo de compra completo, desde el registro del carrito hasta la creación de la orden.

---

## Notas de Implementación

- **Imágenes**: Debido a que el backend no persiste URLs de imagen, se utilizan iconos y placeholders elegantes para mantener una estética premium.
- **Activación de Productos**: El backend requiere que el producto tenga imágenes asociadas en DB para poder activarse. Los nuevos productos creados por la interfaz se registran correctamente pero permanecerán inactivos hasta que se cumpla dicha regla en el backend.
