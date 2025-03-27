import axios from "axios";

const PROGRAMACION_API = import.meta.env.VITE_PROGRAMACION_API;

export const getSalida = async (token) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const respuesta = await apiClient.get("/almacen/salida/get");
        return respuesta.data.data;
    } catch (error) {
        console.error("Error al obtener Salida:", error);
        throw error;
    }
}
export const getPersonal = async (token) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const respuesta = await apiClient.get("/almacen/personal/get");
        return respuesta.data.data
    } catch (error) {
        console.error("Error al obtener Personal:", error);
        throw error;
    }
}
export const getUnidad = async (token) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const respuesta = await apiClient.get("/almacen/flota/get");
        return respuesta.data.data
    } catch (error) {
        console.error("Error al obtener Unidad:", error);
        throw error;
    }
}
export const getProducto = async (token) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const respuesta = await apiClient.get('/almacen/producto/get');
        return respuesta.data.data;
    } catch (error) {
        console.error("Error al obtener Producto:", error);
        throw error;
    }
}