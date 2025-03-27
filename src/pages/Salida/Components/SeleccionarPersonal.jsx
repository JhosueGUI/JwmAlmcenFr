import { useState } from "react";
import UsarGetPersonal from "../hooks/UsarGetPersonal";
import { Dropdown } from "primereact/dropdown";

export const SeleccionarPersonal = ({ pasarMovimientoSeleccionado, pasarSetDataSalida }) => {
    // Hook personalizado para obtener estados
    const { personal } = UsarGetPersonal();
    // Estado para la selección del Dropdown
    const [personalSeleccionado, setPersonalSeleccionado] = useState(null);
    // useEffect(() => {
    //     if (pasarMovimientoSeleccionado && data) {
    //         const modoEncontrado = data.find(modo => modo.id === pasarMovimientoSeleccionado.modo_id);
    //         setModoSeleccionado(modoEncontrado || null);
    //     }
    // }, [pasarMovimientoSeleccionado, data]);
    const ManejoDePersonal=(e)=>{
        const seleccion=e.value
        setPersonalSeleccionado(seleccion)
        pasarSetDataSalida(seleccion)
    }
    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px", width:'100%' }}>
                <label htmlFor="ssn" style={{ color: '#344054' }}>Personal</label>
                <Dropdown
                    id="personal_id"
                    value={personalSeleccionado}
                    onChange={ManejoDePersonal}
                    options={personal}
                    optionLabel={(option) => `${option.persona.nombre} ${option.persona.apellido_paterno ?? ""} ${option.persona.apellido_materno ?? ""}`}
                    showClear
                    placeholder="Seleccione un Personal"
                    style={{ width: "100%" }}
                    filter
                    filterBy="persona.nombre,persona.apellido_paterno"
                />
            </div>
        </>

    );
}
