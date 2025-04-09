import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";
import UseGetPersonal from "../Hooks/UseGetPersonal";

export const SelectPersonal = ({pasarSetPersonal}) => {
    //hooks
    const {personal,setPersonal}=UseGetPersonal()
    const [selectPersonal,setSelectPersonal]=useState(null)
 
    const ManejoDePersonal = (e) => {
        const seleccion = e.value;
        setSelectPersonal(seleccion);
        pasarSetPersonal(seleccion.id);
    }
    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <Dropdown
                    id="personal_id"
                    value={selectPersonal}
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
