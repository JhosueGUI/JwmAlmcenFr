import axios from "axios";

const PROGRAMACION_API = import.meta.env.VITE_PROGRAMACION_API;

export const GetInventario = async (token) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const respuesta = await apiClient.get("/almacen/inventario_valorizado/get");
        return respuesta.data.data;
    } catch (error) {
        console.error("Error al obtener Inventario:", error);
        throw error;
    }
};
export const CrearInventario = async (token, data) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const respuesta = await apiClient.post("/almacen/inventario_valorizado/create", data);
        return respuesta.data.resp;
    } catch (error) {
        console.error("Error al crear Inventario:", error);
        throw error;
    }
};
export const EditarInventario = async (token, data, id) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const respuesta = await apiClient.post(`/almacen/inventario_valorizado/update/${id}`, data);
        return respuesta.data.resp;
    } catch (error) {
        console.error("Error al editar Inventario:", error);
        throw error;
    }
};