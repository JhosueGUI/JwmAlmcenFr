import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { GetPersonal } from "../Services/PersonalApi";

const UsarGetPersonal = () => {
    const [data, setData] = useState([]);
    const { obtenerToken } = useContext(AuthContext)
    useEffect(() => {
        const FetchPersonal = async () => {
            try {
                const token = obtenerToken();
                const respuestaGet = await GetPersonal(token);
                const PersonalAdaptado = respuestaGet.map(item => ({
                    id: item.id || '',
                    nombre: item.persona?.nombre || '',
                    fecha_nacimiento: item.persona?.fecha_nacimiento || '',
                    apellido: `${item.persona?.apellido_paterno} ${item.persona?.apellido_materno}` || '',
                    gmail: item.persona?.gmail || '',
                    numero_documento: item.persona?.numero_documento || '',
                    tipo_documento_id: item.persona?.tipo_documento_id || '',
                    fecha_ingreso: item.fecha_ingreso || '',
                    area: item.cargo.area?.nombre || '',
                    cargo: item.cargo?.nombre_cargo || '',
                    area_id: item.area?.id || '',
                    habilidad: item.habilidad || '',
                    ingreso_planilla: item.fecha_ingreso_planilla || '',
                    planilla: item.planilla?.nombre_planilla || '',
                    experiencia: item.experiencia || '',
                }))
                setData(PersonalAdaptado);
            } catch (error) {
                console.error("Error al obtener Personal:", error);
                throw error;
            }
        }
        FetchPersonal();
    }, [])
    return { data,setData };
}
export default UsarGetPersonal;