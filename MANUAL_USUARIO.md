# Manual de Usuario - Sistema POS

## Introducción

El Sistema POS es una aplicación web completa para la gestión de tiendas de accesorios de telefonía celular. Este manual le guiará a través de todas las funcionalidades disponibles según su rol de usuario.

## Acceso al Sistema

### Iniciar Sesión

1. Abra su navegador web y navegue a la URL del sistema
2. En la página de login, ingrese sus credenciales:
   - **Email**: Su dirección de correo electrónico
   - **Contraseña**: Su contraseña asignada
3. Haga clic en "Iniciar Sesión"

### Usuarios de Demostración

Para probar el sistema, puede usar estas credenciales:

**Administrador:**
- Email: admin@tienda.com
- Contraseña: admin123

**Vendedor:**
- Email: vendedor@tienda.com
- Contraseña: vendedor123

## Navegación Principal

Una vez autenticado, verá el menú lateral con las siguientes opciones:

- **Dashboard**: Resumen general del sistema
- **Compañías**: Gestión de organizaciones
- **Tiendas**: Administración de sucursales
- **Empleados**: Gestión de personal
- **Clientes**: Base de datos de clientes
- **Proveedores**: Gestión de proveedores
- **Productos**: Catálogo de productos
- **Inventario**: Control de stock
- **Ventas**: Punto de venta (POS)
- **Reportes**: Análisis y reportes
- **Configuración**: Ajustes del sistema

## Funcionalidades por Módulo

### Dashboard

El dashboard proporciona una vista general del estado del negocio:

- **Métricas principales**: Ventas del día, ingresos totales
- **Alertas**: Productos con stock bajo
- **Gráficos**: Tendencias de ventas
- **Accesos rápidos**: Enlaces a funciones frecuentes

### Gestión de Compañías

**Para Administradores:**

1. **Crear Nueva Compañía:**
   - Haga clic en "Nueva Compañía"
   - Complete los campos requeridos:
     - Nombre (obligatorio)
     - NIT (opcional)
     - Dirección (opcional)
   - Haga clic en "Crear"

2. **Editar Compañía:**
   - Localice la compañía en la tabla
   - Haga clic en el botón de editar (ícono de lápiz)
   - Modifique los campos necesarios
   - Haga clic en "Actualizar"

3. **Eliminar Compañía:**
   - Haga clic en el botón de eliminar (ícono de papelera)
   - Confirme la eliminación en el diálogo

### Gestión de Tiendas

**Para Administradores:**

1. **Crear Nueva Tienda:**
   - Haga clic en "Nueva Tienda"
   - Complete la información:
     - Nombre (obligatorio)
     - Compañía (seleccionar de la lista)
     - Dirección (opcional)
     - Teléfono (opcional)
   - Haga clic en "Crear"

2. **Gestionar Tiendas:**
   - Use las mismas opciones de editar/eliminar que en compañías
   - Filtre por compañía si es necesario

### Gestión de Clientes

**Para Administradores y Vendedores:**

1. **Registrar Cliente:**
   - Haga clic en "Nuevo Cliente"
   - Complete los datos:
     - Nombre completo (obligatorio)
     - Tipo de identificación
     - Número de identificación
     - Teléfono y email (opcionales)
   - Haga clic en "Crear"

2. **Buscar Clientes:**
   - Use la barra de búsqueda para encontrar clientes por nombre o identificación
   - Los resultados se filtran automáticamente

### Gestión de Productos

**Para Administradores y Vendedores:**

1. **Agregar Producto:**
   - Haga clic en "Nuevo Producto"
   - Complete la información:
     - Nombre del producto (obligatorio)
     - Categoría (obligatorio)
     - Precio (obligatorio)
     - Unidad de medida
     - Tipo de impuesto
   - Haga clic en "Crear"

2. **Filtrar Productos:**
   - Use la barra de búsqueda para buscar por nombre
   - Filtre por categoría usando el selector
   - Los filtros se aplican automáticamente

3. **Gestionar Categorías:**
   - Las categorías se crean automáticamente al agregar productos
   - Use el campo de categoría con autocompletado para consistencia

### Control de Inventario

**Para Administradores y Vendedores:**

1. **Registrar Movimiento de Inventario:**
   - Haga clic en "Nuevo Movimiento"
   - Seleccione:
     - Tienda de destino
     - Producto
     - Tipo de movimiento (Entrada/Salida)
     - Cantidad
   - Haga clic en "Registrar Movimiento"

