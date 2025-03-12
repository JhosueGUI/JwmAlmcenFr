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

        const respuesta = await apiClient.get("/almacen/personal/get");
        return respuesta.data.data;
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
