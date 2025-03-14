import React, { useEffect, useState } from "react";
import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from 'primereact/dropdown';
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { ModalAgregarPersonalSalida } from "../Mod/ModalAgregarPersonalSalida";

const GetPersonal = ({ pasarSetSalidas, pasarPersonalInicial, pasarSalidaSeleccionadoCombustible }) => {
    //const obtener token
    const { obtenerToken } = useContext(AuthContext)
    //#region para obtener personal
    const [personal, setPersonal] = useState([])
    const [personalSeleccionado, setPersonalSeleccionado] = useState(null)
    //efecto para traer al personal
    useEffect(() => {
        const TraerPersonal = async () => {
            try {
                const token = obtenerToken()
                if (token) {
                    const respuestaGet = await axios.get("http://127.0.0.1:8000/api/almacen/personal/get", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    const personalConFiltro = respuestaGet.data.data.map(personal => ({
                        ...personal,
                        filtro: ` ${personal.id} ${'>'} ${personal.persona?.nombre} ${personal.persona?.apellido_paterno} ${personal.persona?.apellido_materno}`
                    }));
                    setPersonal(personalConFiltro)
                    if (pasarPersonalInicial && pasarPersonalInicial.personalId) {
                        const personalInicialSeleccionado = personalConFiltro.find(p => p.id === pasarPersonalInicial.personalId);
                        if (personalInicialSeleccionado) {
                            setPersonalSeleccionado(personalInicialSeleccionado);
                        }
                    }else if(pasarSalidaSeleccionadoCombustible && pasarSalidaSeleccionadoCombustible.personal_id){
                        const personalInicialSeleccionado = personalConFiltro.find(p => p.id === pasarSalidaSeleccionadoCombustible.personal_id);
                        if (personalInicialSeleccionado) {
                            setPersonalSeleccionado(personalInicialSeleccionado);
                        }
                    }
                }
            } catch (error) {
                console.error("Error al obtener Productos:", error);
            }
        }
        TraerPersonal()
    }, [pasarPersonalInicial])
    //#region para manejar los valores del dropdown
    const handlePersonalChange = (e) => {
        const personalSeleccionado = e.value;
        setPersonalSeleccionado(personalSeleccionado);
        if (personalSeleccionado) {
            pasarSetSalidas({
                ...personalSeleccionado,
                personal_id: personalSeleccionado.id
            })
        }
    }

    const camposUnidos = (opciones) => {
        return (
            <div>
                <span style={{ fontWeight: 'bold' }}>{opciones.id}</span> {" > "} {opciones.persona?.nombre} {opciones.persona?.apellido_paterno} {opciones.persona?.apellido_materno}
            </div>
        );
    }
    return (
        <div style={{ width: '100%', margin: '0 auto', display: 'flex' , gap: '10px' }}>
            <ModalAgregarPersonalSalida pasarSetPersonal={setPersonal}/>
            <div style={{ width: '100%', margin: '0 auto'}}>
                <FloatLabel>
                    <Dropdown
                        id="personal_id"
                        value={personalSeleccionado}
                        options={personal}
                        onChange={handlePersonalChange}
                        optionLabel="filtro"
                        placeholder="Seleccione un Personal"
                        style={{ width: '100%' }}
                        filter
                        filterBy="filtro"
                        itemTemplate={camposUnidos}
                        showClear
                    />
                    <label htmlFor="personal_id">Seleccione un Personal</label>
                </FloatLabel>
            </div>
        </div>
    );
};

export default GetPersonal;