2. **Monitorear Stock:**
   - Vea el stock actual de cada producto por tienda
   - Identifique productos con stock bajo (marcados en rojo)
   - Use filtros para ver inventario por tienda específica

3. **Alertas de Stock:**
   - El sistema muestra alertas automáticas para productos con ≤10 unidades
   - Los productos aparecen marcados con diferentes colores según el nivel de stock

### Punto de Venta (POS)

**Para Administradores y Vendedores:**

1. **Realizar una Venta:**
   - Seleccione la tienda donde se realiza la venta
   - Busque y agregue productos al carrito:
     - Use la barra de búsqueda
     - Haga clic en "Agregar" junto al producto deseado
     - Ajuste la cantidad si es necesario

2. **Gestionar el Carrito:**
   - Vea el resumen de productos agregados
   - Modifique cantidades directamente en el carrito
   - Elimine productos si es necesario
   - El total se calcula automáticamente incluyendo impuestos

3. **Procesar el Pago:**
   - Seleccione el método de pago:
     - Efectivo
     - Transferencia
     - Tarjeta
   - Para efectivo, ingrese el monto recibido
   - El sistema calculará el cambio automáticamente
   - Haga clic en "Procesar Venta"

4. **Recibo Digital:**
   - Después de procesar la venta, se genera un recibo automáticamente
   - El recibo incluye todos los detalles de la transacción
   - El inventario se actualiza automáticamente

### Reportes y Analytics

**Para Administradores:**

1. **Reportes de Ventas:**
   - Vea gráficos de ventas diarias
   - Analice tendencias mensuales
   - Filtre por rango de fechas
   - Filtre por tienda específica

2. **Métricas Principales:**
   - Total de ingresos en el período seleccionado
   - Cantidad total de ventas realizadas
   - Promedio de valor por venta
   - Productos más vendidos

3. **Exportar Reportes:**
   - Haga clic en "Exportar CSV" para descargar los datos
   - Los archivos incluyen toda la información filtrada

**Para Vendedores:**

1. **Arqueo de Turno:**
   - Acceda a reportes básicos de sus ventas
   - Vea el resumen de ventas del día
   - Consulte el total de efectivo que debe entregar

### Configuración del Sistema

**Solo para Administradores:**

- Acceda a configuraciones avanzadas del sistema
- Gestione parámetros globales
- Configure alertas y notificaciones

## Consejos de Uso

### Mejores Prácticas

1. **Mantenga los datos actualizados:**
   - Registre movimientos de inventario inmediatamente
   - Actualice información de clientes regularmente

2. **Use las funciones de búsqueda:**
   - Aproveche los filtros para encontrar información rápidamente
   - Use términos específicos para mejores resultados

3. **Revise las alertas:**
   - Preste atención a las alertas de stock bajo
   - Tome acción preventiva para evitar desabastecimiento

4. **Backup de datos:**
   - Aunque el sistema usa localStorage, considere exportar reportes regularmente
   - Mantenga respaldos de información crítica

### Solución de Problemas Comunes

1. **No puedo iniciar sesión:**
   - Verifique que el email y contraseña sean correctos
   - Asegúrese de que no haya espacios extra
   - Contacte al administrador si persiste el problema

2. **No veo ciertos módulos:**
   - Esto es normal según su rol de usuario
   - Los vendedores tienen acceso limitado comparado con administradores

3. **Error al procesar venta:**
   - Verifique que haya stock suficiente
   - Confirme que todos los campos estén completos
   - Intente refrescar la página si persiste

4. **Los reportes no cargan:**
   - Verifique su conexión a internet
   - Intente con un rango de fechas más pequeño
   - Contacte soporte técnico si continúa

## Soporte Técnico

Para asistencia técnica o reportar problemas:

- **Email**: icastror@hotmail.com
- **Desarrollador**: Ivan Castro Ruiz

## Actualizaciones

El sistema se actualiza regularmente con nuevas funcionalidades y mejoras. Los cambios importantes se comunicarán a través de:

- Notificaciones en el sistema
- Comunicados por email
- Documentación actualizada

---

Este manual cubre las funcionalidades principales del Sistema POS. Para funcionalidades específicas o casos de uso particulares, no dude en contactar al equipo de soporte.

