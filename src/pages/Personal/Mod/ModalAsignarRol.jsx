import React, { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from "primereact/dropdown";
// Importar Axios
import axios from "axios";
// Importar ReactPrime Confirmar Dialogo
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
export const ModalAsignarRol = ({ pasarAbrirModalAsignar, pasarCerrarModalAsignar, pasarPersonalSeleccionado }) => {
    //traer token
    const {obtenerToken}=useContext(AuthContext)
    //#region Estado para traer los Roles
    const [rol, setRol] = useState([]);
    const [rolSeleccionado, setRolSeleccionado] = useState("");

    const ControlarOpcionRol = (e) => {
        const rolSeleccionado = e.value;
        setRolSeleccionado(rolSeleccionado);
    };

    useEffect(() => {
        const ObtenerRol = async () => {
            try {
                const token = obtenerToken();
                if (token) {
                    const respuesta = await axios.get("https://jwmalmcenb-production.up.railway.app/api/almacen/rol/get", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const RolFiltrado=respuesta.data.data.map(rol=>({
                        ...rol,
                        filtro:`${rol.id} ${'>'} ${rol.nombre}`
                    }))
                    setRol(RolFiltrado);
                } else {
                    console.log("No se encontró un token de autenticación válido");
                }
            } catch (error) {
                console.error("Error al obtener Rol:", error);
            }
        };
        ObtenerRol();
    }, []);

    //#region Estado para asignarRol
    const AsignarRol = async () => {
        try {
            const token = obtenerToken();
            if (token && rolSeleccionado && pasarPersonalSeleccionado) {
                console.log("Datos que se enviarán:", rolSeleccionado);
                const data = {
                    rol: [rolSeleccionado.id]
                };
                const respuestaCategoria = await axios.post(`https://jwmalmcenb-production.up.railway.app/api/almacen/personal/asignar_rol/${pasarPersonalSeleccionado.id}`, data, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                // console.log("Respuesta del servidor:", respuestaCategoria);
                const mensajeDelServidor = respuestaCategoria.data.resp
                // Mostrar un mensaje de éxito con React Prime
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: mensajeDelServidor, life: 3000 });
                // Cerrar el modal después de agregar la categoría
                pasarCerrarModalAsignar();
            } else {
                toast.current.show({ severity: 'info', summary: 'Observación', detail: 'Seleccione un Tipo de Rol', life: 3000 });
            }
        } catch (error) {
            console.error("Error al asignar rol:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Error al asignar rol: ${error.message}`, life: 3000 });
        }
    };

    //#region Estado Para Confirmacion
    const toast = useRef(null);

    const reject = () => {
        toast.current.show({ severity: 'error', summary: 'Cancelado', detail: 'Asignación de rol cancelada', life: 3000 });
    };

    const confirmarAsignacion = () => {
        confirmDialog({
            message: '¿Está seguro de que desea asignar este rol?',
            header: 'Confirmar Asignación',
            icon: 'pi pi-exclamation-triangle',
            accept: AsignarRol,
            reject
        });
    };
    //#region Estado para Actualizar el nombre completo cuando cambiar el personal seleccionado
    const [nombreCompleto, setNombreCompleto] = useState('')
    useEffect(() => {
        if (pasarPersonalSeleccionado) {
            const nombreCompleto = `${pasarPersonalSeleccionado.nombre} ${pasarPersonalSeleccionado.apellido}`;
            setNombreCompleto(nombreCompleto);
        }
    }, [pasarPersonalSeleccionado]);

    const itemTemplate = (opciones) => {
        return (
            <div>
                <span style={{ fontWeight: 'bold' }}>{opciones.id}</span> {" > "}  {opciones.nombre}
            </div>
        );
    };
    const footer = (
        <div>
            <Button label="Guardar" className="p-button-success" onClick={confirmarAsignacion} />
            <Button label="Cancelar" onClick={pasarCerrarModalAsignar} className="p-button-secondary" />
        </div>
    );

    return (
        <>
            {/* Confirmacion */}
            <Toast ref={toast} />
            <ConfirmDialog />
            {/* Contenido */}
            <Dialog
                header={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '50px' }}>
                    <h3>Asignar Rol</h3>
                    <Button onClick={pasarCerrarModalAsignar} icon="pi pi-times" rounded text severity="danger" aria-label="Cancel" />
                </div>}
                visible={pasarAbrirModalAsignar}
                style={{ width: '20%', minWidth: '300px' }}
                footer={footer}
                onHide={pasarCerrarModalAsignar}
                closable={false}
            >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ marginTop: "20px", width: "100%", display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        <FloatLabel>
                            <InputText id="nombre" name="nombre" value={nombreCompleto} style={{ width: '100%' }} disabled />
                            <label htmlFor="nombre" style={{ textAlign: "center" }}>Personal Seleccionado</label>
                        </FloatLabel>
                        <div style={{ width: '100%', margin: '0 auto' }}>
                            <FloatLabel>
                                <Dropdown
                                    id="rol"
                                    value={rolSeleccionado}
                                    options={rol}
                                    onChange={ControlarOpcionRol}
                                    optionLabel="filtro"
                                    placeholder="Seleccione un Proveedor"
                                    style={{ width: '100%' }}
                                    filter
                                    filterBy="filtro"
                                    itemTemplate={itemTemplate}
                                    showClear
                                />
                                <label htmlFor="rol">Seleccione un Rol</label>
                            </FloatLabel>
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    );
};
