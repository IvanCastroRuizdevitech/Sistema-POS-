import { getLocalStorageData, setLocalStorageData, generateId } from '../data/localStorage';
import { 
  Usuario, 
  Persona, 
  TipoPersonaEnum, 
  Producto, 
  Inventario, 
  Kardex, 
  Venta, 
  DetalleVenta, 
  Gasto, 
  DetalleGasto,
  TipoMovimientoEnum,
  MetodoPago,
  EstadoVentaEnum
} from '../types';

export const migrateInitialData = () => {
  const data = getLocalStorageData();
  
  // Check if migration has already been done
  if (data.migrated) {
    console.log('Datos ya migrados');
    return;
  }

  console.log('Iniciando migración de datos iniciales...');

  // 1. Crear personas adicionales (empleados, clientes, proveedores)
  const personas: Persona[] = [
    // Empleados adicionales
    {
      id: generateId(),
      nombre: 'María González',
      telefono: '3001111111',
      direccion: 'Calle 123 #45-67',
      tipo: TipoPersonaEnum.Empleado,
      tipo_identificacion_id: '1',
      numero_identificacion: '11111111',
    },
    {
      id: generateId(),
      nombre: 'Carlos Rodríguez',
      telefono: '3002222222',
      direccion: 'Carrera 89 #12-34',
      tipo: TipoPersonaEnum.Empleado,
      tipo_identificacion_id: '1',
      numero_identificacion: '22222222',
    },
    // Clientes
    {
      id: generateId(),
      nombre: 'Ana Martínez',
      telefono: '3003333333',
      direccion: 'Avenida 56 #78-90',
      tipo: TipoPersonaEnum.Cliente,
      tipo_identificacion_id: '1',
      numero_identificacion: '33333333',
    },
    {
      id: generateId(),
      nombre: 'Luis Pérez',
      telefono: '3004444444',
      direccion: 'Diagonal 12 #34-56',
      tipo: TipoPersonaEnum.Cliente,
      tipo_identificacion_id: '1',
      numero_identificacion: '44444444',
    },
    {
      id: generateId(),
      nombre: 'Carmen Silva',
      telefono: '3005555555',
      direccion: 'Transversal 78 #90-12',
      tipo: TipoPersonaEnum.Cliente,
      tipo_identificacion_id: '1',
      numero_identificacion: '55555555',
    },
    // Proveedores
    {
      id: generateId(),
      nombre: 'TechSupply S.A.S.',
      telefono: '6016666666',
      direccion: 'Zona Industrial Norte',
      tipo: TipoPersonaEnum.Proveedor,
      tipo_identificacion_id: '3',
      numero_identificacion: '900111111-1',
    },
    {
      id: generateId(),
      nombre: 'Accesorios Móviles Ltda.',
      telefono: '6017777777',
      direccion: 'Centro Comercial Plaza',
      tipo: TipoPersonaEnum.Proveedor,
      tipo_identificacion_id: '3',
      numero_identificacion: '900222222-2',
    },
    {
      id: generateId(),
      nombre: 'Distribuidora Digital',
      telefono: '6018888888',
      direccion: 'Parque Empresarial Sur',
      tipo: TipoPersonaEnum.Proveedor,
      tipo_identificacion_id: '3',
      numero_identificacion: '900333333-3',
    },
  ];

  // 2. Crear productos adicionales
  const productos: Producto[] = [
    {
      id: generateId(),
      nombre: 'Funda iPhone 14',
      categoria: 'Fundas',
      precio: 25000,
      unidad_id: '1',
      impuesto_id: '1',
    },
    {
      id: generateId(),
      nombre: 'Protector Pantalla Samsung Galaxy',
      categoria: 'Protectores',
      precio: 15000,
      unidad_id: '1',
      impuesto_id: '1',
    },
    {
      id: generateId(),
      nombre: 'Cargador USB-C Rápido',
      categoria: 'Cargadores',
      precio: 35000,
      unidad_id: '1',
      impuesto_id: '1',
    },
    {
      id: generateId(),
      nombre: 'Audífonos Bluetooth',
      categoria: 'Audífonos',
      precio: 85000,
      unidad_id: '1',
      impuesto_id: '1',
    },
    {
      id: generateId(),
      nombre: 'Cable Lightning 2m',
      categoria: 'Cables',
      precio: 20000,
      unidad_id: '1',
      impuesto_id: '1',
    },
    {
      id: generateId(),
      nombre: 'Power Bank 10000mAh',
      categoria: 'Baterías',
      precio: 65000,
      unidad_id: '1',
      impuesto_id: '1',
    },
    {
      id: generateId(),
      nombre: 'Soporte Vehicular',
      categoria: 'Soportes',
      precio: 30000,
      unidad_id: '1',
      impuesto_id: '1',
    },
    {
      id: generateId(),
      nombre: 'Memoria MicroSD 64GB',
      categoria: 'Memorias',
      precio: 45000,
      unidad_id: '1',
      impuesto_id: '1',
    },
    {
      id: generateId(),
      nombre: 'Adaptador USB-C a 3.5mm',
      categoria: 'Adaptadores',
      precio: 18000,
      unidad_id: '1',
      impuesto_id: '1',
    },
    {
      id: generateId(),
      nombre: 'Limpiador de Pantallas',
      categoria: 'Limpieza',
      precio: 12000,
      unidad_id: '1',
      impuesto_id: '1',
    },
  ];

  // 3. Crear inventario inicial
  const inventarios: Inventario[] = [];
  const kardexEntries: Kardex[] = [];
  
  // Obtener la primera tienda disponible
  const tiendaId = data.tiendas.length > 0 ? data.tiendas[0].id : generateId();
  
  productos.forEach((producto, index) => {
    const cantidadInicial = Math.floor(Math.random() * 50) + 10; // Entre 10 y 60 unidades
    
    const inventario: Inventario = {
      id: generateId(),
      producto_id: producto.id,
      tienda_id: tiendaId,
      saldo: cantidadInicial,
    };
    
    const kardexEntry: Kardex = {
      id: generateId(),
      producto_id: producto.id,
      tienda_id: tiendaId,
      tipo_movimiento: TipoMovimientoEnum.Entrada,
      cantidad: cantidadInicial,
      saldo_anterior: 0,
      saldo_nuevo: cantidadInicial,
      fecha: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Últimos 30 días
      observaciones: 'Inventario inicial',
    };
    
    inventarios.push(inventario);
    kardexEntries.push(kardexEntry);
  });

  // 4. Crear ventas de ejemplo
  const ventas: Venta[] = [];
  const detallesVentas: DetalleVenta[] = [];
  
  // Obtener empleados para asignar como vendedores
  const empleados = [...data.personas.filter(p => p.tipo === TipoPersonaEnum.Empleado), ...personas.filter(p => p.tipo === TipoPersonaEnum.Empleado)];
  const clientes = personas.filter(p => p.tipo === TipoPersonaEnum.Cliente);
  
  for (let i = 0; i < 15; i++) {
    const vendedor = empleados[Math.floor(Math.random() * empleados.length)];
    const cliente = Math.random() > 0.3 ? clientes[Math.floor(Math.random() * clientes.length)] : null;
    
    const venta: Venta = {
      id: generateId(),
      tienda_id: tiendaId,
      vendedor_id: vendedor.id,
      cliente_id: cliente?.id,
      metodo_pago_id: ['1', '2', '3'][Math.floor(Math.random() * 3)], // Efectivo, Transferencia, Tarjeta
      subtotal: 0,
      impuestos: 0,
      total: 0,
      fecha: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000), // Últimos 15 días
      estado: EstadoVentaEnum.Pendiente, // O usa EstadoVentaEnum.Pendiente si está importado
    };
    
    // Crear detalles de venta (1-4 productos por venta)
    const numProductos = Math.floor(Math.random() * 4) + 1;
    let subtotalVenta = 0;
    
    for (let j = 0; j < numProductos; j++) {
      const producto = productos[Math.floor(Math.random() * productos.length)];
      const cantidad = Math.floor(Math.random() * 3) + 1;
      const precioUnitario = producto.precio;
      const subtotal = cantidad * precioUnitario;
      
      const detalleVenta: DetalleVenta = {
        id: generateId(),
        venta_id: venta.id,
        producto_id: producto.id,
        cantidad: cantidad,
        precio_unitario: precioUnitario,
        subtotal: subtotal,
      };
      
      detallesVentas.push(detalleVenta);
      subtotalVenta += subtotal;
    }
    
    // Calcular totales de la venta
    const impuestosVenta = subtotalVenta * 0.19; // 19% IVA
    venta.subtotal = subtotalVenta;
    venta.impuestos = impuestosVenta;
    venta.total = subtotalVenta + impuestosVenta;
    
    ventas.push(venta);
  }

  // 5. Crear gastos de ejemplo
  const gastos: Gasto[] = [];
  const detallesGastos: DetalleGasto[] = [];
  
  for (let i = 0; i < 8; i++) {
    const empleado = empleados[Math.floor(Math.random() * empleados.length)];
    
    const gasto: Gasto = {
      id: generateId(),
      tienda_id: tiendaId,
      empleado_id: empleado.id,
      concepto: ['Servicios Públicos', 'Arriendo', 'Papelería', 'Transporte', 'Mantenimiento'][Math.floor(Math.random() * 5)],
      subtotal: 0,
      impuestos: 0,
      total: 0,
      fecha: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000), // Últimos 20 días
    };
    
    // Crear detalles de gasto
    const numDetalles = Math.floor(Math.random() * 3) + 1;
    let subtotalGasto = 0;
    
    for (let j = 0; j < numDetalles; j++) {
      const descripcion = ['Factura de servicios', 'Compra de suministros', 'Pago de arriendo', 'Gastos de transporte'][Math.floor(Math.random() * 4)];
      const valor = Math.floor(Math.random() * 200000) + 50000; // Entre 50,000 y 250,000
      
      const detalleGasto: DetalleGasto = {
        id: generateId(),
        gasto_id: gasto.id,
        descripcion: descripcion,
        cantidad: 1,
        valor_unitario: valor,
        subtotal: valor,
      };
      
      detallesGastos.push(detalleGasto);
      subtotalGasto += valor;
    }
    
    // Calcular totales del gasto
    const impuestosGasto = subtotalGasto * 0.19; // 19% IVA
    gasto.subtotal = subtotalGasto;
    gasto.impuestos = impuestosGasto;
    gasto.total = subtotalGasto + impuestosGasto;
    
    gastos.push(gasto);
  }

  // 6. Crear relaciones proveedores-productos
  const proveedoresProductos = [];
  const proveedores = personas.filter(p => p.tipo === TipoPersonaEnum.Proveedor);
  
  productos.forEach(producto => {
    const proveedor = proveedores[Math.floor(Math.random() * proveedores.length)];
    proveedoresProductos.push({
      id: generateId(),
      proveedor_id: proveedor.id,
      producto_id: producto.id,
      precio_compra: producto.precio * 0.6, // 60% del precio de venta
      fecha_ultima_compra: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000), // Últimos 60 días
    });
  });

  // 7. Agregar todos los datos al localStorage
  data.personas.push(...personas);
  data.productos.push(...productos);
  data.inventarios.push(...inventarios);
  data.kardex.push(...kardexEntries);
  data.ventas.push(...ventas);
  data.detalles_ventas.push(...detallesVentas);
  data.gastos.push(...gastos);
  data.detalles_gastos.push(...detallesGastos);
  data.proveedores_productos = proveedoresProductos;
  
  // Marcar como migrado
  data.migrated = true;
  
  // Guardar en localStorage
  setLocalStorageData(data);
  
  console.log('Migración de datos completada exitosamente');
  console.log(`- ${personas.length} personas agregadas`);
  console.log(`- ${productos.length} productos agregados`);
  console.log(`- ${inventarios.length} registros de inventario agregados`);
  console.log(`- ${kardexEntries.length} movimientos de kardex agregados`);
  console.log(`- ${ventas.length} ventas agregadas`);
  console.log(`- ${detallesVentas.length} detalles de ventas agregados`);
  console.log(`- ${gastos.length} gastos agregados`);
  console.log(`- ${detallesGastos.length} detalles de gastos agregados`);
  console.log(`- ${proveedoresProductos.length} relaciones proveedor-producto agregadas`);
};

