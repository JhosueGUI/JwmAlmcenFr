import { useState } from "react"
import { Dropdown } from "primereact/dropdown"
import UsarGetCargo from "../Hooks/UsarGetCargo"

export const SeleccionarCargo = () => {
    //hooks
    const { data } = UsarGetCargo()
    const [cargoSeleccionado, setCargoSeleccionado] = useState(null)
    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                <Dropdown
                    id="cargo_id"
                    value={cargoSeleccionado}
                    onChange={(e) => setCargoSeleccionado(e.value)}
                    options={data}
                    optionLabel="nombre_cargo"
                    showClear
                    filter
                    filterBy="nombre_cargo"
                    placeholder="Seleccione un Cargo"
                    style={{ width: "100%" }}
                />
            </div>
        </>
    )
}