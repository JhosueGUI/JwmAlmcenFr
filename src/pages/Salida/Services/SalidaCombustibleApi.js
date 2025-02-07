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
