import React, { useState, useEffect, useContext } from 'react';
import axios from "axios";
import { MultiSelect } from 'primereact/multiselect';
import { FloatLabel } from "primereact/floatlabel";
import { AuthContext } from "../../../context/AuthContext";

export function GetAccesos({ pasarSetRoles, personalInicial }) {
    // Obtener token
    const { obtenerToken } = useContext(AuthContext);
    const [acceso, setAcceso] = useState([]);
    const [accesoSeleccionado, setAccesoSeleccionado] = useState([]);

    useEffect(() => {
        const getAccesos = async () => {
            try {
                const token = obtenerToken();
                if (token) {
                    const respuestaGet = await axios.get("http://127.0.0.1:8000/api/almacen/acceso/get", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const accesoFiltrado = respuestaGet.data.data.map(acceso => ({
                        ...acceso,
                        filtro: `${acceso.id} > ${acceso.nombre}`
                    }));
                    setAcceso(accesoFiltrado);
                }
            } catch (error) {
                console.log('Error', error);
            }
        };

        getAccesos();
    }, [personalInicial]);

    const handleAccesosChange = (e) => {
        const accesosSeleccionados = e.value;
        setAccesoSeleccionado(accesosSeleccionados);
        pasarSetRoles(accesosSeleccionados);
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
                <MultiSelect 
                    id="acceso_id"
                    value={accesoSeleccionado}
                    options={acceso}
                    onChange={handleAccesosChange}
                    optionLabel="filtro"
                    style={{ width: '100%', background:'rgb(222 228 243)', border:'1px solid #fff' }}
                    filter
                    filterBy="filtro"
                    itemTemplate={itemTemplate}
                    showClear
                    display="chip"
                />
                <label htmlFor="acceso_id">Seleccione los Accesos</label>
            </FloatLabel>
        </div>
    );
}
