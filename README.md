## Chefsitos Frontend

Frontend para proyecto final de TSIS

## Requisitos

- Node.js 22.12.0. Se puede utilizar [https://github.com/nvm-sh/nvm](Node Version Manager) para instalar y gestionar versiones de Node.js.
- npm incluido con Node.js

> Este proyecto usa Angular CLI local, por lo que no es necesario tener `ng` global en la misma versión.

## Instalación

Instala las dependencias del proyecto:

```bash
npm install
```

## Ejecutar en desarrollo

```bash
npx ng version # Verificar la versión de Angular CLI
npx ng serve  # Levantar el servidor de desarrollo
```

La aplicación quedará disponible en:

```bash
http://localhost:4200
```

## Ejecutar en otro puerto

```bash
npx ng serve --port 4300
```

## Build de producción

```bash
npx ng build
```

## Estándar de codificación

Se han incluído configuración de Vscode y Prettier en el proyecto para formateo de código.
