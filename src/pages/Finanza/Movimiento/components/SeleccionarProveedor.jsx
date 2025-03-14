import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";
import { ModalCrearPersona } from "../mod/ModalCrearPersona";
import UsarGetProveedor from "../hooks/UsarGetProveedor";
import { ModalCrearProveedor } from "../mod/ModalCrearProveedor";
import { setDate } from "date-fns";

export const SeleccionarProveedor = ({ pasarMovimientoSeleccionado, pasarSetProveedor }) => {
    // Hook
    const { data, setData } = UsarGetProveedor();
    // Estado para la selección del Dropdown

    const [proveedorSeleccionado, SetProveedorSeleccionado] = useState(null);

    // useEffect(() => {
    //     if (pasarMovimientoSeleccionado && data) {
    //         const monedaEncontrado = data.find(moneda => moneda.id === pasarMovimientoSeleccionado.moneda_id);
    //         setMonedaSeleccionado(monedaEncontrado || null);
    //     }
    // }, [pasarMovimientoSeleccionado, data]);

    // const ManejoDeMoneda = (e) => {
    //     const seleccion = e.value;
    //     setMonedaSeleccionado(seleccion);
    //     pasarSetMoneda(seleccion);
    // }
    const ManejoDeProveedor = (e) => {
        const seleccion = e.value;
        SetProveedorSeleccionado(seleccion);
        pasarSetProveedor(seleccion);
    }
    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label htmlFor="ssn" style={{ color: '#344054' }}>Proveedor</label>
                <div style={{ display: 'flex', gap: '5px' }}>
                    <Dropdown
                        id="proveedor_id"
                        value={proveedorSeleccionado}
                        onChange={ManejoDeProveedor}
                        options={data}
                        optionLabel="razon_social"
                        showClear
                        filter
                        filterBy="razon_social"
                        placeholder="Seleccione un Proveedor"
                        style={{ width: "100%" }}
                    />
                    <ModalCrearProveedor setDataProveedor={setData} />
                </div>
            </div>
        </>

    );
}
