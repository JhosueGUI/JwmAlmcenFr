import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";
import UsarGetMoneda from "../hooks/UsarGetMoneda";

export const SeleccionarMoneda = ({ pasarMovimientoSeleccionado, pasarSetMoneda }) => {
    // Hook personalizado para obtener estados
    const { data } = UsarGetMoneda();
    // Estado para la selección del Dropdown
    const [monedaSeleccionado, setMonedaSeleccionado] = useState(null);
    //si pasarMovimientoSeleccionado es true, se setea el estado
    useEffect(() => {
        if (pasarMovimientoSeleccionado && data) {
            const monedaEncontrado = data.find(moneda => moneda.id === pasarMovimientoSeleccionado.moneda_id);
            setMonedaSeleccionado(monedaEncontrado || null);
        }
    }, [pasarMovimientoSeleccionado, data]);
    
    const ManejoDeMoneda = (e) => {
        const seleccion = e.value;
        setMonedaSeleccionado(seleccion);
        pasarSetMoneda(seleccion);
    }
    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label htmlFor="ssn" style={{ color: '#344054' }}>Moneda</label>
                <Dropdown
                    id="moneda_id"
                    value={monedaSeleccionado}
                    onChange={ManejoDeMoneda}
                    options={data}
                    optionLabel="nombre_moneda"
                    showClear
                    placeholder="Seleccione una Moneda"
                    style={{ width: "100%" }}
                />
            </div>
        </>

    );
}
