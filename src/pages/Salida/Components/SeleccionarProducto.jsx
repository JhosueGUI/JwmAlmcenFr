import { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import UsarGetProducto from "../hooks/UsarGetProducto";
import { FloatLabel } from "primereact/floatlabel";

export const SeleccionarProducto = ({ pasarMovimientoSeleccionado, pasarSetDataSalida }) => {
    // Hook personalizado para obtener estados
    const { producto } = UsarGetProducto()
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
        pasarSetDataSalida(seleccion)
    }
    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: '100%' }}>
                <FloatLabel>
                    <Dropdown
                        id="producto_id"
                        value={productoSeleccionado}
                        onChange={ManejoDeProducto}
                        options={producto}
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
