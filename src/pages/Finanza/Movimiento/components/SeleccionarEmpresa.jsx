import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";
import UsarGetEmpresa from "../hooks/UsarGetEmpresa";

export const SeleccionarEmpresa = ({ pasarMovimientoSeleccionado,pasarSetEmpresa }) => {
    // Hook personalizado para obtener estados
    const { data } = UsarGetEmpresa();
    // Estado para la selección del Dropdown
    const [empresaSeleccionado, setEmpresaSeleccionado] = useState(null);
    //si pasarMovimientoSeleccionado es true, se setea el estado
    useEffect(() => {
        if (pasarMovimientoSeleccionado && data) {
            const empresaEncontrado = data.find(empresa => empresa.id === pasarMovimientoSeleccionado.empresa_id);
            setEmpresaSeleccionado(empresaEncontrado || null);
        }
    }, [pasarMovimientoSeleccionado, data]);
    const ManejoDeEmpresa=(e)=>{
        const seleccion=e.value;
        setEmpresaSeleccionado(seleccion);
        pasarSetEmpresa(seleccion);
    }
    return (
        <>
            <div  style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label htmlFor="ssn" style={{color:'#344054'}}>Empresa</label>
                <Dropdown
                    id="estado_id"
                    value={empresaSeleccionado}
                    onChange={ManejoDeEmpresa}
                    options={data}
                    optionLabel="nombre_empresa"
                    showClear
                    filter
                    filterBy="nombre_empresa"
                    placeholder="Seleccione una empresa"
                    style={{ width: "100%" }}
                />
            </div>
        </>

    );
}
