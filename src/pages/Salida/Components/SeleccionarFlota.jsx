import { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import UseGetFlota from "../hooks/UseGetFlota";

export const SeleccionarFlota = ({ pasarMovimientoSeleccionado, pasarSetDataExport }) => {
    // Hook personalizado para obtener estados
    const { flota } = UseGetFlota();
    // Estado para la selección del Dropdown
    const [flotaSelected, setFlotaSelected] = useState(null);
    // useEffect(() => {
    //     if (pasarMovimientoSeleccionado && data) {
    //         const modoEncontrado = data.find(modo => modo.id === pasarMovimientoSeleccionado.modo_id);
    //         setModoSeleccionado(modoEncontrado || null);
    //     }
    // }, [pasarMovimientoSeleccionado, data]);
    const ManejoDeFlota=(e)=>{
        const seleccion=e.value
        setFlotaSelected(seleccion)
        pasarSetDataExport(seleccion)
    }
    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px", width:'100%' }}>
                <label htmlFor="ssn" style={{ color: '#344054' }}>Flota</label>
                <Dropdown
                    id="flota_id"
                    value={flotaSelected}
                    onChange={ManejoDeFlota}
                    options={flota}
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
