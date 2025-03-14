import React, { useState } from "react";
import { Button } from "primereact/button";
import { FaFilePdf } from "react-icons/fa";
import { Dialog } from "primereact/dialog";
import axios from "axios";

export const VerPdf = ({ numeroCompra }) => {
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);

    const visualizarPdf = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/orden_compra/observar/${numeroCompra}`, {
                responseType: 'blob' // Indica que esperas un blob (archivo) como respuesta
            });

            // Crear una URL de objeto blob para el PDF
            const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(pdfBlob);
            setPdfUrl(url); // Guardar la URL del PDF para mostrarla en el modal
            setShowPdfModal(true); // Mostrar el modal para visualizar el PDF

        } catch (error) {
            console.error("Error al obtener el PDF", error);
            // Manejar errores según tu aplicación (mostrar mensaje, etc.)
        }
    };

    const onHidePdfModal = () => {
        // Limpiar la URL del PDF y ocultar el modal
        setPdfUrl(null);
        setShowPdfModal(false);
    };

    return (
        <>
            <Button outlined onClick={visualizarPdf}><FaFilePdf /></Button>

            <Dialog
                visible={showPdfModal}
                onHide={onHidePdfModal}
                style={{ width: '300vw',height:'90%', maxWidth: '2000px' }} // Estilo del modal, ajustable según tus necesidades
                header={`Orden de Compra ${numeroCompra}`}
            >
                {pdfUrl && (
                    <iframe
                        title={`PDF_${numeroCompra}`}
                        src={pdfUrl}
                        style={{ width: '100%', height: '99%', border: 'none' }} // Estilo del iframe, ajustable según tus necesidades
                    />
                )}
            </Dialog>
        </>
    );
};
