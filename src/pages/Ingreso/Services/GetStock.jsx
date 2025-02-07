
import styled from "styled-components";
import React, { useState, useEffect } from 'react';
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Knob } from 'primereact/knob';

export function GetStock({ pasarProductoSeleccionado }) {
    //obtener el token
    const { obtenerToken } = useContext(AuthContext)
    //traer al estock logico
    const [stock, setStock] = useState('')
    useEffect(() => {
        const TraerStock = async () => {
            try {
                const token = obtenerToken()
                if (token) {
                    const respuestaGet = await axios.get(`https://jwmalmcenb-production.up.railway.app/api/almacen/producto/stock/${pasarProductoSeleccionado}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    setStock(respuestaGet.data.data)

                }
            } catch (error) {

            }
        }
        TraerStock()
    }, [pasarProductoSeleccionado])
    return (
        <FloatLabel>
            <InputText id="articulo" name="nombre" style={{ width: '100%' }} value={stock} disabled/>
            <label htmlFor="articulo" style={{ textAlign: "center" }}>Stock</label>
        </FloatLabel>

        // <Knob
        //     value={stock}
        //     size={70}
        //     strokeWidth={18}
        //     min={0}
        //     max={100}
        //     valueColor="rgb(36, 141, 99)"  // Color azul medio para el valor
        //     rangeColor="rgb(191, 241, 223)"  // Color azul claro para el rango
        // />

    );
}

const Contenedor = styled.div`
    overflow-y: auto;
`;

const MultiSelectContainer = styled.div`
    .p-multiselect {
        width: 100%; /* Ajusta el tamaño según tus necesidades */
    }
`;
