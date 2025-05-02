import { useEffect, useState } from "react"
import { Dropdown } from "primereact/dropdown"
import UsarGetCargo from "../Hooks/UsarGetCargo"

export const SeleccionarCargo = ({ pasarDataPersonal, pasarPersonalSeleccionado }) => {
    //hooks
    console.log(pasarPersonalSeleccionado)
    const { data } = UsarGetCargo()
    const [cargoSeleccionado, setCargoSeleccionado] = useState(null)
    useEffect(() => {
        if (pasarPersonalSeleccionado && data) {
            const cargoEncontrado = data.find(cargo => cargo.id === pasarPersonalSeleccionado.cargo_id);
            console.log(cargoEncontrado)
            setCargoSeleccionado(cargoEncontrado || null);
        }
    }, [pasarPersonalSeleccionado,data ])
    
    const ManejoCargo = (e) => {
        const seleccion = e.value
        setCargoSeleccionado(seleccion)
        pasarDataPersonal(seleccion)
    }
    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                <Dropdown
                    id="cargo_id"
                    value={cargoSeleccionado}
                    onChange={ManejoCargo}
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