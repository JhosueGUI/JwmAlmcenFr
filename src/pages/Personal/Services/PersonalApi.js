import axios from "axios";

const PROGRAMACION_API = import.meta.env.VITE_PROGRAMACION_API;

export const GetPersonal = async (token) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const response = await apiClient.get("/almacen/personal/get");
        return response.data.data.map(item => ({
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
        }));
    } catch (error) {
        console.error("Error al obtener Combustible:", error);
        throw error;
    }
};
export const GetPlanilla = async (token) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const respuesta = await apiClient.get("/almacen/planilla/get");
        return respuesta.data.data;
    } catch (error) {
        console.error("Error al obtener Planilla:", error);
        throw error;
    }
}
export const GetCargo = async (token) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const respuesta = await apiClient.get("/almacen/cargo/get");
        return respuesta.data.data;
    } catch (error) {
        console.error("Error al obtener Cargo:", error);
        throw error;
    }
}
export const deletePersonal = async (token, id) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const respuesta = await apiClient.delete(`/almacen/personal/delete/${id}`);
        return respuesta.data.resp;
    } catch (error) {
        console.error("Error al eliminar Personal:", error);
        throw error;
    }
}
export const getPersonalDisable = async (token, id) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const response = await apiClient.get("/almacen/personal/get/disable");
        return response.data.data.map(item => ({
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
        }));
    } catch (error) {
        console.error("Error al obtener Personal Desabilitado:", error);
        throw error;
    }
}
export const reactivatePersonal = async (token, id) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const respuesta = await apiClient.post(`/almacen/personal/reactivacion/${id}`);
        return respuesta.data.resp;
    } catch (error) {
        console.error("Error al reactivar Personal:", error);
        throw error;
    }
}

