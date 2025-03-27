import { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import UsarGetUnidad from "../hooks/UsarGetUnidad";

export const SeleccionarUnidad = ({ pasarMovimientoSeleccionado, pasarSetDataSalida }) => {
    // Hook personalizado para obtener estados
    const { unidad } = UsarGetUnidad()
    // Estado para la selección del Dropdown
    const [unidadSeleccionado, setUnidadSeleccionado] = useState(null);
    // useEffect(() => {
    //     if (pasarMovimientoSeleccionado && data) {
    //         const modoEncontrado = data.find(modo => modo.id === pasarMovimientoSeleccionado.modo_id);
    //         setModoSeleccionado(modoEncontrado || null);
    //     }
    // }, [pasarMovimientoSeleccionado, data]);
    const ManejoDeUnidad = (e) => {
        const seleccion = e.value
        setUnidadSeleccionado(seleccion)
        pasarSetDataSalida(seleccion)
    }
    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: '100%' }}>
                <label htmlFor="ssn" style={{ color: '#344054' }}>Unidad</label>
                <Dropdown
                    id="unidad_id"
                    value={unidadSeleccionado}
                    onChange={ManejoDeUnidad}
                    options={unidad}
                    optionLabel="placa"
                    showClear
                    placeholder="Seleccione una Unidad"
                    style={{ width: "100%" }}
                    filter
                    filterBy="placa"
                />
            </div>
        </>

    );
}
