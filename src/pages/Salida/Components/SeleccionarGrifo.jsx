import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
import UsarGetGrifo from "../hooks/UsarGetGrifo";
import ModalCrearSalida from "../Mod/ModalCrearSalida";
import { ModalCrearGrifo } from "../Mod/ModalCrearGrifo";

export const SeleccionarGrifo = ({ pasarMovimientoSeleccionado, pasarSetDataSalida }) => {
    // Hooks
    const { data, setData } = UsarGetGrifo();
    // Estado para la selección del Dropdown
    const [grifoSeleccionado, setGrifoSeleccionado] = useState(null);
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
    const ManejoDeGrifo = (e) => {
        const seleccion = e.value;
        setGrifoSeleccionado(seleccion);
        pasarSetDataSalida(seleccion)
    }
    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                <div style={{ display: 'flex', gap: '5px' }}>
                    <Dropdown
                        id="grifo_id"
                        value={grifoSeleccionado}
                        onChange={ManejoDeGrifo}
                        options={data}
                        optionLabel="nombre"
                        showClear
                        placeholder="Seleccione un Grifo"
                        filter
                        filterBy="nombre"
                        style={{ width: "100%" }}
                    />
                    <ModalCrearGrifo setDataGrifo={setData}/>
                </div>
            </div>
        </>

    );
}
