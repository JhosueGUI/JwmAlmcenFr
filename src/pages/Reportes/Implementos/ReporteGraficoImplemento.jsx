import React, { useContext, useState } from 'react';
import { Chart } from 'primereact/chart';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Carousel } from 'primereact/carousel';
import { AuthContext } from '../../../context/AuthContext';
import axios from 'axios';
import { GetUnidadImplementos } from './Services/GetUnidadImplementos';

export const ReporteGraficoImplemento = () => {
    //data
    const [dataImplementos, setDataImplementos] = useState({ unidad: '', año: '' })
    const [productoMayor, setProductoMayor] = useState()
    const [productoMenor, setProductoMenor] = useState()
    const [totalSalidas, setTotalSalidas] = useState()

    //año
    const [año, setAño] = useState(new Date().getFullYear()); // Año actual por defecto

    //grafico
    const [graficoData, setGraficoData] = useState(null);
    const [opcionesGrafico, setOpcionesGrafico] = useState({});

    //Grafico mes
    const [datosGraficoMeses, setDatosGraficoMeses] = useState({});
    const [opcionesGraficoMeses, setOpcionesGraficoMeses] = useState({});

    //funcion para manejar el evento de seleccion solo para unidad

    //#region para traier filtro
    //obtener token
    const { obtenerToken } = useContext(AuthContext)
    const TraerFiltro = async () => {
        try {
            const token = obtenerToken()
            if (token) {
                const respuestaGet = await axios.get("http://127.0.0.1:8000/api/almacen/reporte/implementos/filtro", {
                    params: dataImplementos,
                    headers: {
                        Authorization: `Bearer${token}`
                    }
                })
                const datos = respuestaGet.data.data
                setProductoMayor(datos.producto_mayor)
                setProductoMenor(datos.producto_menor)
                setTotalSalidas(datos.total_general)

                // Procesar datos para el gráfico
                const subFamilias = datos.sub_familias;

                // Extraer todos los productos de las subfamilias
                const productos = subFamilias.flatMap(subFamilia => subFamilia.productos);

                // Obtener los SKU, total_salida y nombres de productos
                const labels = productos.map(p => p.SKU);
                const data = productos.map(p => p.total_salida_producto);
                const nombresProductos = productos.map(p => p.nombre);

                setGraficoData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Total Salida',
                            data: data,
                            backgroundColor: [
                                'rgba(255, 159, 64, 0.2)', // Naranja
                                'rgba(75, 192, 192, 0.2)', // Verde agua
                                'rgba(54, 162, 235, 0.2)', // Azul
                                'rgba(153, 102, 255, 0.2)', // Morado
                                'rgba(255, 99, 132, 0.2)', // Rojo
                                'rgba(255, 206, 86, 0.2)', // Amarillo
                                'rgba(75, 192, 192, 0.2)', // Verde agua
                                'rgba(201, 203, 207, 0.2)', // Gris
                                'rgba(255, 99, 71, 0.2)', // Tomate
                                'rgba(100, 149, 237, 0.2)', // Azul cornflower
                                'rgba(255, 20, 147, 0.2)', // Rosa profundo
                                'rgba(124, 252, 0, 0.2)', // Verde pasto
                                'rgba(0, 255, 255, 0.2)', // Cian
                                'rgba(255, 69, 0, 0.2)', // Rojo oscuro
                                'rgba(210, 105, 30, 0.2)', // Castaño
                                'rgba(0, 128, 128, 0.2)', // Verde mar
                                'rgba(255, 105, 180, 0.2)', // Rosa
                                'rgba(255, 215, 0, 0.2)', // Oro
                                'rgba(0, 0, 255, 0.2)', // Azul
                                'rgba(255, 192, 203, 0.2)' // Rosa claro
                            ],
                            borderColor: [
                                'rgb(255, 159, 64)', // Naranja
                                'rgb(75, 192, 192)', // Verde agua
                                'rgb(54, 162, 235)', // Azul
                                'rgb(153, 102, 255)', // Morado
                                'rgb(255, 99, 132)', // Rojo
                                'rgb(255, 206, 86)', // Amarillo
                                'rgb(75, 192, 192)', // Verde agua
                                'rgb(201, 203, 207)', // Gris
                                'rgb(255, 99, 71)', // Tomate
                                'rgb(100, 149, 237)', // Azul cornflower
                                'rgb(255, 20, 147)', // Rosa profundo
                                'rgb(124, 252, 0)', // Verde pasto
                                'rgb(0, 255, 255)', // Cian
                                'rgb(255, 69, 0)', // Rojo oscuro
                                'rgb(210, 105, 30)', // Castaño
                                'rgb(0, 128, 128)', // Verde mar
                                'rgb(255, 105, 180)', // Rosa
                                'rgb(255, 215, 0)', // Oro
                                'rgb(0, 0, 255)', // Azul
                                'rgb(255, 192, 203)' // Rosa claro
                            ],
                            borderWidth: 1
                        }
                    ]
                });
                const opciones = {
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    const index = context.dataIndex;
                                    return `${nombresProductos[index]}: ${context.formattedValue}`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'SKU', // Texto del eje X
                                color: '#4a7de9', // Color del texto
                                font: {
                                    family: 'Arial',
                                    size: 25,
                                    weight: 'bold',
                                    lineHeight: 1.5
                                },
                                padding: { top: 20, left: 0, right: 0, bottom: 0 }
                            }
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Total Salida', // Texto del eje Y
                                color: '#4a7de9', // Color del texto
                                font: {
                                    family: 'Arial',
                                    size: 25,
                                    weight: 'bold',
                                    lineHeight: 1.5
                                },
                                padding: { top: 20, left: 0, right: 0, bottom: 0 }
                            }
                        }
                    }
                };
                setOpcionesGrafico(opciones)
            }
        } catch (error) {
            console.log('Error', error)
        }
    }
    const TraerFiltroMes = async () => {
        try {
            const token = obtenerToken();
            if (token) {
                const respuestaGet = await axios.get("http://127.0.0.1:8000/api/almacen/reporte/implementos/filtro/mes", {
                    params: { ...dataImplementos, año },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
    
                const datos = respuestaGet.data.data;
    
                // Definir colores preestablecidos
                const backgroundColors = [
                    'rgba(255, 159, 64, 0.2)', // Naranja
                    'rgba(75, 192, 192, 0.2)', // Verde agua
                    'rgba(54, 162, 235, 0.2)', // Azul
                    'rgba(153, 102, 255, 0.2)', // Morado
                    'rgba(255, 99, 132, 0.2)', // Rojo
                    'rgba(255, 206, 86, 0.2)', // Amarillo
                    'rgba(75, 192, 192, 0.2)', // Verde agua
                    'rgba(201, 203, 207, 0.2)', // Gris
                    'rgba(255, 99, 71, 0.2)', // Tomate
                    'rgba(100, 149, 237, 0.2)', // Azul cornflower
                    'rgba(255, 20, 147, 0.2)', // Rosa profundo
                    'rgba(124, 252, 0, 0.2)', // Verde pasto
                    'rgba(0, 255, 255, 0.2)', // Cian
                    'rgba(255, 69, 0, 0.2)', // Rojo oscuro
                    'rgba(210, 105, 30, 0.2)', // Castaño
                    'rgba(0, 128, 128, 0.2)', // Verde mar
                    'rgba(255, 105, 180, 0.2)', // Rosa
                    'rgba(255, 215, 0, 0.2)', // Oro
                    'rgba(0, 0, 255, 0.2)', // Azul
                    'rgba(255, 192, 203, 0.2)' // Rosa claro
                ];
    
                const borderColors = [
                    'rgb(255, 159, 64)', // Naranja
                    'rgb(75, 192, 192)', // Verde agua
                    'rgb(54, 162, 235)', // Azul
                    'rgb(153, 102, 255)', // Morado
                    'rgb(255, 99, 132)', // Rojo
                    'rgb(255, 206, 86)', // Amarillo
                    'rgb(75, 192, 192)', // Verde agua
                    'rgb(201, 203, 207)', // Gris
                    'rgb(255, 99, 71)', // Tomate
                    'rgb(100, 149, 237)', // Azul cornflower
                    'rgb(255, 20, 147)', // Rosa profundo
                    'rgb(124, 252, 0)', // Verde pasto
                    'rgb(0, 255, 255)', // Cian
                    'rgb(255, 69, 0)', // Rojo oscuro
                    'rgb(210, 105, 30)', // Castaño
                    'rgb(0, 128, 128)', // Verde mar
                    'rgb(255, 105, 180)', // Rosa
                    'rgb(255, 215, 0)', // Oro
                    'rgb(0, 0, 255)', // Azul
                    'rgb(255, 192, 203)' // Rosa claro
                ];
    
                // Extraer todos los productos de las sub_familias
                const subFamilias = datos.sub_familias;
                const productos = subFamilias.flatMap(subFamilia => subFamilia.productos);
    
                // Función para capitalizar la primera letra
                const capitalizarPrimeraLetra = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    
                // Preparar etiquetas de meses
                const etiquetas = productos.flatMap(producto => 
                    producto.salidas.map(salida => {
                        const fecha = new Date(salida.fecha);
                        const mes = capitalizarPrimeraLetra(fecha.toLocaleString('es-PE', { month: 'long' }));
                        const año = fecha.getFullYear();
                        return `${mes} ${año}`;
                    })
                );
                const uniqueEtiquetas = [...new Set(etiquetas)];
    
                // Inicializar datasets
                const datasets = [];
    
                // Agrupar datos por producto y mes
                productos.forEach((producto, index) => {
                    // Asignar colores predefinidos en lugar de colores aleatorios
                    const backgroundColor = backgroundColors[index % backgroundColors.length];
                    const borderColor = borderColors[index % borderColors.length];
    
                    const dataset = {
                        label: producto.nombre,
                        data: new Array(uniqueEtiquetas.length).fill(0), // Inicializa con 0s para cada mes
                        backgroundColor: backgroundColor,
                        borderColor: borderColor,
                        borderWidth: 1
                    };
    
                    producto.salidas.forEach(salida => {
                        const fecha = new Date(salida.fecha);
                        const mes = capitalizarPrimeraLetra(fecha.toLocaleString('es-PE', { month: 'long' }));
                        const año = fecha.getFullYear();
                        const etiqueta = `${mes} ${año}`;
                        const mesIndex = uniqueEtiquetas.indexOf(etiqueta);
                        if (mesIndex !== -1) {
                            dataset.data[mesIndex] += parseInt(salida.numero_salida, 10);
                        }
                    });
    
                    datasets.push(dataset);
                });
    
                // Datos del gráfico
                const datosGrafico = {
                    labels: uniqueEtiquetas,
                    datasets: datasets
                };
    
                // Opciones del gráfico
                const opciones = {
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    return `${context.dataset.label}: ${context.formattedValue}`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Mes',
                                color: '#4a7de9',
                                font: {
                                    family: 'Arial',
                                    size: 25,
                                    weight: 'bold'
                                }
                            }
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Total Salida',
                                color: '#4a7de9',
                                font: {
                                    family: 'Arial',
                                    size: 25,
                                    weight: 'bold'
                                }
                            }
                        }
                    }
                };
    
                // Actualizar el estado del gráfico
                setDatosGraficoMeses(datosGrafico);
                setOpcionesGraficoMeses(opciones);
    
            }
        } catch (error) {
            console.log('Error', error);
        }
    };
    
    
    const manejarActualizar = () => {
        TraerFiltro();
        TraerFiltroMes();
    };
    // Función para manejar el cambio en el calendario de año
    const manejarCambioAño = (e) => {
        if (e.value) {
            setAño(e.value.getFullYear());
        }
    };

    const handleUnidadChange = (unidadSeleccionado) => {
        setDataImplementos({
            ...dataImplementos,
            unidad: unidadSeleccionado.placa
        });
    };

    const items = [
        { name: '1. Año' },
        { name: '2. Unidad' },
        { name: '3. Ambos' },
    ];
    const itemTemplate = (item) => {
        return (
            <div className="p-d-flex p-jc-center p-ai-center" >
                <span style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '50px', // Ajusta según sea necesario
                }}>{item.name}</span>
            </div>
        );
    };
    return (
        <div className="card" style={{ display: 'flex', gap: '40px', }}>
            <div className="footer" style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '40%', height: '100%' }}>
                <div className="encabezado" style={{ width: '100%', color: '#4a7de9' }}>
                    <h2> Reportes de EPPS </h2>
                    <span style={{ color: '#4a7de9' }}>
                        En este módulo usted observará los reportes Generales
                    </span>
                </div>

                <div className="contenido" style={{ display: 'flex', flexDirection: 'column', width: '100%', background: 'white', padding: '30px', borderRadius: '17px' }}>
                    <div className="seleccion" style={{ display: 'flex', gap: '10px', flexDirection: 'column', alignItems: 'center' }}>
                        <div className="header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                            <span style={{ color: '#4a7de9', fontWeight: 'bold' }}>
                                Puedes Filtrar el Reporte Según :
                            </span>
                            <Carousel
                                value={items}
                                itemTemplate={itemTemplate}
                                numVisible={1}
                                numScroll={1}
                                circular
                                autoplayInterval={2000}
                            />
                        </div>
                        <div style={{ borderTop: '1px solid #ddd', width: '100%', margin: '10px 0' }}></div>
                        <div className="fecha" style={{ display: 'flex', width: '100%', justifyContent: 'space-between', gap: '20px' }}>
                            <div className="p-field" style={{ gap: '10px', alignItems: 'center', width: '100%' }}>
                                <label htmlFor="año">Año:</label>
                                <Calendar
                                    id="año"
                                    value={new Date(año, 0, 1)}
                                    onChange={manejarCambioAño}
                                    view="year"
                                    dateFormat="yy"
                                    style={{ width: '100%' }}
                                    showIcon
                                />
                            </div>

                        </div>
                        <div className="selector" style={{ display: 'flex', justifyContent: 'center', width: '100%', }}>
                            <div className="p-field" style={{ gap: '10px', alignItems: 'center', width: '100%' }}>
                                <label htmlFor="Personal"> Unidad:</label>
                                <GetUnidadImplementos pasarSetDataImplementos={handleUnidadChange} />

                            </div>
                        </div>

                        <Button label="Actualizar" onClick={manejarActualizar} />
                    </div>
                </div>
                <div className="reporteProducto" style={{ width: '100%', background: 'white', padding: '30px', borderRadius: '17px', gap: '10px', display: 'flex', flexDirection: 'column' }}>
                    <div className="RegistroProduct" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '10px', background: 'rgba(228, 248, 240, 0.7)', border: 'solid #1ea97c', borderWidth: '0 0 0 10px', width: '100%' }}>
                        <div className="Producto" style={{ padding: '15px', width: '100%' }}>
                            <span style={{ fontSize: '20px', color: '#1ea97c', fontWeight: 'bold', display: 'block', textAlign: 'center' }}>Producto Mayor</span>
                            <div style={{ borderTop: '1px solid #1ea97c', width: '100%', margin: '10px 0' }}></div>
                            <div className="contenidoProducto" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <span><span style={{ color: '#1ea97c' }}>Nombre: </span>{productoMayor ? productoMayor.nombre : "No hay datos disponibles."}</span>
                                <span><span style={{ color: '#1ea97c' }}>SKU: </span> {productoMayor ? productoMayor.SKU : "No hay datos disponibles."}</span>

                                <span><span style={{ color: '#1ea97c' }}>Número de Salida: </span>{productoMayor ? productoMayor.total_salida_producto : "No hay datos disponibles."}</span>
                            </div>
                        </div>
                    </div>
                    <div className="RegistroProduct" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '10px', background: 'rgba(255, 231, 230, 0.7)', border: 'solid #ff5757', borderWidth: '0 0 0 10px', width: '100%' }}>
                        <div className="Producto" style={{ padding: '15px', width: '100%' }}>
                            <span style={{ fontSize: '20px', color: '#ff5757', fontWeight: 'bold', display: 'block', textAlign: 'center' }}>Producto Menor</span>
                            <div style={{ borderTop: '1px solid #ff5757', width: '100%', margin: '10px 0' }}></div>
                            <div className="contenidoProducto" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <span><span style={{ color: '#ff5757' }}>Nombre: </span>{productoMenor ? productoMenor.nombre : "No hay datos disponibles."}  </span>
                                <span><span style={{ color: '#ff5757' }}>SKU: </span> {productoMenor ? productoMenor.SKU : "No hay datos disponibles."}</span>

                                <span><span style={{ color: '#ff5757' }}>Número de Salida: </span>{productoMenor ? productoMenor.total_salida_producto : "No hay datos disponibles."}</span>
                            </div>
                        </div>
                    </div>
                    <div className="RegistroProduct" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '10px', background: 'rgba(219, 234, 254, 0.7)', border: 'solid #4A7DE9', borderWidth: '0 0 0 10px', width: '100%' }}>
                        <div className="Producto" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', padding: '15px', width: '100%' }}>
                            <span style={{ fontSize: '20px', color: '#4A7DE9', fontWeight: 'bold', display: 'block', textAlign: 'center' }}>Total de Salidas Registradas </span><span>{totalSalidas ? totalSalidas : "No hay datos disponibles."} </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grafico" style={{ width: '60%', background: 'white', padding: '10px', borderRadius: '17px', overflowY: 'scroll', minHeight: '100px', maxHeight: '1000px' }}>
                <div className="encabezado" style={{ width: '100%', color: '#4a7de9', padding: '20px' }}>
                    <h2>Gráfico de barras por Unidad :</h2>
                    <span style={{ color: '#4a7de9' }}>
                        Este gráfico es según los datos recaudados hasta el momento por cada personal
                    </span>
                </div>
                <Chart type="bar" data={graficoData} options={opcionesGrafico} />
                <div className="encabezado" style={{ width: '100%', color: '#4a7de9', padding: '20px' }}>
                    <h2>Gráfico de barras por Meses :</h2>
                    <span style={{ color: '#4a7de9' }}>
                        Este gráfico es según los datos recaudados hasta el momento por cada mes del año
                    </span>
                </div>
                <Chart type="bar" data={datosGraficoMeses} options={opcionesGraficoMeses} />


            </div>

        </div>
    );
};
