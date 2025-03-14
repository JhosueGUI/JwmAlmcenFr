import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";
import UsarGetCliente from "../hooks/UsarGetCliente";
import { ModalCrearCliente } from "../mod/ModalCrearCliente";

export const SeleccionarCliente = ({ pasarMovimientoSeleccionado, pasarSetCliente }) => {
    // Hook
    const { data, setData } = UsarGetCliente();
    console.log(pasarMovimientoSeleccionado);
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    useEffect(() => {
        if (pasarMovimientoSeleccionado && data) {
            const clienteSeleccionado = data.find(cliente => cliente.id === pasarMovimientoSeleccionado.cliente_id);
            setClienteSeleccionado(clienteSeleccionado || null);
        }
    }, [pasarMovimientoSeleccionado, data]);

    const ManejoDeCliente = (e) => {
        const seleccion = e.value;
        setClienteSeleccionado(seleccion);
        pasarSetCliente(seleccion);
    }
    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label htmlFor="ssn" style={{ color: '#344054' }}>Cliente</label>
                <div style={{ display: 'flex', gap: '5px' }}>
                    <Dropdown
                        id="cliente_id"
                        value={clienteSeleccionado}
                        onChange={ManejoDeCliente}
                        options={data}
                        optionLabel="nombre_cliente"
                        showClear
                        filter
                        filterBy="nombre_cliente"
                        placeholder="Seleccione un Cliente"
                        style={{ width: "100%" }}
                    />
                    <ModalCrearCliente pasarSetData={setData} />
                </div>
            </div>
        </>

    );
}
