//Input con Slider
import { Dialog } from "primereact/dialog";
import { Button } from 'primereact/button';
import { useContext, useState } from "react";
import { SelectUnidad } from "../Components/SelectUnidad";
import { InputText } from "primereact/inputtext";
import { SelectTipoFalla } from "../Components/SelectTipoFalla";
import { SelectOperacion } from "../Components/SelectOperacion";
import UseCreateFormulario from "../Hooks/UseCreateFormulario";
import { getFormulario } from "../Services/ApiFormulario";
import { AuthContext } from "../../../context/AuthContext";

const ModalCrearFormulario = ({ pasarSetData }) => {
    //hooks
    const { Create } = UseCreateFormulario()
    //token
    const {obtenerToken}=useContext(AuthContext)
    
    const [abrirModal, setAbrirModal] = useState(false);
    const [unidadSeleccionada, setUnidadSeleccionada] = useState(null);
    const [kilometraje, setKilometraje] = useState('');
    const [horometro, setHorometro] = useState('');
    const [fechaHora, setFechaHora] = useState('');
    const [tipoFallaSeleccionada, setTipoFallaSeleccionada] = useState(null);
    const [descripcionFalla, setDescripcionFalla] = useState('');
    const [ubicacionFalla, setUbicacionFalla] = useState('');
    const [operacionSeleccionada, setOperacionSeleccionada] = useState(null);

    const AbrirModal = () => {
        setAbrirModal(true);
    };

    const CerrarModal = () => {
        setAbrirModal(false);
        setUnidadSeleccionada(null);
        setKilometraje('');
        setHorometro('');
        setFechaHora('');
        setTipoFallaSeleccionada(null);
        setDescripcionFalla('');
        setUbicacionFalla('');
        setOperacionSeleccionada(null);
    };

    const handleConfirmar = async () => {
        const token=obtenerToken()
        const respuestas = [
            unidadSeleccionada,
            kilometraje,
            horometro,
            fechaHora,
            tipoFallaSeleccionada,
            descripcionFalla,
            ubicacionFalla,
            operacionSeleccionada,
        ];
        const objetoEnviar = {
            respuestas: respuestas
        };
        const response = await Create(objetoEnviar)
        const ResponseServer= await getFormulario(token)
        pasarSetData(ResponseServer)
        console.log(response)
        CerrarModal();
    };

    const footer = (
        <div className="botonesFooter" style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={CerrarModal} />
            <Button label="Confirmar" icon="pi pi-check" className="p-button-primary" onClick={handleConfirmar} />
        </div>
    );


    return (
        <>
            <Button icon='pi pi-plus' label="Crear Formulario" outlined onClick={AbrirModal} />
            <Dialog
                header={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div className="header1" style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ fontSize: '26px', color: '#3B75F1' }}>Generar movimiento</label>
                        <label style={{ fontSize: '18px', fontWeight: 'normal' }}>En esta sección usted puede generar un nuevo movimiento</label>
                        <div className="card">
                        </div>
                    </div>
                    <Button icon="pi pi-times" rounded text severity="danger" aria-label="Cancel" onClick={CerrarModal} />
                </div>}
                visible={abrirModal}
                style={{ width: '45%', minWidth: '300px' }}
                footer={footer}
                onHide={CerrarModal}
                closable={false}
            >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ marginTop: "20px", width: "100%", display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <SelectUnidad pasarSetUnidad={setUnidadSeleccionada} value={unidadSeleccionada} />
                        <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                            <label htmlFor="kilometraje" style={{ color: '#344054' }}>Kilometraje Actual</label>
                            <InputText
                                id="kilometraje"
                                name='kilometraje'
                                type="text"
                                className="w-full"
                                value={kilometraje}
                                onChange={(e) => setKilometraje(e.target.value)}
                            />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                            <label htmlFor="horometro" style={{ color: '#344054' }}>Horómetro Actual</label>
                            <InputText
                                id="horometro"
                                name='horometro'
                                type="text"
                                className="w-full"
                                value={horometro}
                                onChange={(e) => setHorometro(e.target.value)}
                            />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                            <label htmlFor="fecha_hora" style={{ color: '#344054' }}>Fecha y Hora</label>
                            <InputText
                                id="fecha_hora"
                                name='fecha_hora'
                                type="text"
                                className="w-full"
                                value={fechaHora}
                                onChange={(e) => setFechaHora(e.target.value)}
                            />
                        </div>
                        <SelectTipoFalla pasarSetTipoFalla={setTipoFallaSeleccionada} value={tipoFallaSeleccionada} />
                        <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                            <label htmlFor="descripcion_falla" style={{ color: '#344054' }}>Descripción detallada de la falla</label>
                            <InputText
                                id="descripcion_falla"
                                name='descripcion_falla'
                                type="text"
                                className="w-full"
                                value={descripcionFalla}
                                onChange={(e) => setDescripcionFalla(e.target.value)}
                            />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                            <label htmlFor="ubicacion_falla" style={{ color: '#344054' }}>Ubicación de la falla</label>
                            <InputText
                                id="ubicacion_falla"
                                name='ubicacion_falla'
                                type="text"
                                className="w-full"
                                value={ubicacionFalla}
                                onChange={(e) => setUbicacionFalla(e.target.value)}
                            />
                        </div>
                        <SelectOperacion pasarSetOperacion={setOperacionSeleccionada} value={operacionSeleccionada} />
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default ModalCrearFormulario;