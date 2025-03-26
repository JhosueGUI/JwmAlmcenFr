
import React, { useState, useEffect } from 'react';
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";

export function GetStock({ pasarProductoSeleccionado }) {
    //obtener el token
    const { obtenerToken } = useContext(AuthContext)
    //traer al estock logico
    const [stock, setStock] = useState("")
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
                console.error("Error al obtener Stock:", error);
            }
        }
        TraerStock()
    }, [pasarProductoSeleccionado])
    return (
        <FloatLabel>
            <InputText id="stock" name="stock" style={{ width: '100%' }} value={stock ?? ""} disabled/>
            <label htmlFor="stock" style={{ textAlign: "center" }}>Stock</label>
        </FloatLabel>
    );
}