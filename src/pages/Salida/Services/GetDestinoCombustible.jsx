import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from 'primereact/dropdown';
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

export const GetDestinoCombustible = ({ pasarSetSalidas,pasarSalidaSeleccionadoCombustible }) => {
    //#region para obtener destino
    const [destino, setDestino] = useState([])
    const [destinoSeleccionado, setDestinoSeleccionado] = useState(null)
    //efecto para traer al personal
    const { obtenerToken } = useContext(AuthContext);
    useEffect(() => {
        const TraerDestino = async () => {
            try {
                const token = obtenerToken()
                if (token) {
                    const respuestaGet = await axios.get("https://jwmalmcenb-production.up.railway.app/api/almacen/destino_combustible/get", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    const DestinoAdaptado = respuestaGet.data.data.map(destino => ({
                        ...destino,
                        filtro: ` ${destino.id} ${'>'} ${destino.nombre}`
                    }));
                    setDestino(DestinoAdaptado)
                    if(pasarSalidaSeleccionadoCombustible){
                        const destinoSeleccionadoRelleno = DestinoAdaptado.find(p => p.id === pasarSalidaSeleccionadoCombustible.destino_combustible_id)
                        if (destinoSeleccionadoRelleno) {
                            setDestinoSeleccionado(destinoSeleccionadoRelleno)
                        }
                    }
                }
            } catch (error) {
                console.error("Error al obtener Destinos:", error);
            }
        }
        TraerDestino()
    }, [])
    //#region para manejar los valores del dropdown
    const handleDestinoChange = (e) => {
        const destinoSeleccionado = e.value;
        setDestinoSeleccionado(destinoSeleccionado);
        if (destinoSeleccionado) {
            pasarSetSalidas({
                ...destinoSeleccionado,
                destino_combustible_id: destinoSeleccionado.id
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
                    id="unidad_id"
                    value={destinoSeleccionado}
                    options={destino}
                    onChange={handleDestinoChange}
                    optionLabel="filtro"
                    placeholder="Seleccione el Destino"
                    style={{ width: '100%' }}
                    filter
                    filterBy="filtro"
                    itemTemplate={camposUnidos}
                    showClear
                />
                <label htmlFor="unidad_id">Seleccione el Destino</label>
            </FloatLabel>
        </div>
    );
};
