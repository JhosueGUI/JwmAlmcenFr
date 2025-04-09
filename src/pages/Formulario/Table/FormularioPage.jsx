import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { MultiSelect } from "primereact/multiselect";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import UseGetFormulario from "../Hooks/UseGetFormulario";
import { ColumnsForms } from "../Constant/ColumnsForms";
import ModalCrearFormulario from "../Mod/ModalCrearFormulario";
import { DescargarPdf } from "../Components/DescargarPdf";
import { VerPdf } from "../Components/VerPdf";

// Nuevo componente para mostrar la tabla de detalles
const DetallesTabla = ({ detalles }) => {
    if (!detalles || detalles.length === 0) {
        return <p>No hay detalles disponibles.</p>;
    }

    const columnasDetalles = [
        { field: 'titulo', header: 'Título' },
        { field: 'descripcion', header: 'Descripción' },
        {
            field: 'url_pdf',
            header: 'PDF',
            body: (rowData) => (
                rowData.url_pdf ? <a href={rowData.url_pdf} target="_blank" rel="noopener noreferrer">Ver PDF</a> : 'N/A'
            )
        }
    ];

    const columnas = columnasDetalles.map(col => (
        <Column key={col.field} field={col.field} header={col.header} />
    ));

    return (
        <div style={{ padding: '1rem' }}>
            <h5>Historial de Detalles</h5>
            <DataTable value={detalles} responsiveLayout="scroll">
                {columnas}
            </DataTable>
        </div>
    );
};

export function FormularioPage() {
    const { data, setData } = UseGetFormulario();
    const [columnasVisibles, setColumnasVisibles] = useState(ColumnsForms);
    const [filtroGlobal, setFiltroGlobal] = useState("");
    const [expandedRows, setExpandedRows] = useState(null);

    const AlternarColumna = (event) => {
        let columnasSeleccionadas = event.value;
        let columnasOrdenadas = ColumnsForms.filter(col =>
            columnasSeleccionadas.some(sCol => sCol.field === col.field)
        );
        setColumnasVisibles(columnasOrdenadas);
    };

    const rowExpansionTemplate = (rowData) => {
        return <DetallesTabla detalles={rowData.detalles} />;
    };

    const columns = columnasVisibles.map(col => (
        <Column key={col.field} field={col.field} header={col.header} sortable />
    ));

    const rowToggler = (props) => {
        return (
            <Button icon="pi pi-chevron-down" onClick={() => props.onClick(props.event)} className="p-button-text" />
        );
    };

    const datosFiltrados = data?.filter(item =>
        columnasVisibles.some(col =>
            item[col.field]?.toString().toLowerCase().includes(filtroGlobal.toLowerCase())
        )
    );
    // Columnas Adicionales
    const asignarRolCampoTabla = (rowData) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <DescargarPdf formulario={rowData.id} />
                <VerPdf formulario={rowData.id}/>
            </div>
        );
    };
    

    return (
        <div className="contenedor" style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
            <div className="encabezado" style={{ width: '100%', color: '#1A55B0', display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '30px', fontWeight: 'bold' }}> Gestión de Formularios </span>
                <span style={{ color: '#1A55B0', fontSize: '15px' }}>
                    En este modulo usteded podra gestionar los formularios
                </span>
            </div>
            <div className="acciones" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="crear" style={{ width: '100%' }}>
                    <ModalCrearFormulario pasarSetData={setData} />
                </div>
            </div>
            <div className="general" style={{ display: 'flex', width: '100%', gap: '50px' }}>
                <div className="contenido" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <div className="tabla-contenedor" style={{ width: '100%' }}>
                        <DataTable
                            value={datosFiltrados}
                            paginator
                            rows={10}
                            rowsPerPageOptions={[5, 10, 20]}
                            header={
                                <MultiSelect
                                    style={{ width: '100%' }}
                                    value={columnasVisibles}
                                    options={ColumnsForms}
                                    optionLabel="header"
                                    onChange={AlternarColumna}
                                    display="chip"
                                    placeholder="Selecciona columnas"
                                />
                            }
                            expandedRows={expandedRows}
                            onRowToggle={(e) => setExpandedRows(e.data)}
                            rowExpansionTemplate={rowExpansionTemplate}
                        >
                            <Column expander={rowToggler} style={{ width: '3em' }} />
                            {columns}
                            <Column
                                header="Reportes"
                                body={asignarRolCampoTabla}
                                style={{ textAlign: 'center', width: '10rem', position: 'sticky', right: 0, background: 'white' }}
                            />
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    );
}