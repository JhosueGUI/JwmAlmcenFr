import styled from "styled-components";
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Dropdown } from "primereact/dropdown";
import { FloatLabel } from "primereact/floatlabel";
import "../../../Css/Drop.css";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

export function GetTipoDocumentos({ pasarDataPersonal, personalInicial }) {
    ///obtener token
    const {obtenerToken}=useContext(AuthContext)
    const [tipoDocumento, setTipoDocumento] = useState([]);
    const [tipoDocumentoSeleccionado, setTipoDocumentoSeleccionado] = useState(null);

    useEffect(() => {
        const getProveedoR = async () => {
            try {
                const token = obtenerToken();
                if (token) {
                    const respuestaGet = await axios.get("https://jwmalmcenb-production.up.railway.app/api/almacen/tipo_documento/get", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const tipoDocumentoFiltrado = respuestaGet.data.data.map(tipo => ({
                        ...tipo,
                        filtro: `${tipo.id} ${'>'} ${tipo.nombre}`
                    }));
                    if (personalInicial && personalInicial.tipo_documento_id) {
                        const documentoInicialSeleccionado = tipoDocumentoFiltrado.find(p => p.id === personalInicial.tipo_documento_id)
                        if (documentoInicialSeleccionado) {
                            setTipoDocumentoSeleccionado(documentoInicialSeleccionado)
                        }
                    }
                    setTipoDocumento(tipoDocumentoFiltrado);
                }
            } catch (error) {
                console.log('Error', error);
            }
        };

        getProveedoR();
    }, [personalInicial]);

    const handleDocumentoChange = (e) => {
        const tipoDocumentoSeleccionado = e.value;
        setTipoDocumentoSeleccionado(tipoDocumentoSeleccionado);
        if (tipoDocumentoSeleccionado) {
            pasarDataPersonal({
                ...tipoDocumentoSeleccionado,
                tipo_documento_id: tipoDocumentoSeleccionado.id
            });
        }
    };

    const itemTemplate = (opciones) => {
        return (
            <div>
                <span style={{ fontWeight: 'bold' }}>{opciones.id}</span> {" > "}  {opciones.nombre}
            </div>
        );
    };

    return (
        <div style={{ width: '100%', margin: '0 auto' }}>
            <FloatLabel>
                <Dropdown
                    id="tipo_documento_id"
                    value={tipoDocumentoSeleccionado}
                    options={tipoDocumento}
                    onChange={handleDocumentoChange}
                    optionLabel="filtro"
                    placeholder="Seleccione un Tipo de Documento"
                    style={{ width: '100%' }}
                    filter
                    filterBy="filtro"
                    itemTemplate={itemTemplate}
                    showClear
                />
                <label htmlFor="tipo_documento_id">Seleccione un Tipo Documento</label>
            </FloatLabel>
        </div>
    );
}
