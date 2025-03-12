import { useState } from "react"
import UsarGetPlanilla from "../Hooks/UsarGetPlanilla"
import { Dropdown } from "primereact/dropdown"

export const SeleccionarPlanilla = ({pasarSetPersonal}) => {
    //hooks
    const { data } = UsarGetPlanilla()
    const [planillaSeleccionado, setPlanillaSeleccionado] = useState(null)
    const ManejoDeCliente=(e)=>{
        const seleccion=e.value
        setPlanillaSeleccionado(seleccion)
        pasarSetPersonal(seleccion)
    }
    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px",width:"100%" }}>
                <Dropdown
                    id="planilla_id"
                    value={planillaSeleccionado}
                    onChange={ManejoDeCliente}
                    options={data}
                    optionLabel="nombre_planilla"
                    showClear
                    filter
                    filterBy="nombre_planilla"
                    placeholder="Seleccione una Planilla"
                    style={{ width: "100%" }}
                />
            </div>
        </>
    )
}