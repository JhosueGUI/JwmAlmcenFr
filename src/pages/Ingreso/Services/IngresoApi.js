import axios from "axios";

const PROGRAMACION_API = import.meta.env.VITE_PROGRAMACION_API;
export const getIngreso = async (token) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const response = await apiClient.get('/almacen/ingreso/get');
        return response.data.data;
    } catch (error) {
        console.error("Error al obtener Ingreso:", error);
        throw error;
    }
}
export const getProvider = async (token) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const response = await apiClient.get('/almacen/proveedor/get');
        return response.data.data;
    } catch (error) {
        console.error("Error al obtener Proveedor:", error);
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
export const createIngreso = async (token, data) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const response = await apiClient.post('/almacen/ingreso/create',data);
        return response.data.resp;
    } catch (error) {
        console.error("Error al crear Ingreso:", error);
        throw error;
    }
}