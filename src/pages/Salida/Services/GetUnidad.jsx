import React, { useEffect, useState } from "react";
import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from 'primereact/dropdown';
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

export const GetUnidad = ({ pasarSetSalidas, pasarPersonalInicial, pasarSalidaSeleccionadoCombustible }) => {
    //#region para obtener personal
    const [unidad, setUnidad] = useState([])
    const [unidadSeleccionado, setUnidadSeleccionado] = useState(null)
    //efecto para traer al personal
    const { obtenerToken } = useContext(AuthContext);
    useEffect(() => {
        const TraerUnidad = async () => {
            try {
                const token = obtenerToken()
                if (token) {
                    const respuestaGet = await axios.get("http://127.0.0.1:8000/api/almacen/flota/get_unidad", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    const UnidadaConFiltro = respuestaGet.data.data.map(unidad => ({
                        ...unidad,
                        filtro: ` ${unidad.id} ${'>'} ${unidad.placa}`
                    }));
                    setUnidad(UnidadaConFiltro)
                    if (pasarPersonalInicial) {
                        const UnidadSeleccionadoRelleno = UnidadaConFiltro.find(p => p.placa === pasarPersonalInicial.unidad)
                        if (UnidadSeleccionadoRelleno) {
                            setUnidadSeleccionado(UnidadSeleccionadoRelleno)
                        }
                    } else if (pasarSalidaSeleccionadoCombustible) {
                        const UnidadSeleccionadoRelleno = UnidadaConFiltro.find(p => p.id === pasarSalidaSeleccionadoCombustible.flota_id)
                        if (UnidadSeleccionadoRelleno) {
                            setUnidadSeleccionado(UnidadSeleccionadoRelleno)
                        }
                    }
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
        if (unidadSeleccionado) {
            pasarSetSalidas({
                ...unidadSeleccionado,
                unidad: unidadSeleccionado.placa
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
            <FloatLabel>
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
                <label htmlFor="unidad_id">Seleccione una Unidad</label>
            </FloatLabel>
        </div>
    );
};
