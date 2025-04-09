import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";
import UseGetUnidad from "../Hooks/UseGetUnidad";

export const SelectUnidad = ({pasarSetUnidad}) => {
    // Hook personalizado para obtener estados
    const { unidad,setUnidad } = UseGetUnidad();
    // Estado para la selección del Dropdown
    const [unidadSelected, setunidadSelected] = useState(null);

    const ManejoDeUnidad=(e)=>{
        const seleccion=e.value;
        setunidadSelected(seleccion);
        pasarSetUnidad(seleccion.placa);
    }
    return (
        <>
            <div  style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label htmlFor="ssn" style={{color:'#344054'}}>Placa</label>
                <Dropdown
                    id="flota_id"
                    value={unidadSelected}
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
