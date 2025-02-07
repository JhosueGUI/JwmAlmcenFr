export const ColumnasInicialesOrden=[
    {field:'id',header:'Codigo'},
    {field:'fecha',header:'Fecha'},
    {field:'numero_compra',header:'Numero de Orden de Compra'},
    {field:'proveedor',header:'Proveedor'},
    {field:'requerimiento',header:'Requerimiento'},
    {field:'solicitante',header:'Solicitante'},
    {field:'cotizacion',header:'Cotización'},


]
export const DataOrden={
    orden_compra:"",
    proveedor_id:"",
    requerimiento:"",
    solicitante:"",
    detalle:"",
    cotizacion:"",
    gestor_compra:"",
    productos: [],
}
export const DataProductoOrden={
    precio_unitario_dolares:"",
    precio_unitario_soles:"",
    unidad_medida_id:'',
    sub_familia_id:'',
    SKU:"",
    nombre:"",
}