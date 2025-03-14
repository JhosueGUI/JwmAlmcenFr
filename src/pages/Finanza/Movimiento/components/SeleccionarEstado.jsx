import { FloatLabel } from "primereact/floatlabel";
import UsarGetEstado from "../hooks/UsarGetEstado";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";

export const SeleccionarEstado = ({ pasarMovimientoSeleccionado, pasarSetEstado }) => {
    // Hook personalizado para obtener estados
    const { data } = UsarGetEstado();
    
    const [estadoSeleccionado, setEstadoSeleccionado] = useState(null);
    
    useEffect(() => {
        if (pasarMovimientoSeleccionado && data) {
            const estadoEncontrado = data.find(estado => estado.estado_id === pasarMovimientoSeleccionado.estado_id);
            setEstadoSeleccionado(estadoEncontrado || null);
        }
    }, [pasarMovimientoSeleccionado, data]);

    const ManejoDeEstado = (e) => {
        const seleccion = e.value
        setEstadoSeleccionado(seleccion);
        pasarSetEstado(seleccion.estado_id);
    }
    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label htmlFor="ssn" style={{ color: '#344054' }}>Estado Comprobante</label>
                <Dropdown
                    id="estado_id"
                    value={estadoSeleccionado}
                    onChange={ManejoDeEstado}
                    options={data}
                    optionLabel="estado_nombre"
                    showClear
                    placeholder="Seleccione un estado"
                    style={{ width: "100%" }}
                />
            </div>
        </>

    );
}
