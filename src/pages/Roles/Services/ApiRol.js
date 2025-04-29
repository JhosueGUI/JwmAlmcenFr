import axios from "axios";
const PROGRAMACION_API = import.meta.env.VITE_PROGRAMACION_API;
export const getRoles = async (token) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const response = await apiClient.get('/almacen/rol/get')
        return response.data.data.map(rol => ({
            id: rol.id,
            nombre: rol.nombre,
        }))
    } catch (error) {
        console.error('Error al obtener roles:', error);
        throw error;
    }
}
export const createRol = async (token, data) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const response = await apiClient.post('/almacen/rol/create', data)
        return response.data.resp
    } catch (error) {
        console.error('Error al crear rol:', error);
        throw error;
    }
}
export const updateRol = async (token, data, id) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const response = await apiClient.post(`/almacen/rol/update/${id}`, data)
        return response.data.resp
    } catch (error) {
        console.error('Error al actualizar rol:', error);
        throw error;
    }
}
export const deleteRol = async (token, id) => {
    try{
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const response = await apiClient.delete(`/almacen/rol/delete/${id}`)
        return response.data.resp
    }catch (error) {
        console.error('Error al eliminar rol:', error);
        throw error;
    }
}
