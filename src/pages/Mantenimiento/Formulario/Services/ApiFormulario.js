import axios from "axios";
const PROGRAMACION_API = import.meta.env.VITE_PROGRAMACION_API;

export const getFormulario = async (token) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const response = await apiClient.get('/mantenimiento/formulario/get');
        return response.data.data;
    } catch (error) {
        console.error('Error al obtener formulario:', error);
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
        const response = await apiClient.get('/almacen/flota/get');
        return response.data.data;
    } catch (error) {
        console.error('Error al obtener unidad:', error);
        throw error;
    }
}
export const createFormulario = async (token, data) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const response = await apiClient.post('/mantenimiento/formulario/create', data);
        return response.data.resp;
    } catch (error) {
        console.error('Error al crear formulario:', error);
        throw error;
    }
}
export const createFormularioSinLogin = async (token, data) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const response = await apiClient.post('/formulario/create', data);
        return response.data.resp;
    } catch (error) {
        console.error('Error al crear formulario:', error);
        throw error;
    }
}
export const getPersonal = async (token) => {
    try{
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const response = await apiClient.get('/almacen/personal/get');
        return response.data.data;
    }catch(error){
        console.error('Error al obtener personal:',error);
        throw error;
    }
}