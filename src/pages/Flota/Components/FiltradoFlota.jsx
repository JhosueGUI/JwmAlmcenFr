// FiltradoPersonal.js
import React from 'react';
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";

export function FiltradoFlota({ filtro, setFiltro }) {
    const manejarCambioFiltro = (evento) => {
        setFiltro(evento.target.value);
    };

    return (
        <IconField iconPosition="left">
            <InputIcon className="pi pi-search" />
            <InputText
                style={{ backgroundColor:'var(--clr-primary)',border:'none' }}
                value={filtro}
                onChange={manejarCambioFiltro}
                placeholder="Buscar Flota"
            />
        </IconField>
    );
}
