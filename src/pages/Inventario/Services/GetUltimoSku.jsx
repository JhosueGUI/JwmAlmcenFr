import axios from "axios";
import { useState, useEffect } from "react";
import { Dropdown } from 'primereact/dropdown';
import { FloatLabel } from 'primereact/floatlabel';
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { InputNumber } from "primereact/inputnumber";

export const GetUltimoSku = ({ pasarSetDataInventario }) => {
    const { obtenerToken } = useContext(AuthContext);
    const [ultimoSKU, setUltimoSKU] = useState(null);
    
    useEffect(() => {
        const ObtenerUltimoSku = async () => {
            try {
                const token = obtenerToken();
                if (token) {
                    const respuestaGet = await axios.get("https://jwmalmcenb-production.up.railway.app/api/almacen/inventario_valorizado/ultimo_sku", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const nuevoSKU = respuestaGet.data.resp;
                    setUltimoSKU(nuevoSKU);
                    pasarSetDataInventario(nuevoSKU);
                } else {
                    console.log("No se encontró un token de autenticación válido");
                }
            } catch (error) {
                console.log("Error al obtener el último SKU", error);
            }
        };
        ObtenerUltimoSku();
    },[]);
    
    return (
        <FloatLabel>
            <InputNumber id="SKU" name="SKU" style={{ width: "100%" }} value={ultimoSKU} disabled />
            <label htmlFor="SKU" style={{ textAlign: "center" }}>SKU</label>
        </FloatLabel>
    );
};


