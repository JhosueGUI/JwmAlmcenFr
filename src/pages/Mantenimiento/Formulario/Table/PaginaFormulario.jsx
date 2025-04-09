import React, { useState } from "react";
import { SelectUnidad } from "../Components/SelectUnidad";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { SelectPersonal } from "../Components/SelectPersonal";
import UseCreateFormularioSinLogin from "../Hooks/UseCreateFormularioSinLogin";

export function PaginaFormulario() {
    //hooks
    const { Create } = UseCreateFormularioSinLogin()

    const [unidadSeleccionada, setUnidadSeleccionada] = useState(null);
    const [kilometraje, setKilometraje] = useState('');
    const [horometro, setHorometro] = useState('');
    const [fechaHora, setFechaHora] = useState('');
    const [tipoFallaSeleccionada, setTipoFallaSeleccionada] = useState(null);
    const [descripcionFalla, setDescripcionFalla] = useState('');
    const [ubicacionFalla, setUbicacionFalla] = useState('');
    const [operacionSeleccionada, setOperacionSeleccionada] = useState(null);
    const [personalSeleccionado,setPersonalSeleccionado]=useState(null)

    const categories = [
        { name: 'Motor', key: '1' },
        { name: 'Transmisión', key: '2' },
        { name: 'Sistema de frenos', key: '3' },
        { name: 'Dirección y suspensión', key: '4' },
        { name: 'Neumáticos', key: '5' },
        { name: 'Sistema eléctrico', key: '6' },
        { name: 'Carrocería y chasis', key: '7' },
        { name: 'Otros', key: '8' },
    ];
    const [selectedCategories, setSelectedCategories] = useState([]); // Inicializado como array vacío

    const onCategoryChange = (e) => {
        let _selectedCategories = [...selectedCategories];

        if (e.checked)
            _selectedCategories.push(e.value);
        else
            _selectedCategories = _selectedCategories.filter(category => category.key !== e.value.key);

        setSelectedCategories(_selectedCategories);
        setTipoFallaSeleccionada(_selectedCategories.map(item => item.name).join(', '));
    };
    //falla
    const fallas = [
        { name: 'Sí, el vehículo no puede moverse', key: '1' },
        { name: 'No, pero debe revisarse urgentemente', key: '2' },
        { name: 'No, pero se debe programar el mantenimiento', key: '3' }
    ];
    const [selectFalla, setSelectFalla] = useState([]); // Inicializado como array vacío

    const onFallaChange = (e) => {
        let _selectedFalla = [...selectFalla];

        if (e.checked)
            _selectedFalla.push(e.value);
        else
            _selectedFalla = _selectedFalla.filter(falla => falla.key !== e.value.key);

        setSelectFalla(_selectedFalla);
        setOperacionSeleccionada(_selectedFalla.map(item => item.name).join(', '));
    };

    const handleConfirmar = async () => {
        if (!fechaHora) return;

        const year = fechaHora.getFullYear();
        const month = String(fechaHora.getMonth() + 1).padStart(2, '0');
        const day = String(fechaHora.getDate()).padStart(2, '0');
        const hours = String(fechaHora.getHours()).padStart(2, '0');
        const minutes = String(fechaHora.getMinutes()).padStart(2, '0');
        const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;

        const respuestas = [
            unidadSeleccionada,
            kilometraje,
            horometro,
            formattedDateTime,
            tipoFallaSeleccionada,
            descripcionFalla,
            ubicacionFalla,
            operacionSeleccionada,
        ];

        const objetoEnviar = {
            personal_id: personalSeleccionado,
            respuestas: respuestas
        };
        const response = await Create(objetoEnviar)
        console.log(response)
        console.log(objetoEnviar)
    };


    return (
        <div className="contenedor" style={{ fontFamily: 'Arial, sans-serif', display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
            <div className="formulario" style={{ width: "100%", maxWidth: "800px", backgroundColor: "white", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", padding: "20px" }}>
                <div className="encabezado" style={{ color: '#2196F3', marginBottom: "20px", borderBottom: "1px solid #e0e0e0", paddingBottom: "15px" }}>
                    <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "5px" }}>Formulario: Reporte de Fallas - Área de Mantenimiento</h2>
                    <p style={{ fontSize: "14px", color: "#757575" }}>Descripción del formulario (opcional)</p>
                </div>
                <div className="pregunta" style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px", color: "#333" }}>Seleccione El Personal:
                        <span style={{ color: "red" }}>*</span>
                    </label>
                    <SelectPersonal pasarSetPersonal={setPersonalSeleccionado}/>

                </div>
                <div className="pregunta" style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px", color: "#333" }}>Seleccione la placa del vehículo:
                        <span style={{ color: "red" }}>*</span>
                    </label>
                    <SelectUnidad pasarSetUnidad={setUnidadSeleccionada} />
                </div>

                <div className="Preguntas" style={{ display: "flex", gap: "20px", width: "100%" }}>
                    <div className="pregunta" style={{ marginBottom: "20px", width: "100%" }}>
                        <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px", color: "#333" }}>Kilometraje Actual:
                            <span style={{ color: "red" }}>*</span>
                        </label>
                        <InputText style={{ width: '100%' }} value={kilometraje} onChange={(e) => setKilometraje(e.target.value)} />
                    </div>
                    <div className="pregunta" style={{ marginBottom: "20px", width: "100%" }}>
                        <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px", color: "#333" }}>Horómetro Actual:
                            <span style={{ color: "red" }}>*</span>
                        </label>
                        <InputText style={{ width: '100%' }} value={horometro} onChange={(e) => setHorometro(e.target.value)} />
                    </div>
                    <div className="pregunta" style={{ marginBottom: "20px", width: "100%" }}>
                        <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px", color: "#333" }}>Fecha y Hora del Reporte:
                            <span style={{ color: "red" }}>*</span>
                        </label>
                        <Calendar id="calendar-24h" value={fechaHora} onChange={(e) => setFechaHora(e.value)} showTime hourFormat="24" />
                    </div>
                </div>
                <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px", color: "#333" }}>Tipo de Falla:
                    <span style={{ color: "red" }}>*</span>
                </label>
                <div className="flex flex-column gap-3">
                    {categories.map((category) => {
                        return (
                            <div key={category.key} className="flex align-items-center" style={{ marginBottom: "10px", display: 'flex', gap: "10px" }}>
                                <Checkbox inputId={category.key} name="category" value={category} onChange={onCategoryChange} checked={selectedCategories.some((item) => item.key === category.key)} />
                                <label htmlFor={category.key} className="ml-2">
                                    {category.name}
                                </label>
                            </div>
                        );
                    })}
                </div>
                <div className="preguntas" style={{ display: "flex", gap: "20px", width: "100%" }}>
                    <div className="pregunta" style={{ marginBottom: "20px", width: '100%' }}>
                        <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px", color: "#333" }}>Descripción detallada de la falla:
                            <span style={{ color: "red" }}>*</span>
                        </label>
                        <InputText style={{ width: '100%' }} value={descripcionFalla} onChange={(e) => setDescripcionFalla(e.target.value)} />
                    </div>
                    <div className="pregunta" style={{ marginBottom: "20px", width: '100%' }}>
                        <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px", color: "#333" }}>Ubicación donde ocurrió la falla:
                            <span style={{ color: "red" }}>*</span>
                        </label>
                        <InputText style={{ width: '100%' }} value={ubicacionFalla} onChange={(e) => setUbicacionFalla(e.target.value)} />
                    </div>
                </div>
                <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px", color: "#333" }}>¿La falla impide el movimiento del vehículo?
                    <span style={{ color: "red" }}>*</span>
                </label>
                {fallas.map((falla) => {
                    return (
                        <div key={falla.key} className="flex align-items-center" style={{ marginBottom: "10px", display: 'flex', gap: "10px" }}>
                            <Checkbox inputId={falla.key} name="category" value={falla} onChange={onFallaChange} checked={selectFalla.some((item) => item.key === falla.key)} />
                            <label htmlFor={falla.key} className="ml-2">
                                {falla.name}
                            </label>
                        </div>
                    );
                })}
                <Button label="Confirmar" icon="pi pi-check" className="p-button-primary" onClick={handleConfirmar} />
            </div>
        </div>
    );
}