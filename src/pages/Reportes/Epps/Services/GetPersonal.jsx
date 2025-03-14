import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import axios from "axios";
import { Dropdown } from "primereact/dropdown";

export const GetPersonal = ({ pasarSetDataEpps }) => {
    // Traer token
    const { obtenerToken } = useContext(AuthContext);

    // Estado para personal y el personal seleccionado
    const [personal, setPersonal] = useState([]);
    const [personalSeleccionado, setPersonalSeleccionado] = useState(null);

    useEffect(() => {
        const getPersonal = async () => {
            try {
                const token = obtenerToken();
                if (token) {
                    const respuestaGet = await axios.get("https://jwmalmcenb-production.up.railway.app/api/almacen/personal/get/transaccion", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const personalConFiltro = respuestaGet.data.data.map(personal => ({
                        ...personal,
                        filtro: ` ${personal.id} ${'>'} ${personal.persona?.nombre} ${personal.persona?.apellido_paterno} ${personal.persona?.apellido_materno}`
                    }));
                    setPersonal(personalConFiltro);
                }
            } catch (error) {
                console.log('Error', error);
            }
        };
        getPersonal();
    }, [obtenerToken]);

    //#region para manejar los valores del dropdown
    const handlePersonalChange = (e) => {
        const personalSeleccionado = e.value;
        setPersonalSeleccionado(personalSeleccionado);
        if (personalSeleccionado) {
            pasarSetDataEpps({
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
        <div style={{ width: '100%', margin: '0 auto' }}>
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
        </div>
    );
}
