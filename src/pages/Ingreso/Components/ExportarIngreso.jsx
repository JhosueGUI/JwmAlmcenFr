import React from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';

export function ExportarIngreso() {
    const exportarExcel = async () => {
        try {
            const fecha = new Date();
            const fechaFormateada = fecha.toISOString().split('T')[0]; // Formato YYYY-MM-DD

            const response = await axios.get('https://jwmalmcenb-production.up.railway.app/api/orden_compra/exportar_ingreso', {
                responseType: 'blob' // Para manejar archivos binarios (Excel en este caso)
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `ingreso-${fechaFormateada}.xlsx`); // Nombre del archivo con fecha actual
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error al exportar ingreso:', error);
        }
    };

    return (
        <Button type="button" icon="pi pi-download" className="p-button-secondary" severity="info" onClick={exportarExcel} />
    );
}
