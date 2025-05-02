import axios from "axios";

const PROGRAMACION_API = import.meta.env.VITE_PROGRAMACION_API;

export const getDocument = async (token) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const response = await apiClient.get('/almacen/tipo_documento/get');
        return response.data.data;
    } catch (error) {
        console.error("Error al obtener Documento:", error);
        throw error;
    }
}