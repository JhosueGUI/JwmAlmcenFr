import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { DataSalidaCombustible } from "../Data/SalidaData";
import UsarEditarSalidaCombustible from "../hooks/UsarEditarSalidaCombustible";
import { getSalidaCombustible } from "../Services/SalidaCombustibleApi";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

const ModalEditarSalidaCombustible = ({ pasarAbrirModal, pasarCerrarModal, pasarSalidaSeleccionadoCombustible, pasarSetSalidas }) => {
    //hooks
    const { EditarSalida } = UsarEditarSalidaCombustible();
    const { obtenerToken } = useContext(AuthContext)

    const [dataSalidaCombustible, setDataSalidaCombustible] = useState(DataSalidaCombustible);

    useEffect(() => {
        if (pasarSalidaSeleccionadoCombustible?.fecha) {
            // Convertir a fecha en la zona horaria de Perú
            const fechaISO = new Date(pasarSalidaSeleccionadoCombustible.fecha);
            const fechaAjustada = new Date(fechaISO.getTime() + fechaISO.getTimezoneOffset() * 60000); // Ajustar desfase UTC
            setDataSalidaCombustible((prev) => ({
                ...prev,
                fecha: fechaAjustada
            }));
        }
    }, [pasarSalidaSeleccionadoCombustible]);



    const Editar = async () => {
        const token = obtenerToken();
    
        // Convertir la fecha al formato YYYY-MM-DD
        const fechaFormateada = dataSalidaCombustible.fecha
            ? `${dataSalidaCombustible.fecha.getFullYear()}-${(dataSalidaCombustible.fecha.getMonth() + 1).toString().padStart(2, "0")}-${dataSalidaCombustible.fecha.getDate().toString().padStart(2, "0")}`
            : null;
    
        const nuevaDataSalida = {
            ...dataSalidaCombustible,
            fecha: fechaFormateada
        };

        const respuesta = await EditarSalida(nuevaDataSalida, pasarSalidaSeleccionadoCombustible.id);
    
        const respuestaGet = await getSalidaCombustible(token);
        const SalidaCombustibleAdaptado = respuestaGet.map(item => ({
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
        }));
    
        pasarSetSalidas(SalidaCombustibleAdaptado);
        pasarCerrarModal();
    };
    


    const footer = (
        <div>
            <Button label="Guardar" onClick={Editar} className="p-button-success" />
            <Button label="Cancelar" onClick={pasarCerrarModal} className="p-button-secondary" />
        </div>
    );



    return (
        <Dialog
            header={
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "50px" }}>
                    <h3>Editar Salida</h3>
                    <Button icon="pi pi-times" rounded text severity="danger" aria-label="Cancel" onClick={pasarCerrarModal} />
                </div>
            }
            visible={pasarAbrirModal}
            style={{ width: "25%", minWidth: "300px" }}
            footer={footer}
            onHide={pasarCerrarModal}
            closable={false}
        >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ marginTop: "20px", width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <label htmlFor="fecha" style={{ color: "#344054" }}>Fecha</label>
                    <Calendar
                        id="fecha"
                        value={dataSalidaCombustible.fecha}
                        onChange={(e) => setDataSalidaCombustible((prev) => ({ ...prev, fecha: e.value }))}
                        dateFormat="dd/mm/yy"
                        showIcon
                    />
                </div>
            </div>
        </Dialog>
    );
};

export default ModalEditarSalidaCombustible;
