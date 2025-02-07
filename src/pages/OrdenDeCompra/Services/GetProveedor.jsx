import styled from "styled-components";
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Dropdown } from "primereact/dropdown";
import { FloatLabel } from "primereact/floatlabel";
import "../../../Css/Drop.css";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

export function GetProveedorOrden({ pasarSetDataOrden, pasarOrdenSeleccionado }) {
    //obtner token
    const {obtenerToken}=useContext(AuthContext)
    const [proveedor, setProveedor] = useState([]);
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);

    useEffect(() => {
        const getProveedoR = async () => {
            try {
                const token = obtenerToken();
                if (token) {
                    const respuestaGet = await axios.get("http://127.0.0.1:8000/api/almacen/proveedor/get", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const proveedorConFiltro = respuestaGet.data.data.map(proveedor => ({
                        ...proveedor,
                        filtro: `${proveedor.id} ${proveedor.razon_social}`
                    }));
                    setProveedor(proveedorConFiltro);
                    if(pasarOrdenSeleccionado){
                        const ProveedorInicialSeleccionado= proveedorConFiltro.find(p=>p.id === pasarOrdenSeleccionado.proveedor_id)
                        if(ProveedorInicialSeleccionado){
                            setProveedorSeleccionado(ProveedorInicialSeleccionado)
                        }
                    }
                }
            } catch (error) {
                console.log('Error', error);
            }
        };
        
        getProveedoR();
    }, []);

    const handleProveedorChange = (e) => {
        const proveedorSeleccionado = e.value;
        setProveedorSeleccionado(proveedorSeleccionado);
        if (proveedorSeleccionado) {
            pasarSetDataOrden({
                ...proveedorSeleccionado,
                proveedor_id: proveedorSeleccionado.id
            });
        }
    };

    const itemTemplate = (opciones) => {
        return (
            <div>
                <span style={{ fontWeight: 'bold' }}>{opciones.id}</span> {" > "}  {opciones.razon_social}
            </div>
        );
    };

    return (
        <div style={{ width: '100%', margin: '0 auto' }}>
            <FloatLabel>
                <Dropdown
                    id="proveedor_id"
                    value={proveedorSeleccionado}
                    options={proveedor}
                    onChange={handleProveedorChange}
                    optionLabel="filtro"
                    placeholder="Seleccione un Proveedor"
                    style={{ width: '100%'}}
                    filter
                    filterBy="filtro"
                    itemTemplate={itemTemplate}
                    showClear 
                />
                <label htmlFor="proveedor_id">Seleccione un Proveedor</label>
            </FloatLabel>
        </div>
    );
}
