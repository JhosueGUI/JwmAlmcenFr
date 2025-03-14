import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { MdOutlineFileDownload } from "react-icons/md";
import axios from "axios";

export const DescargarPdf = ({ numeroCompra }) => {
    const descargar = async () => {
        try {
            const respuestaGet = await axios.get(`http://127.0.0.1:8000/api/orden_compra/descargar/${numeroCompra}`, {
                responseType: 'blob' // Indica que esperas un blob (archivo) como respuesta
            });
             // Creas una URL de objeto blob para el archivo PDF
             const url = window.URL.createObjectURL(new Blob([respuestaGet.data]));
                
             // Creas un enlace temporal para descargar el archivo PDF
             const link = document.createElement('a');
             link.href = url;
             link.setAttribute('download', `${numeroCompra}-orden_compra.pdf`);
             document.body.appendChild(link);
             link.click();
             link.parentNode.removeChild(link);

             // Liberar recursos del objeto blob
             window.URL.revokeObjectURL(url);
        } catch (error) {

        }
    }
    return (
        <Button outlined onClick={descargar} ><MdOutlineFileDownload /></Button>
    );
};
