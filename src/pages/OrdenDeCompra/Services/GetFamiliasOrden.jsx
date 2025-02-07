import axios from "axios";
import { useState, useEffect } from "react";
import { Dropdown } from 'primereact/dropdown';
import { FloatLabel } from 'primereact/floatlabel';
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

export const GetFamiliasOrden = ({pasarSetDataProducto}) => {
     //traer al token
     const { obtenerToken } = useContext(AuthContext);
    //#region Estado para seleccion y obtencion de Familia y Sub_familia
    const [familias, setFamilias] = useState([]);
    const [familiaSeleccionada, setFamiliaSeleccionada] = useState(null);
    const [subFamilias, setSubFamilias] = useState([]);
    const [subFamiliaSeleccionada, setSubFamiliaSeleccionada] = useState(null);

    //Obtención de familias
    useEffect(() => {
        const obtenerFamilias = async () => {
            try {
                const token = obtenerToken();
                if (token) {
                    const respuesta = await axios.get("http://127.0.0.1:8000/api/almacen/sub_familia/get", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setFamilias(respuesta.data.data);
                } else {
                    console.log("No se encontró un token de autenticación válido");
                }
            } catch (error) {
                console.error("Error al obtener familias:", error);
            }
        };
        obtenerFamilias();
    }, []);
    //#endregion
    //#region Filtrado de subfamilias
    useEffect(() => {
        if (familiaSeleccionada) {
            setSubFamilias(familiaSeleccionada.sub_familia);
            setSubFamiliaSeleccionada(null);
        } else {
            setSubFamilias([]);
            setSubFamiliaSeleccionada(null);
        }
    }, [familiaSeleccionada]);
    //#endregion
    const ControlarOpcionSubFamilia = (event) => {
        const subFamiliaSeleccionada = event.value;
        setSubFamiliaSeleccionada(subFamiliaSeleccionada);
        pasarSetDataProducto({
            ...subFamiliaSeleccionada,
            sub_familia_id: subFamiliaSeleccionada.id
        });
    };
    return (
        <div className="contenedorFamilia" style={{ display: 'flex', gap: '10px' }}>
            <FloatLabel style={{ width: '50%' }}>
                <Dropdown
                    id="familia"
                    value={familiaSeleccionada}
                    options={familias}
                    onChange={(e) => setFamiliaSeleccionada(e.value)}
                    optionLabel="familia"
                    placeholder="Seleccione una familia"
                    style={{ width: '100%' }}
                    filter
                    filterBy="familia"
                    showClear
                />
                <label htmlFor="familia">Seleccione una familia</label>
            </FloatLabel>
            <FloatLabel style={{ width: '50%' }}>
                <Dropdown
                    id="subFamilia"
                    value={subFamiliaSeleccionada}
                    options={subFamilias}
                    onChange={ControlarOpcionSubFamilia}
                    optionLabel="nombre"
                    placeholder="Seleccione una sub-familia"
                    style={{ width: '100%' }}
                    filter
                    filterBy="nombre"
                    showClear
                />
                <label htmlFor="subFamilia">Seleccione una sub-familia</label>
            </FloatLabel>
        </div>
    );
};