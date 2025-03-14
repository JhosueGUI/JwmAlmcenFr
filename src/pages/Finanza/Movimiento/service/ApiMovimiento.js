import axios from "axios";
const PROGRAMACION_API = import.meta.env.VITE_PROGRAMACION_API;

export const getMovimientos = async (token) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const response = await apiClient.get('/finanza/movimiento/get');
        return response.data.data;
    } catch (error) {
        console.error('Error al obtener programación:', error);
        throw error;
    }
}
export const getEstadoMovimiento = async (token) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const response = await apiClient.get('/finanza/estado-comprobante/get');
        return response.data.data;
    } catch (error) {
        console.error('Error al obtener estado:', error);
        throw error;
    }
}
export const getRendicionMovimiento = async (token) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const response = await apiClient.get('/finanza/rendicion/get');
        return response.data.data;
    } catch (error) {
        console.error('Error al obtener rendición:', error);
        throw error;
    }
}
export const getEmpresaMovimiento = async (token) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const response = await apiClient.get('/finanza/empresa/get');
        return response.data.data;
    } catch (error) {
        console.error('Error al obtener Empresa:', error);
        throw error;
    }
}
export const getModoMovimiento = async (token) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const response = await apiClient.get('/finanza/modo/get');
        return response.data.data;
    } catch (error) {
        console.error('Error al obtener Modo:', error);
        throw error;
    }
}
export const getMonedaMovimiento = async (token) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const response = await apiClient.get('/finanza/moneda/get');
        return response.data.data;
    } catch (error) {
        console.error('Error al obtener Moneda:', error);
        throw error;
    }
}
export const getClienteMovimiento = async (token) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const response = await apiClient.get('/finanza/cliente/get');
        return response.data.data;
    } catch (error) {
        console.error('Error al obtener Cliente:', error);
        throw error;
    }
}
export const crearClienteMovimiento = async (token, data) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const response = await apiClient.post('/finanza/cliente/create', data)
        return response.data.resp;
    } catch (error) {
        console.error('Error al crear cliente:', error);
        throw error;
    }
}

export const getCategoriaMovimiento = async (token) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const response = await apiClient.get('/finanza/sub_categoria/get');
        return response.data.data;
    } catch (error) {
        console.error('Error al obtener Categoria:', error);
        throw error;
    }
}
export const crearMovimiento = async (token, data) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const response = await apiClient.post('/finanza/movimiento/create', data)
        return response.data.resp;
    } catch (error) {
        console.error('Error al crear movimiento:', error);
        throw error;
    }
}
export const crearTrazabilidad = async (token, data, id) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const response = await apiClient.post(`/finanza/movimiento/trazabilidad/${id}`, data)
        return response.data.resp;
    } catch (error) {
        console.error('Error al crear trazabilidad:', error);
        throw error;
    }
}
export const editarMovimiento = async (token, data, id) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const response = await apiClient.post(`/finanza/movimiento/update/${id}`, data)
        return response.data.resp;
    } catch (error) {
        console.error('Error al editar Proveedor:', error);
        throw error;
    }
}
export const getDatosPersonaApi = async (token, dni) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const response = await apiClient.get(`/servicio/persona_natural/get/${dni}`)
        return response.data.resp;
    } catch (error) {
        console.error('Error al obtener datos persona:', error);
        throw error;
    }
}
export const getDatosProveedorApi = async (token, ruc) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const response = await apiClient.get(`/servicio/persona_juridica/get/${ruc}`)
        return response.data.resp;
    } catch (error) {
        console.error('Error al obtener datos del proveedor:', error);
        throw error;
    }
}
export const getPersona = async (token) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const response = await apiClient.get('/finanza/persona/get');
        return response.data.data;
    } catch (error) {
        console.error('Error al obtener Personal:', error);
        throw error;
    }
}
export const crearPersona = async (token, data) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const respuesta = await apiClient.post('/finanza/persona/create', data);
        return respuesta.data.resp;
    } catch (error) {
        console.error('Error al crear Personal:', error);
        throw error;
    }
}
export const getProveedor = async (token) => {
    try {
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const respuesta = await apiClient.get('/finanza/proveedor/get');
        return respuesta.data.data;
    } catch (error) {
        console.error('Error al obtener Proveedor:', error);
        throw error;
    }
}
export const crearProveedor = async (token, data) => {
    try{
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const respuesta = await apiClient.post('/finanza/proveedor/create', data);
        return respuesta.data.resp;
    }catch(error){
        console.error('Error al crear Proveedor:', error);
        throw error;
    }
}


