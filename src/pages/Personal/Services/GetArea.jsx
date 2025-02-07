import React, { useContext, useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from 'primereact/dropdown';
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";

export const GetArea = ({ pasarSetPersonal, pasarPersonalInicial }) => {
    //#region para obtener personal
    const [area, setArea] = useState([])
    const [areaSeleccionado, setAreaSeleccionado] = useState(null)
    //efecto para traer al personal
    //traer token
    const { obtenerToken } = useContext(AuthContext)
    useEffect(() => {
        const TraerArea = async () => {
            try {
                const token = obtenerToken()
                if (token) {
                    const respuestaGet = await axios.get("https://jwmalmcenb-production.up.railway.app/api/almacen/area/get", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    const areaConFiltro = respuestaGet.data.data.map(area => ({
                        ...area,
                        filtro: ` ${area.id} ${'>'} ${area.nombre}`
                    }));
                    setArea(areaConFiltro)
                    if (pasarPersonalInicial) {
                        const areaSeleccionadoRelleno = areaConFiltro.find(p => p.id === pasarPersonalInicial.area_id)
                        if(areaSeleccionadoRelleno){
                            setAreaSeleccionado(areaSeleccionadoRelleno)
                        }
                    }
                }
            } catch (error) {
                console.error("Error al obtener Areas:", error);
            }
        }
        TraerArea()
    }, [])
    //#region para manejar los valores del dropdown
    const handleAreaChange = (e) => {
        const areaSeleccionado = e.value;
        setAreaSeleccionado(areaSeleccionado);
        if (areaSeleccionado) {
            pasarSetPersonal({
                ...areaSeleccionado,
                area_id: areaSeleccionado.id
            })
        }
    }
    const camposUnidos = (opciones) => {
        return (
            <div>
                <span style={{ fontWeight: 'bold' }}>{opciones.id}</span> {" > "} {opciones.nombre}
            </div>
        );
    }
    return (
        <div style={{ width: '100%', margin: '0 auto' }}>
            <FloatLabel>
                <Dropdown
                    id="personal_id"
                    value={areaSeleccionado}
                    options={area}
                    onChange={handleAreaChange}
                    optionLabel="filtro"
                    placeholder="Seleccione una Area"
                    style={{ width: '100%' }}
                    filter
                    filterBy="filtro"
                    itemTemplate={camposUnidos}
                    showClear
                />
                <label htmlFor="personal_id">Seleccione una Area</label>
            </FloatLabel>
        </div>
    );
};
