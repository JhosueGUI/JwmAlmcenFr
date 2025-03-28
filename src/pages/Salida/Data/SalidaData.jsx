export const ColumnasInicialesSalida = [
    { field: 'id', header: 'ID' },
    { field: 'fecha', header: 'Fecha' },
    { field: 'vale', header: 'Vale' },
    { field: 'tipo_operacion', header: 'Tipo Operacion' },
    { field: 'destino', header: 'Destino' },
    { field: 'personal', header: 'Personal' },
    { field: 'unidad', header: 'Unidad' },
    { field: 'duracion_neumatico', header: 'Duracion De Neumatico' },
    { field: 'kilometraje_horometro', header: 'Kilometraje / Horómetro' },
    { field: 'fecha_vencimiento', header: 'Fecha de Vencimiento' },
    { field: 'SKU', header: 'SKU' },
    { field: 'familia', header: 'Familia' },
    { field: 'sub_familia', header: 'Sub Familia' },
    { field: 'articulo', header: 'Articulo' },
    { field: 'marca', header: 'Marca' },
    { field: 'precio_dolares', header: 'Precio Dolares' },
    { field: 'precio_soles', header: 'Precio Soles' },
    { field: 'stock_logico', header: 'Stock Lógico' },
    { field: 'unidad_medida', header: 'UM' },
    { field: 'salida', header: 'Salida' },
    { field: 'precio_unitario_soles', header: 'Precio Unitario Soles' },
    { field: 'precio_total_soles', header: 'Precio Total Soles' },
    { field: 'precio_unitario_dolares', header: 'Precio Unitario Dolares' },
    { field: 'precio_total_dolares', header: 'Precio Total Dolares' },
    { field: 'observaciones', header: 'Observaciones' },
]
export const DataSalida = {
    vale: '',
    tipo_operacion: '',
    destino: '',
    personal_id: '',
    unidad: '',
    duracion_neumatico: '',
    kilometraje_horometro: '',
    fecha_vencimiento: '',
    productos:[],
    observaciones: '',
}
//AÑADI
export const ColumnasInicialesSalidaCombustible = [
    { field: 'id', header: 'ID' },
    { field: 'fecha', header: 'Fecha' },
    { field: 'placa', header: 'Placa' },
    { field: 'tipo', header: 'Tipo de Unidad' },
    { field: 'nombre', header: 'Personal' },
    { field: 'destino', header: 'Destino' },
    { field: 'numero_salida_ruta', header: 'Salida Ruta' },
    { field: 'numero_salida_stock', header: 'Salida Stock' },
    { field: 'precio_unitario_soles', header: 'Precio Unitario Soles' },
    { field: 'precio_total_soles', header: 'Precio Total Soles' },
    { field: 'precio_total_igv', header: 'Precio Total Sin IGV' },
    { field: 'contometro_surtidor', header: 'Contómetro' },
    { field: 'margen_error_surtidor', header: 'Margen de Error' },
    { field: 'resultado', header: 'Resultado' },
    { field: 'precinto_nuevo', header: 'Precinto Nuevo' },
    { field: 'precinto_anterior', header: 'Precinto Anterior' },
    { field: 'kilometraje', header: 'Kilometraje' },
    { field: 'horometro', header: 'Horómetro' },
    { field: 'observacion', header: 'Observacion' },
]

export const DataSalidaCombustible = {
    fecha: '',
    SKU: 537,
    numero_salida_combustible: '',
    numero_salida_ruta: '',
    grifo_id: '',
    tipo_comprobante: '',
    numero_comprobante: '',
    total:0,
    precio_unitario_soles: '',
    precio_total_soles: '',
    precio_total_igv:'',

    tipo_operacion: '',
    marca: '',
    observaciones: '',
    destino_combustible_id: '',
    personal_id: '',
    flota_id: '',
    contometro_surtidor: '',
    precinto_nuevo: '',
    precinto_anterior: '',
    kilometraje: '',
    horometro: '',
    observacion: '',
}