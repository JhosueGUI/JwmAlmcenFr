import axios from "axios";
const PROGRAMACION_API = import.meta.env.VITE_PROGRAMACION_API;
export const getCompanyJwm=async(token)=>{
    try{
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const response = await apiClient.get('/finanza/empresa/get/jwm')
        return response.data.resp;
    }catch(error){
        console.error('Error al obtener empresa:', error);
        throw error;
    }
}
export const getCompanyJoel=async(token)=>{
    try{
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const response = await apiClient.get('/finanza/empresa/get/joel')
        return response.data.resp;
    }catch(error){
        console.error('Error al obtener empresa:', error);
        throw error;
    }
}
export const getCompanyWilliam=async(token)=>{
    try{
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const response = await apiClient.get('/finanza/empresa/get/william')
        return response.data.resp;
    }catch(error){
        console.error('Error al obtener empresa:', error);
        throw error;
    }
}
export const getCompanyPampaya=async(token)=>{
    try{
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const response = await apiClient.get('/finanza/empresa/get/pampaya')
        return response.data.resp;
    }catch(error){
        console.error('Error al obtener empresa:', error);
        throw error;
    }
}
export const getCompanyFSJ=async(token)=>{
    try{
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const response = await apiClient.get('/finanza/empresa/get/fsj')
        return response.data.resp;
    }catch(error){
        console.error('Error al obtener empresa:', error);
        throw error;
    }
}
export const getCompanyCamionero=async(token)=>{
    try{
        const apiClient = axios.create({
            baseURL: PROGRAMACION_API,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const response = await apiClient.get('/finanza/empresa/get/camionero')
        return response.data.resp;
    }catch(error){
        console.error('Error al obtener empresa:', error);
        throw error;
    }
}
