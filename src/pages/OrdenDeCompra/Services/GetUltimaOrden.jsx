import React, { useContext, useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from 'primereact/dropdown';
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { InputNumber } from "primereact/inputnumber";

export const GetUltimaOrden = ({ }) => {
    //region para obtner token
    const { obtenerToken } = useContext(AuthContext);
    //#region para obtner tultima orden
    const [numeroOrden, setNumeroOrden] = useState(null);
    useEffect(() => {
        const ObtenerNumeroOrden = async () => {
            try {
                const token = obtenerToken()
                if (token) {
                    const respuestaGet = await axios.get("https://jwmalmcenb-production.up.railway.app/api/almacen/orden_compra/get/ultimo", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    setNumeroOrden(respuestaGet.data.resp)
                }
            } catch (error) {
                console.log(error)
            }
        }
        ObtenerNumeroOrden()
    }, [])


    return (
        <>
            <FloatLabel>
                <InputNumber id="orden_compra" name="orden_compra" style={{ width: '100%' }} value={numeroOrden} disabled />
                <label htmlFor="orden_compra" style={{ textAlign: "center", }}>Orden de Compra</label>
            </FloatLabel>
        </>
    );
};