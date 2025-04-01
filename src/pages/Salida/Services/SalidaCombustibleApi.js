import axios from "axios";

const PROGRAMACION_API = import.meta.env.VITE_PROGRAMACION_API;

export const GetStockCombustible = async (token) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const respuesta = await apiClient.get("/almacen/salida_combustible/get/combustible");
        return respuesta.data.resp;
    } catch (error) {
        console.error("Error al obtener Combustible:", error);
        throw error;
    }
};
export const EditarSalidaCombustible = async (token, data, id) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const respuesta = await apiClient.post(`/almacen/salida_combustible/update/${id}`, data);
        return respuesta.data.resp
    } catch (error) {
        console.error("Error al editar Combustible:", error);
        throw error;
    }
}
export const getSalidaCombustible = async (token) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const respuesta = await apiClient.get('/almacen/salida_combustible/get');
        return respuesta.data.data
    } catch (error) {
        console.error("Error al editar Combustible:", error);
        throw error;
    }
}
export const createSalidaCombustible = async (token, data) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const respuesta = await apiClient.post('/almacen/salida_combustible/create', data);
        return respuesta.data.resp
    } catch (error) {
        console.error("Error al crear Salida Combustible:", error);
        throw error;
    }
}
export const getGrifo = async (token) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const respuesta = await apiClient.get('/almacen/grifo/get');
        return respuesta.data.data
    } catch (error) {
        console.error("Error al obtener Grifo:", error);
        throw error;
    }
}
export const createGrifo = async (token, data) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const respuesta = await apiClient.post('/almacen/grifo/create', data);
        return respuesta.data.resp
    } catch (error) {
        console.error("Error al crear Grifo:", error);
        throw error;
    }
}
export const getFlota = async (token) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const response = await apiClient.get('/almacen/flota/get')
        return response.data.data
    } catch (error) {
        console.error("Error al obtener Flota:", error);
        throw error;
    }
}
