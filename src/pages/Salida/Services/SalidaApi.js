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