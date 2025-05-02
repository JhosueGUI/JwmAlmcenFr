import { useState } from "react";
import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from "primereact/dropdown";
import UseGetDocument from "../Hooks/UseGetDocument";

export const SelectionDocument = ({ pasarDataPersonal }) => {
    // Hook personalizado para obtener estados
    const { documento} = UseGetDocument()
    // Estado para la selección del Dropdown
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    // useEffect(() => {
    //     if (pasarMovimientoSeleccionado && data) {
    //         const modoEncontrado = data.find(modo => modo.id === pasarMovimientoSeleccionado.modo_id);
    //         setModoSeleccionado(modoEncontrado || null);
    //     }
    // }, [pasarMovimientoSeleccionado, data]);
    const ManejoDeProducto = (e) => {
        const seleccion = e.value
        setProductoSeleccionado(seleccion)
        pasarSetDataIngreso(seleccion)
    }
    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: '100%' }}>
                <FloatLabel>
                    <Dropdown
                        id="producto_id"
                        value={productoSeleccionado}
                        onChange={ManejoDeProducto}
                        options={documento}
                        optionLabel={(option) => `${option.SKU} ${option.articulo?.nombre}`}
                        showClear
                        placeholder="Seleccione un Producto"
                        style={{ width: "100%" }}
                        filter
                        filterBy="SKU,articulo.nombre"
                    />
                    <label htmlFor="ssn">Producto</label>

                </FloatLabel>
            </div>
        </>

    );
}
