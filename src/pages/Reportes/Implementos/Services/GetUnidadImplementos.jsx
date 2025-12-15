import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from 'primereact/dropdown';
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext";

export const GetUnidadImplementos = ({pasarSetDataImplementos}) => {
    //#region para obtener personal
    const [unidad, setUnidad] = useState([])
    const [unidadSeleccionado, setUnidadSeleccionado] = useState(null)
    //efecto para traer al personal
    const {obtenerToken}=useContext(AuthContext);
    useEffect(() => {
        const TraerUnidad = async () => {
            try {
                const token=obtenerToken()
                if (token) {
                    const respuestaGet = await axios.get("https://jwmalmcenb-production.up.railway.app/api/almacen/flota/get_unidad", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    const UnidadaConFiltro = respuestaGet.data.data.map(unidad => ({
                        ...unidad,
                        filtro: ` ${unidad.id} ${'>'} ${unidad.placa}`
                    }));
                    setUnidad(UnidadaConFiltro)
                }
            } catch (error) {
                console.error("Error al obtener Unidades:", error);
            }
        }
        TraerUnidad()
    }, [])
    //#region para manejar los valores del dropdown
    const handleUnidadChange = (e) => {
        const unidadSeleccionado = e.value;
        setUnidadSeleccionado(unidadSeleccionado);
        if(unidadSeleccionado){
            pasarSetDataImplementos({
                ...unidadSeleccionado,
                unidad:unidadSeleccionado.placa
            })
        }
    }
    const camposUnidos = (opciones) => {
        return (
            <div>
                <span style={{ fontWeight: 'bold' }}>{opciones.id}</span> {" > "} {opciones.placa}
            </div>
        );
    }
    return (
        <div style={{ width: '100%', margin: '0 auto' }}>
                <Dropdown
                    id="unidad_id"
                    value={unidadSeleccionado}
                    options={unidad}
                    onChange={handleUnidadChange}
                    optionLabel="filtro"
                    placeholder="Seleccione una Unidad"
                    style={{ width: '100%' }}
                    filter
                    filterBy="filtro"
                    itemTemplate={camposUnidos}
                    showClear
                />
        </div>
    );
};
