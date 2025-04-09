import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";

export const SelectTipoFalla = ({pasarSetTipoFalla}) => {
    const TipoFalla = [
        { id: 1, nombre: "Motor" },
        { id: 2, nombre: "Transmisión" },
        { id: 3, nombre: "Sistema de Frenos" },
        { id: 4, nombre: "Dirección y suspensión" },
        { id: 5, nombre: "Neumáticos" },
        { id: 6, nombre: "Sistema eléctrico" },
        { id: 7, nombre: "Carrocería y chasis" },
        { id: 8, nombre: "Otros" },
    ];
    // Estado para la selección del Dropdown
    const [tipoFallaSelect, setTipoFallaSelect] = useState(null);

    const ManejoDeUnidad = (e) => {
        const seleccion = e.value;
        setTipoFallaSelect(seleccion);
        pasarSetTipoFalla(seleccion.nombre);
    }
    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label htmlFor="ssn" style={{ color: '#344054' }}>Falla</label>
                <Dropdown
                    id="tipo_falla_id"
                    value={tipoFallaSelect}
                    onChange={ManejoDeUnidad}
                    options={TipoFalla}
                    optionLabel="nombre"
                    showClear
                    placeholder="Seleccione un Tipo de Falla"
                    style={{ width: "100%" }}
                    filter
                    filterBy="nombre"
                />
            </div>
        </>

    );
}
