import axios from "axios";
const PROGRAMACION_API = import.meta.env.VITE_PROGRAMACION_API;
export const getAcces = async (token) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const response = await apiClient.get('/almacen/acceso/get')
        return response.data.data;
    } catch (error) {
        console.error('Error al obtener accesos:', error);
        throw error;
    }
}
export const AsignAcces = async (token, data, id) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const response = await apiClient.post(`/almacen/rol/asignar_acceso/${id}`, data)
        return response.data.resp
    } catch (error) {
        console.error('Error al asignar accesos:', error);
        throw error;
    }
}