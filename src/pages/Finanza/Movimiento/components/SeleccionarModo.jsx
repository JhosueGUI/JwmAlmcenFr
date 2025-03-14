import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";
import UsarGetModo from "../hooks/UsarGetModo";

export const SeleccionarModo = ({ pasarMovimientoSeleccionado,pasarSetModo }) => {
    // Hook personalizado para obtener estados
    const { data } = UsarGetModo();
    // Estado para la selección del Dropdown
    const [modoSeleccionado, setModoSeleccionado] = useState(null);
    //si pasarMovimientoSeleccionado es true, se setea el estado
    useEffect(() => {
        if (pasarMovimientoSeleccionado && data) {
            const modoEncontrado = data.find(modo => modo.id === pasarMovimientoSeleccionado.modo_id);
            setModoSeleccionado(modoEncontrado || null);
        }
    }, [pasarMovimientoSeleccionado, data]);
    const ManejoDeModo=(e)=>{
        const seleccion=e.value;
        setModoSeleccionado(seleccion);
        pasarSetModo(seleccion);
    }
    return (
        <>
            <div  style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label htmlFor="ssn" style={{color:'#344054'}}>Modo</label>
                <Dropdown
                    id="modo_id"
                    value={modoSeleccionado}
                    onChange={ManejoDeModo}
                    options={data}
                    optionLabel="nombre_modo"
                    showClear
                    placeholder="Seleccione un Modo"
                    style={{ width: "100%" }}
                />
            </div>
        </>

    );
}
