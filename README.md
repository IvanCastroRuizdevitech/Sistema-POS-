# Sistema POS - Gestión de Tienda de Accesorios de Telefonía Celular

Un sistema completo de punto de venta (POS) desarrollado con React + TypeScript + Tailwind CSS + shadcn/ui para la gestión integral de una tienda de accesorios de telefonía celular.

## 🚀 Características Principales

### Autenticación y Roles
- Sistema de login con roles diferenciados (Administrador, Vendedor)
- Protección de rutas según permisos de usuario
- Gestión de sesiones persistente

### Gestión de Entidades
- **Compañías/Organizaciones**: Registro y gestión completa
- **Tiendas**: Múltiples tiendas por organización
- **Empleados**: Con roles y asignación a tiendas
- **Clientes**: Base de datos de clientes con tipos de identificación
- **Proveedores**: Gestión de proveedores

### Sistema de Inventario
- **Productos**: CRUD completo con categorías
- **Control de stock**: Alertas de bajo inventario (≤10 unidades)
- **Códigos de barras**: Sistema de identificación simulado
- **Categorías**: Organización de accesorios
- **Kardex**: Trazabilidad completa de movimientos

### Interfaz POS
- Interfaz táctil optimizada para ventas
- Métodos de pago múltiples (Efectivo, Transferencia, Tarjeta)
- Carrito de compras dinámico
- Recibos digitales automáticos
- Actualización automática de inventario

### Reportes y Analytics
- Reportes diarios de ventas con gráficos
- Análisis de ingresos mensuales
- Control de gastos y egresos
- Arqueo de turno para vendedores
- Dashboard con métricas importantes
- Exportación de reportes a CSV

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** con TypeScript
- **Tailwind CSS** para estilos
- **shadcn/ui** para componentes UI
- **Lucide React** para iconos
- **Recharts** para gráficos y visualizaciones
- **React Router DOM** para navegación

### Backend Simulado
- **localStorage** para persistencia de datos
- Servicios TypeScript para lógica de negocio
- Estructura de datos basada en esquema SQL

### Herramientas de Desarrollo
- **Vite** como bundler y servidor de desarrollo
- **Git/GitHub** para control de versiones
- **pnpm** como gestor de paquetes

## 📋 Requisitos del Sistema

- Node.js 22 o superior
- pnpm (recomendado) o npm
- Navegador web moderno

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/IvanCastroRuizdevitech/Sistema-POS-.git
cd Sistema-POS-
```

### 2. Instalar dependencias
```bash
pnpm install
# o
npm install
```

### 3. Ejecutar en modo desarrollo
```bash
pnpm run dev
# o
npm run dev
```

### 4. Abrir en el navegador
Navegar a `http://localhost:5173`

## 👥 Usuarios de Demostración

El sistema incluye usuarios de demostración preconfigurados:

### Administrador
- **Email**: admin@tienda.com
- **Contraseña**: admin123
- **Permisos**: Acceso completo a todas las funcionalidades

### Vendedor
- **Email**: vendedor@tienda.com
- **Contraseña**: vendedor123
- **Permisos**: Ventas, consulta de inventario, arqueo de turno

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── forms/          # Formularios
│   ├── layout/         # Layout y navegación
│   └── tables/         # Tablas
├── context/            # Contextos de React
├── data/               # Gestión de datos y localStorage
├── pages/              # Páginas principales
├── services/           # Servicios de negocio
├── types/              # Definiciones de TypeScript
└── utils/              # Utilidades
```

## 🔧 Funcionalidades por Rol

### Administrador
- ✅ Gestión completa de compañías y tiendas
- ✅ Administración de empleados y clientes
- ✅ Control total de productos e inventario
- ✅ Acceso a todos los reportes y analytics
- ✅ Configuración del sistema
- ✅ Gestión de proveedores

### Vendedor
- ✅ Realizar ventas en el POS
- ✅ Consultar inventario y productos
- ✅ Generar arqueo de turno
- ✅ Ver reportes básicos de ventas
- ✅ Gestión de clientes

## 📊 Módulos del Sistema

### 1. Dashboard
- Métricas principales
- Resumen de ventas del día
- Alertas de stock bajo
- Accesos rápidos

### 2. Gestión de Entidades
- Compañías y organizaciones
- Tiendas y sucursales
- Empleados con roles
- Clientes y proveedores

### 3. Inventario y Productos
- Catálogo de productos
- Control de stock por tienda
- Movimientos de entrada y salida
- Alertas automáticas

### 4. Punto de Venta (POS)
- Interfaz táctil intuitiva
- Búsqueda rápida de productos
- Múltiples métodos de pago
- Recibos digitales

### 5. Reportes y Analytics
- Ventas diarias y mensuales
- Productos más vendidos
- Análisis de ingresos
- Exportación de datos

## 🔒 Seguridad

- Autenticación basada en roles
- Protección de rutas sensibles
- Validación de permisos por funcionalidad
- Sesiones persistentes y seguras

## 📱 Responsive Design

El sistema está completamente optimizado para:
- 💻 Escritorio
- 📱 Tablets
- 📱 Dispositivos móviles
- 🖥️ Pantallas táctiles

## 🎨 Interfaz de Usuario

- Diseño moderno y profesional
- Componentes consistentes con shadcn/ui
- Iconografía clara con Lucide React
- Paleta de colores empresarial
- Navegación intuitiva

## 📈 Métricas y KPIs

El sistema proporciona métricas clave como:
- Total de ingresos por período
- Cantidad de ventas realizadas
- Promedio de valor por venta
- Productos más vendidos
- Evolución temporal de ventas
- Stock disponible por producto

## 🚀 Despliegue

### Desarrollo
```bash
pnpm run dev
```

### Producción
```bash
pnpm run build
pnpm run preview
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para la funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Commit los cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Ivan Castro Ruiz**
- Email: icastror@hotmail.com
- GitHub: [@IvanCastroRuizdevitech](https://github.com/IvanCastroRuizdevitech)

## 🙏 Agradecimientos

- Equipo de desarrollo de shadcn/ui por los componentes UI
- Comunidad de React y TypeScript
- Contribuidores de las librerías utilizadas

---

⭐ Si este proyecto te ha sido útil, ¡no olvides darle una estrella en GitHub!

