import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
import UseGetProvider from "../Hooks/UseGetProvider";
import { FloatLabel } from "primereact/floatlabel";

export const SelectedProvider = ({ pasarMovimientoSeleccionado, pasarSetDataIngreso}) => {
    // Hooks
    const { data } = UseGetProvider()
    // Estado para la selección del Dropdown
    const [providerSelect, setProviderSelected] = useState(null);
    //si pasarMovimientoSeleccionado es true, se setea el estado
    // useEffect(() => {
    //     if (pasarMovimientoSeleccionado && data) {
    //         const monedaEncontrado = data.find(moneda => moneda.id === pasarMovimientoSeleccionado.moneda_id);
    //         setMonedaSeleccionado(monedaEncontrado || null);
    //     }
    // }, [pasarMovimientoSeleccionado, data]);

    // const ManejoDeMoneda = (e) => {
    //     const seleccion = e.value;
    //     setMonedaSeleccionado(seleccion);
    //     pasarSetMoneda(seleccion);
    // }
    const ManejoDeProvider = (e) => {
        const seleccion = e.value;
        setProviderSelected(seleccion);
        pasarSetDataIngreso(seleccion)
    }
    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                <FloatLabel>
                    <Dropdown
                        id="proveedor_id"
                        value={providerSelect}
                        onChange={ManejoDeProvider}
                        options={data}
                        optionLabel="razon_social"
                        showClear
                        placeholder="Seleccione un Proveedor"
                        filter
                        filterBy="razon_social"
                        style={{ width: "100%" }}
                    />
                     <label htmlFor="ssn">Proveedor</label>
                </FloatLabel>
            </div>
        </>

    );
}
