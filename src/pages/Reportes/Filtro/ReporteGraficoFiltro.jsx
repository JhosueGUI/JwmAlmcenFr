import React, { useState, useEffect, useContext } from 'react';
import { Chart } from 'primereact/chart';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown'; // Importar Dropdown
import { Calendar } from 'primereact/calendar'; // Importar Calendar
import { Carousel } from 'primereact/carousel';

export const ReporteGraficoFiltro = () => {
    const [datosGrafico, setDatosGrafico] = useState({});
    const [datosGraficoMeses, setDatosGraficoMeses] = useState({});
    const [opcionesGrafico, setOpcionesGrafico] = useState({});
    const [opcionesGraficoMeses, setOpcionesGraficoMeses] = useState({});

    const [año, setAño] = useState(new Date().getFullYear()); // Año actual por defecto
    // Año actual por defecto
    const [mes, setMes] = useState(null); // Mes actual por defecto (0-11, por lo que sumamos 1)
    const [subFamilias, setSubFamilias] = useState([]); // Estado para subfamilias
    const [subFamiliaId, setSubFamiliaId] = useState(); // Estado para sub_familia_id

    const [productoMayor, setProductoMayor] = useState("");
    const [productoMenor, setProductoMenor] = useState("");
    const [totalSalidas, setTotalSalidas] = useState("");
    

    const { obtenerToken } = useContext(AuthContext);

    // Función para obtener las subfamilias
    const obtenerSubFamilias = async () => {
        try {
            const token = obtenerToken();
            if (token) {
                const respuestaGet = await axios.get("https://jwmalmcenb-production.up.railway.app/api/almacen/sub_familia/sub_familia", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setSubFamilias(respuestaGet.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const TraerFiltro = async () => {
        try {
            const token = obtenerToken();
            if (token) {
                const data = {
                    sub_familia_id: subFamiliaId
                };
                const respuestaGet = await axios.get("https://jwmalmcenb-production.up.railway.app/api/almacen/reporte/familia/filtro", {
                    params: data,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log(respuestaGet.data
                )

                // Extraer datos de la respuesta
                const datos = respuestaGet.data.data;
                const productos = datos.productos;
                const subFamilia = datos.sub_familia;
                const totalSalidasGeneral = datos.total_salidas_general;

                const productoMayor = respuestaGet.data.producto_mayor;
                const productoMenor = respuestaGet.data.producto_menor;
                setTotalSalidas(respuestaGet.data.data.total_salidas_general)

                // Extraer datos para el gráfico
                const etiquetas = productos.map(item => item.SKU); // Usar SKU como etiquetas
                const valores = productos.map(item => item.total_salida); // Usar total_salida como valores
                const nombresProductos = productos.map(item => item.nombre); // Usar nombre del producto para tooltips

                const datosGrafico = {
                    labels: etiquetas,
                    datasets: [
                        {
                            label: 'Total Salida',
                            data: valores,
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
                };

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

                setDatosGrafico(datosGrafico);
                setProductoMayor(productoMayor);
                setProductoMenor(productoMenor);
                setOpcionesGrafico(opciones);
                console.log({
                    subFamilia,
                    totalSalidasGeneral,
                    productoMayor,
                    productoMenor
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const TraerFiltroMes = async () => {
        try {
            const token = obtenerToken();
            if (token) {
                const data = {
                    año,
                    sub_familia_id: subFamiliaId
                };

                const respuestaGet = await axios.get("https://jwmalmcenb-production.up.railway.app/api/almacen/reporte/familia/filtro/meses", {
                    params: data,
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

                // Preparar etiquetas de meses con el año
                const etiquetas = Object.values(datos).map(item => `${item.mes} ${año}`);

                // Inicializar datasets
                const datasets = [];

                // Agrupar datos por producto y mes
                Object.entries(datos).forEach(([key, item]) => {
                    item.productos.forEach((producto, index) => {
                        // Verificar si el dataset para este producto ya existe
                        let dataset = datasets.find(ds => ds.label === producto.nombre);
                        if (!dataset) {
                            // Asignar colores predefinidos en lugar de colores aleatorios
                            const backgroundColor = backgroundColors[index % backgroundColors.length];
                            const borderColor = borderColors[index % borderColors.length];

                            dataset = {
                                label: producto.nombre,
                                data: new Array(etiquetas.length).fill(0), // Inicializa con 0s para cada mes
                                backgroundColor: backgroundColor,
                                borderColor: borderColor,
                                borderWidth: 1
                            };
                            datasets.push(dataset);
                        }

                        // Encontrar el índice del mes para actualizar los datos
                        const mesIndex = etiquetas.indexOf(`${item.mes} ${año}`);
                        if (mesIndex !== -1) {
                            dataset.data[mesIndex] = producto.salidas.reduce((total, salida) => total + parseInt(salida.numero_salida), 0);
                        }
                    });
                });

                // Datos del gráfico
                const datosGrafico = {
                    labels: etiquetas,
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
            console.log("Error en la solicitud:", error);
        }
    };







    useEffect(() => {
        obtenerSubFamilias();
    }, []);

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


    const items = [
        { name: '1. Año' },
        { name: '2. Mes' },
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
                    <h2> Reportes de Productos </h2>
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
                                <label htmlFor="subFamilia"> Sub Familia:</label>
                                <Dropdown
                                    id="subFamilia"
                                    value={subFamiliaId}
                                    options={subFamilias}
                                    optionLabel="nombre"
                                    placeholder="Selecciona una sub familia"
                                    filter
                                    filterBy="nombre"
                                    onChange={(e) => setSubFamiliaId(e.value)}
                                    style={{ width: '100%' }}
                                />
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
                                <span><span style={{ color: '#1ea97c' }}>Nombre:</span> {productoMayor ? productoMayor.nombre : "No hay datos disponibles."}</span>
                                <span><span style={{ color: '#1ea97c' }}>SKU:</span> {productoMayor ? productoMayor.SKU : "No hay datos disponibles."}</span>
                                <span><span style={{ color: '#1ea97c' }}>Número de Salida:</span> {productoMayor ? productoMayor.total_salida : "No hay datos disponibles."}</span>
                            </div>
                        </div>
                    </div>
                    <div className="RegistroProduct" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '10px', background: 'rgba(255, 231, 230, 0.7)', border: 'solid #ff5757', borderWidth: '0 0 0 10px', width: '100%' }}>
                        <div className="Producto" style={{ padding: '15px', width: '100%' }}>
                            <span style={{ fontSize: '20px', color: '#ff5757', fontWeight: 'bold', display: 'block', textAlign: 'center' }}>Producto Menor</span>
                            <div style={{ borderTop: '1px solid #ff5757', width: '100%', margin: '10px 0' }}></div>
                            <div className="contenidoProducto" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <span><span style={{ color: '#ff5757' }}>Nombre:</span> {productoMenor ? productoMenor.nombre : "No hay datos disponibles."}</span>
                                <span><span style={{ color: '#ff5757' }}>SKU:</span> {productoMenor ? productoMenor.SKU : "No hay datos disponibles."}</span>
                                <span><span style={{ color: '#ff5757' }}>Número de Salida:</span> {productoMenor ? productoMenor.total_salida : "No hay datos disponibles."}</span>
                            </div>
                        </div>
                    </div>
                    <div className="RegistroProduct" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '10px', background: 'rgba(219, 234, 254, 0.7)', border: 'solid #4A7DE9', borderWidth: '0 0 0 10px', width: '100%' }}>
                        <div className="Producto" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', padding: '15px', width: '100%' }}>
                            <span style={{ fontSize: '20px', color: '#4A7DE9', fontWeight: 'bold', display: 'block', textAlign: 'center' }}>Total de Salidas Registradas</span>{totalSalidas ? totalSalidas : "No hay datos disponibles."}<span> </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grafico" style={{ width: '60%', background: 'white', padding: '10px', borderRadius: '17px', overflowY: 'scroll', minHeight: '100px', maxHeight: '1000px' }}>
                <div className="encabezado" style={{ width: '100%', color: '#4a7de9', padding: '20px' }}>
                    <h2>Gráfico de barras por Sub Familia :</h2>
                    <span style={{ color: '#4a7de9' }}>
                        Este gráfico es según los datos recaudados hasta el momento por cada sub familia
                    </span>
                </div>
                <Chart type="bar" data={datosGrafico} options={opcionesGrafico} />
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
