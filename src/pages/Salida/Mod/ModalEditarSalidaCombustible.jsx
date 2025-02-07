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

const ModalEditarSalidaCombustible = ({ pasarSetSalidas, pasarAbrirModal, pasarCerrarModal, pasarSalidaSeleccionadoCombustible }) => {
    //const token
    const { obtenerToken } = useContext(AuthContext)
    //plasmar los datos de la salida seleccionada
    useEffect(() => {
        if(pasarSalidaSeleccionadoCombustible){
            setDataSalida({
                SKU: pasarSalidaSeleccionadoCombustible.SKU,
                flota_id: pasarSalidaSeleccionadoCombustible.flota_id,
                personal_id: pasarSalidaSeleccionadoCombustible.personal_id,
                destino_combustible_id: pasarSalidaSeleccionadoCombustible.destino_combustible_id,  
                numero_salida_combustible: pasarSalidaSeleccionadoCombustible.numero_salida_stock,
                horometro: pasarSalidaSeleccionadoCombustible.horometro,
                kilometraje: pasarSalidaSeleccionadoCombustible.kilometraje,
                precinto_anterior: pasarSalidaSeleccionadoCombustible.precinto_anterior,
                precinto_nuevo: pasarSalidaSeleccionadoCombustible.precinto_nuevo,
                contometro_surtidor: pasarSalidaSeleccionadoCombustible.contometro_surtidor,
                observacion: pasarSalidaSeleccionadoCombustible.observacion,
            })
        }
    }, [pasarSalidaSeleccionadoCombustible])

    //#region estado para traer la data de salida
    const [dataSalida, setDataSalida] = useState(DataSalidaCombustible)
    //funcion para crear salida
    const CrearSalida = async () => {
        try {
            const token = obtenerToken()
            if (token) {
                console.log("Data Salida", dataSalida)
                const respuestaPost = await axios.post('https://jwmalmcenb-production.up.railway.app/api/almacen/salida_combustible/create', dataSalida, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const respuestaGet = await axios.get("https://jwmalmcenb-production.up.railway.app/api/almacen/salida_combustible/get", {
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
            <Button label="Cancelar" onClick={pasarCerrarModal} className="p-button-secondary" />
        </div>
    );
    return (
        <>
            {/* Confirmacion */}
            <Toast ref={toast} />

            <Dialog
                header={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '50px' }}>
                    <h3>Registrar Salida</h3>
                    <Button icon="pi pi-times" rounded text severity="danger" aria-label="Cancel" onClick={pasarCerrarModal} />
                </div>}
                visible={pasarAbrirModal}
                style={{ width: '40%', minWidth: '300px' }}
                footer={footer}
                onHide={pasarCerrarModal}
                closable={false}
            >
                <form onSubmit={CrearSalida}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ marginTop: "20px", width: "100%", display: 'flex', flexDirection: 'column', gap: '25px' }}>
                            <div className="SegundoDiv" style={{ display: 'flex', gap: '10px' }}>
                                <GetUnidad pasarSetSalidas={handleUnidadChange} pasarSalidaSeleccionadoCombustible={pasarSalidaSeleccionadoCombustible} style={{ width: '100%' }} />
                                <GetPersonal pasarSetSalidas={handlePersonalChange} pasarSalidaSeleccionadoCombustible={pasarSalidaSeleccionadoCombustible} style={{ width: '100%' }} />
                                <GetDestinoCombustible pasarSetSalidas={handleDestinoChange} pasarSalidaSeleccionadoCombustible={pasarSalidaSeleccionadoCombustible} style={{ width: '100%' }} />
                            </div>
                            <div className="stock" style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
                                <div className="ingreso" style={{ width: '100%' }} >
                                    <FloatLabel>
                                        <InputNumber id="numero_salida_combustible" name="numero_salida_combustible" style={{ width: '100%' }} value={dataSalida.numero_salida_combustible || null} onChange={(e) => setDataSalida({ ...dataSalida, numero_salida_combustible: e.value })} minFractionDigits={2} min={0} />
                                        <label htmlFor="numero_salida_combustible" style={{ textAlign: "center", }}>Numero de Salida</label>
                                    </FloatLabel>
                                </div>
                                <GetStock pasarProductoSeleccionado={dataSalida.SKU} />
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
                                <div className="contometro_surtidor" style={{ width: '100%' }}>
                                    <FloatLabel>
                                        <InputText id="contometro_surtidor" name="contometro_surtidor" style={{ width: '100%' }} value={dataSalida.contometro_surtidor} onChange={handleInputChange} />
                                        <label htmlFor="contometro_surtidor" style={{ textAlign: "center", }}>Contometro del Surtidor</label>
                                    </FloatLabel>
                                </div>
                            </div>
                            <FloatLabel>
                                <InputTextarea id="observaciones" name="observaciones" style={{ width: '100%' }} value={dataSalida.observacion} onChange={handleInputChange} />
                                <label htmlFor="observaciones" style={{ textAlign: "center", }}>Observaciones</label>
                            </FloatLabel>
                        </div>
                    </div>
                </form>
            </Dialog>
        </>
    );
};

export default ModalEditarSalidaCombustible;