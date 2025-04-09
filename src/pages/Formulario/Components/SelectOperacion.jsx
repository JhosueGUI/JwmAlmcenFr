import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";

export const SelectOperacion = ({pasarSetOperacion}) => {
    const Operacion = [
        { id: 1, nombre: "Sí, el vehículo no puede moverse" },
        { id: 2, nombre: "No, pero debe revisarse urgentemente" },
        { id: 3, nombre: "No, pero se debe programar mantenimiento" },
    ];
    // Estado para la selección del Dropdown
    const [tipoOperacion, setTipoOperacion] = useState(null);
 
    const ManejoDeOperacion = (e) => {
        const seleccion = e.value;
        setTipoOperacion(seleccion);
        pasarSetOperacion(seleccion.nombre);
    }
    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label htmlFor="ssn" style={{ color: '#344054' }}>La falla impide la operación del vehículo</label>
                <Dropdown
                    id="tipo_operacion_id"
                    value={tipoOperacion}
                    onChange={ManejoDeOperacion}
                    options={Operacion}
                    optionLabel="nombre"
                    showClear
                    placeholder="Seleccione un Tipo de Operación"
                    style={{ width: "100%" }}
                />
            </div>
        </>

    );
}
