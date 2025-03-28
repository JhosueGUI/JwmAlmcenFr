import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Calendar } from 'primereact/calendar';
import axios from "axios";

export const ExportarCombustible = () => {
    const [modal, setModal] = useState(false);
    const [fecha, setFecha] = useState(null);

    const abrirModal = () => {
        setModal(true);
    };

    const cerrarModal = () => {
        setModal(false);
    };

    // Función para formatear la fecha en 'yyyy-mm-dd'
    const formatearFecha = (fecha) => {
        const year = fecha.getFullYear().toString().slice(-2); // Obtener los últimos dos dígitos del año
        const month = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Asegurar dos dígitos en el mes
        const day = fecha.getDate().toString().padStart(2, '0'); // Asegurar dos dígitos en el día
        return `${day}-${month}-${year}`; // Retornar en formato "dd-mm-yy"
    };
    

    // Función para exportar
    const ExportarConsumo = async () => {
        try {
            if (fecha && fecha.length === 2) {
                const data = {
                    fecha_inicio: formatearFecha(fecha[0]),
                    fecha_fin: formatearFecha(fecha[1]),
                }
                console.log(data);
                const respuesta = await axios.get('https://jwmalmcenb-production.up.railway.app/api/reporte/consumo/placa', {
                    params: data,
                    responseType: 'blob'  // Esto indica que la respuesta será un archivo binario
                });
    
                // Crear un enlace temporal para descargar el archivo
                const url = window.URL.createObjectURL(new Blob([respuesta.data]));
                const a = document.createElement('a');
                a.href = url;
                a.download = 'Consumo_Reporte.xlsx'; // Nombre del archivo
                document.body.appendChild(a);
                a.click(); // Simular clic en el enlace para iniciar la descarga
                document.body.removeChild(a); // Eliminar el enlace después de la descarga
                cerrarModal()
            }
        } catch (error) {
            console.log("Error", error);
        }
    };
    
    const footer = (
        <div>
            <Button label="Exportar Archivo" onClick={ExportarConsumo} className="p-button-Primary" />
            <Button label="Cancelar" onClick={cerrarModal} className="p-button-secondary" />
        </div>
    );

    return (
        <>
            <Button
                type="button"
                icon="pi pi-download"
                className="p-button-secondary"
                severity="info"
                onClick={abrirModal}
            />
            <Dialog
                header={
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "50px" }}>
                        <h3>Exportar Consumo</h3>
                        <Button
                            icon="pi pi-times"
                            rounded
                            text
                            severity="danger"
                            aria-label="Cancel"
                            onClick={cerrarModal}
                        />
                    </div>
                }
                visible={modal}
                style={{ width: "20%", minWidth: "300px" }}
                footer={footer}
                onHide={cerrarModal}
                closable={false}
            >
                <div className="cargar" style={{ display: 'flex', gap: "10px", flexDirection: 'column' }}>
                    <label htmlFor="rango" >Rango de Fecha</label>
                    <Calendar
                        value={fecha}
                        onChange={(e) => setFecha(e.value)}
                        selectionMode="range"
                        readOnlyInput
                        hideOnRangeSelection
                        style={{ width: '100%' }}
                    />
                </div>
            </Dialog>
        </>
    );
};
