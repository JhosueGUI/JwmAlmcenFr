import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";
import UsarGetPersona from "../hooks/UsarGetPersona";
import { ModalCrearCliente } from "../mod/ModalCrearCliente";
import { ModalCrearPersona } from "../mod/ModalCrearPersona";

export const SeleccionarPersona = ({ pasarMovimientoSeleccionado, pasarSetPersona }) => {
    // Hook personalizado para obtener estados
    const { data, setData } = UsarGetPersona();
    // Estado para la selección del Dropdown

    const [personaSeleccionado, setPersonaSeleccionado] = useState(null);

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
    const ManejoDePersona=(e)=>{
        const seleccion=e.value;
        setPersonaSeleccionado(seleccion);
        pasarSetPersona(seleccion);
    }
    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label htmlFor="ssn" style={{ color: '#344054' }}>Persona</label>
                <div style={{ display: 'flex', gap: '5px' }}>
                    <Dropdown
                        id="persona_id"
                        value={personaSeleccionado}
                        onChange={ManejoDePersona}
                        options={data}
                        optionLabel="nombre"
                        showClear
                        filter
                        filterBy="nombre"
                        placeholder="Seleccione una Persona"
                        style={{ width: "100%" }}
                    />
                    <ModalCrearPersona setPersona={setData}/>
                </div>
            </div>
        </>

    );
}
