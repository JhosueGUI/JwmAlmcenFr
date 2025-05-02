import { useEffect, useState } from "react"
import UsarGetPlanilla from "../Hooks/UsarGetPlanilla"
import { Dropdown } from "primereact/dropdown"
import { use } from "react"

export const SeleccionarPlanilla = ({pasarSetPersonal,pasarPersonalSeleccionado}) => {
    //hooks
    const { data } = UsarGetPlanilla()
    const [planillaSeleccionado, setPlanillaSeleccionado] = useState(null)
    useEffect(() => {
        if (pasarPersonalSeleccionado && data) {
            const planillaEncontrada = data.find(planilla => planilla.id === pasarPersonalSeleccionado.planilla_id);
            setPlanillaSeleccionado(planillaEncontrada || null);
        }
    }, [pasarPersonalSeleccionado,data ])
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