import React, { useEffect, useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from 'primereact/dropdown';
import axios from "axios";
import { InputNumber } from "primereact/inputnumber";
import GetPersonal from "../Services/GetPersonal";
import { InputTextarea } from "primereact/inputtextarea";
import { GetProductosSalida } from "../Services/GetProductos";
// Importar ReactPrime Confirmar Dialogo
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { GetStock } from "../../Ingreso/Services/GetStock";
import { GetUnidad } from "../Services/GetUnidad";
import { DataSalidaCombustible } from "../Data/SalidaData";
import { GetDestinoCombustible } from "../Services/GetDestinoCombustible";
import { TabMenu } from "primereact/tabmenu";

const ModalCrearSalidaCombustible = ({ pasarSetSalidas, pasarSetCombustible }) => {
    //const token
    const { obtenerToken } = useContext(AuthContext)
    //#region estado para abrir y cerrar modal de crear
    const [modal, setModal] = useState(false)
    const abrirModal = () => {
        setModal(true)
    }
    const cerrarModal = () => {
        setModal(false)
    }
    //#region estado para traer la data de salida
    const [dataSalida, setDataSalida] = useState(DataSalidaCombustible)
    //funcion para crear salida
    const CrearSalida = async () => {
        try {
            const token = obtenerToken()
            if (token) {
                console.log("Data Salida", dataSalida)
                const respuestaPost = await axios.post('http://localhost:8000/api/almacen/salida_combustible/create', dataSalida, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                console.log("Respuesta", respuestaPost)

                const respuestaGet = await axios.get("http://localhost:8000/api/almacen/salida_combustible/get", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const respuestaGetCombustible = await axios.get("http://localhost:8000/api/almacen/salida_combustible/get/combustible", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const SalidaCombustibleAdaptado = respuestaGet.data.data.map(item => {
                    return {
                        id: item.id || '',
                        fecha: item.fecha || '',
                        flota_id: item.flota?.id || '',
                        placa: item.flota?.placa || '',
                        tipo: item.flota?.tipo || '',
                        personal_id: item.personal?.id || '',
                        nombre: item.personal?.persona?.nombre || '',
                        destino_combustible_id: item.destino_combustible?.id || '',
                        destino: item.destino_combustible?.nombre || '',
                        numero_salida_ruta: item.numero_salida_ruta || '',
                        numero_salida_stock: item.numero_salida_stock || '',
                        precio_unitario_soles: item.precio_unitario_soles || '',
                        precio_total_soles: item.precio_total_soles || '',
                        contometro_surtidor: item.contometro_surtidor || '',
                        margen_error_surtidor: item.margen_error_surtidor || '',
                        resultado: item.resultado || '',
                        precinto_nuevo: item.precinto_nuevo || '',
                        precinto_anterior: item.precinto_anterior || '',
                        kilometraje: item.kilometraje || '',
                        horometro: item.horometro || '',
                        observacion: item.observacion || ''
                    }
                })
                pasarSetSalidas(SalidaCombustibleAdaptado)
                setDataSalida(DataSalidaCombustible);
                pasarSetCombustible(respuestaGetCombustible.data.resp)
                const mensajeDelServidor = respuestaPost.data.resp
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: mensajeDelServidor, life: 3000 });
                cerrarModal()
            }
        } catch (error) {
            console.log("Error", error)
            toast.current.show({ severity: 'info', summary: 'Observación', detail: error.response?.data?.resp || 'Error al Registrar Salida', life: 3000 });

        }
    }
    //#region para manejar los valores de los inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setDataSalida(prevData => ({
            ...prevData,
            [name]: value.toUpperCase()
        }))
    }
    // Manejar cambios en los campos del formulario para solo Personal
    const handlePersonalChange = (personalSeleccionado) => {
        setDataSalida({
            ...dataSalida,
            personal_id: personalSeleccionado.id
        });
    };
    // Manejar cambios en los campos del formulario para solo Unidad
    const handleUnidadChange = (unidadSeleccionado) => {
        setDataSalida({
            ...dataSalida,
            flota_id: unidadSeleccionado.id
        });
    };
    // Manejar cambios en los campos del formulario para solo Destino
    const handleDestinoChange = (destinoSeleccionado) => {
        setDataSalida({
            ...dataSalida,
            destino_combustible_id: destinoSeleccionado.id
        });
    };

    //#region Estado Para Confirmacion
    const toast = useRef(null);
    const reject = () => {
        toast.current.show({ severity: 'error', summary: 'Cancelado', detail: 'Salida cancelado', life: 3000 });
    };

    const confirmarCreacion = () => {
        confirmDialog({
            message: '¿Está seguro de hacer esta Salida?',
            header: 'Confirmar Salida',
            icon: 'pi pi-exclamation-triangle',
            accept: CrearSalida,
            reject
        });
    };
    const footer = (
        <div>
            <Button label="Guardar" onClick={confirmarCreacion} className="p-button-success" />
            <Button label="Cancelar" onClick={cerrarModal} className="p-button-secondary" />
        </div>
    );
    // Estado para manejar los valores del dropdown
    const [activeIndex, setActiveIndex] = useState(0);
    const items = [
        { label: 'Registrar Salida Stock', icon: 'pi pi-home' },
        { label: 'Registrar Salida Ruta', icon: 'pi pi-chart-line' }
    ];

    return (
        <>
            {/* Confirmacion */}
            <Toast ref={toast} />
            <ConfirmDialog />
            {/* Contenido */}
            <Button icon="pi pi-plus" label="Registrar Salida" severity="info" outlined style={{ color: '#4a7de9' }} onClick={abrirModal} />

            <Dialog
                header={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '50px' }}>
                    <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
                    <Button icon="pi pi-times" rounded text severity="danger" aria-label="Cancel" onClick={cerrarModal} />
                </div>}
                visible={modal}
                style={{ width: '40%', minWidth: '300px' }}
                footer={footer}
                onHide={cerrarModal}
                closable={false}
            >
                <form onSubmit={CrearSalida}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ marginTop: "20px", width: "100%", display: 'flex', flexDirection: 'column', gap: '25px' }}>
                            <div className="SegundoDiv" style={{ display: 'flex', gap: '10px' }}>
                                <GetUnidad pasarSetSalidas={handleUnidadChange} style={{ width: '100%' }} />
                                <GetPersonal pasarSetSalidas={handlePersonalChange} style={{ width: '100%' }} />
                                <GetDestinoCombustible pasarSetSalidas={handleDestinoChange} style={{ width: '100%' }} />
                            </div>
                            {activeIndex === 1 && (
                                <div className="Comprovante" style={{ display: 'flex', gap: '10px' }}>
                                    <div className="tipo_comprobante" style={{ width: '100%' }}>
                                        <FloatLabel>
                                            <InputText id="tipo_comprobante" name="tipo_comprobante" style={{ width: '100%' }} value={dataSalida.tipo_comprobante} onChange={handleInputChange} />
                                            <label htmlFor="tipo_comprobante" style={{ textAlign: "center", }}>Tipo Comprobante</label>
                                        </FloatLabel>
                                    </div>
                                    <div className="numero_comprobante" style={{ width: '100%' }}>
                                        <FloatLabel>
                                            <InputText id="numero_comprobante" name="numero_comprobante" style={{ width: '100%' }} value={dataSalida.numero_comprobante} onChange={handleInputChange} />
                                            <label htmlFor="numero_comprobante" style={{ textAlign: "center", }}>Número de Comprobante</label>
                                        </FloatLabel>
                                    </div>
                                </div>
                            )}
                            <div className="stock" style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>

                                <div className="ingreso" style={{ width: '100%' }} >

                                    {activeIndex === 0 && (
                                        <div className="validacion" style={{ display: 'flex', gap: '10px' }}>
                                            <div className="numero_salida" style={{ width: '100%' }}>
                                                <FloatLabel>
                                                    <InputNumber id="numero_salida_combustible" name="numero_salida_combustible" style={{ width: '100%' }} value={dataSalida.numero_salida_combustible || null} onChange={(e) => setDataSalida({ ...dataSalida, numero_salida_combustible: e.value })} minFractionDigits={2} min={0} />
                                                    <label htmlFor="numero_salida_combustible" style={{ textAlign: "center", }}>Numero de Salida</label>
                                                </FloatLabel>
                                            </div>
                                            <div className="contometro_surtidor" style={{ width: '100%' }}>
                                                <FloatLabel>
                                                    <InputText id="contometro_surtidor" name="contometro_surtidor" style={{ width: '100%' }} value={dataSalida.contometro_surtidor} onChange={handleInputChange} />
                                                    <label htmlFor="contometro_surtidor" style={{ textAlign: "center", }}>Contometro del Surtidor</label>
                                                </FloatLabel>
                                            </div>


                                        </div>
                                    )}
                                    {activeIndex === 1 && (
                                        <>
                                            <div className="precios" style={{ display: 'flex', gap: '10px' }}>

                                                <div className="soles" style={{ width: '100%' }}>
                                                    <FloatLabel>
                                                        <InputNumber id="numero_salida_ruta" name="numero_salida_ruta" style={{ width: '100%' }} value={dataSalida.numero_salida_ruta || null} onChange={(e) => setDataSalida({ ...dataSalida, numero_salida_ruta: e.value })} minFractionDigits={2} min={0} />
                                                        <label htmlFor="numero_salida_ruta" style={{ textAlign: "center", }}>Numero de Salida en Ruta</label>
                                                    </FloatLabel>
                                                </div>
                                                <div className="soles" style={{ width: '100%' }}>
                                                    <FloatLabel>
                                                        <InputNumber
                                                            id="precio_unitario_soles"
                                                            name="precio_unitario_soles"
                                                            style={{ width: '100%' }}
                                                            value={dataSalida.precio_unitario_soles || 0}
                                                            onChange={(e) => setDataSalida({ ...dataSalida, precio_unitario_soles: e.value })}
                                                            showButtons
                                                            buttonLayout="horizontal"
                                                            step={0.25}
                                                            mode="currency"
                                                            currency="PEN"
                                                            currencyDisplay="symbol"
                                                            locale="es-PE"
                                                        />

                                                        <label htmlFor="precio_unitario_soles" style={{ textAlign: "center", }}>Precio Unitario Soles</label>
                                                    </FloatLabel>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                {activeIndex === 0 && (
                                    <GetStock pasarProductoSeleccionado={dataSalida.SKU} />
                                )}
                            </div>

                            <div className="divTres" style={{ display: 'flex', gap: '10px' }}>
                                <div className="precinto_nuevo" style={{ width: '100%' }}>
                                    <FloatLabel>
                                        <InputText id="precinto_nuevo" name="precinto_nuevo" style={{ width: '100%' }} value={dataSalida.precinto_nuevo} onChange={handleInputChange} />
                                        <label htmlFor="precinto_nuevo" style={{ textAlign: "center", }}>Precinto Nuevo</label>
                                    </FloatLabel>
                                </div>
                                <div className="precinto_anterior" style={{ width: '100%' }}>
                                    <FloatLabel>
                                        <InputText id="precinto_anterior" name="precinto_anterior" style={{ width: '100%' }} value={dataSalida.precinto_anterior} onChange={handleInputChange} />
                                        <label htmlFor="precinto_anterior" style={{ textAlign: "center", }}>Precinto Anterior</label>
                                    </FloatLabel>
                                </div>
                                <div className="kilometraje" style={{ width: '100%' }}>
                                    <FloatLabel>
                                        <InputText id="kilometraje" name="kilometraje" style={{ width: '100%' }} value={dataSalida.kilometraje} onChange={handleInputChange} />
                                        <label htmlFor="kilometraje" style={{ textAlign: "center", }}>Kilometraje</label>
                                    </FloatLabel>
                                </div>
                                <div className="horometro" style={{ width: '100%' }}>
                                    <FloatLabel>
                                        <InputText id="horometro" name="horometro" style={{ width: '100%' }} value={dataSalida.horometro} onChange={handleInputChange} />
                                        <label htmlFor="horometro" style={{ textAlign: "center", }}>Horómetro</label>
                                    </FloatLabel>
                                </div>
                               
                            </div>
                            <FloatLabel>
                                <InputTextarea id="observaciones" name="observaciones" style={{ width: '100%' }} value={dataSalida.observaciones} onChange={handleInputChange} />
                                <label htmlFor="observaciones" style={{ textAlign: "center", }}>Observaciones</label>
                            </FloatLabel>
                        </div>
                    </div>
                </form>
            </Dialog>
        </>
    );
};

export default ModalCrearSalidaCombustible;