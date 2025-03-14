//Input con Slider
import { Dialog } from "primereact/dialog";
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useContext, useEffect, useState } from "react";
import { DataMovimiento } from "../data/DataMovimiento";
import { SeleccionarEstado } from "../components/SeleccionarEstado";
import { SeleccionarRendicion } from "../components/SeleccionarRendicion";
import { SeleccionarCategoria } from "../components/SeleccionarCategoria";
import UsarCrearTrazabilidad from "../hooks/UsarCrearTrazabilidad";
import { AuthContext } from "../../../../context/AuthContext";

const ModalTrazabilidadMovimiento = ({ pasarAbrirModal, pasarCerrarModal, pasarMovimientoSeleccionado }) => {

    //hooks
    const { CrearTrazabilidad } = UsarCrearTrazabilidad();

    //estado para la data
    const [dataMovimiento, setDataMovimiento] = useState(DataMovimiento)

    useEffect(() => {
        if (pasarMovimientoSeleccionado) {
            ///no me trae por que no lo tengo en mi tabla
            setDataMovimiento({
                solicitante: pasarMovimientoSeleccionado.solicitante,
                sub_destino_placa: pasarMovimientoSeleccionado.sub_destino_placa,
                sub_categoria_id: pasarMovimientoSeleccionado.sub_categoria_id,
                estado_id: pasarMovimientoSeleccionado.estado_id,
                rendicion_id: pasarMovimientoSeleccionado.rendicion_id,
                serie: pasarMovimientoSeleccionado.serie,
                n_factura: pasarMovimientoSeleccionado.n_factura,
                fecha_factura: pasarMovimientoSeleccionado.fecha_factura,
                obs: pasarMovimientoSeleccionado.obs,
                n_retencion: pasarMovimientoSeleccionado.n_retencion,
                fecha_retencion: pasarMovimientoSeleccionado.fecha_retencion,
                estado_nombre: pasarMovimientoSeleccionado.estado,
            });
        }
    }, [pasarMovimientoSeleccionado])

    const handleEstado = (estadoId) => {
        setDataMovimiento(prevState => ({
            ...prevState,
            estado_id: estadoId,
        }));
    };
    const handleRendicion = (rendicionId) => {
        setDataMovimiento(prevState => ({
            ...prevState,
            rendicion_id: rendicionId,
        }));
    };
    const handleSubCategoria = (subCategoriaId) => {
        setDataMovimiento(prevState => ({
            ...prevState,
            sub_categoria_id: subCategoriaId,
        }));
    };


    const crear = async () => {
        const respuesta = await CrearTrazabilidad(dataMovimiento, pasarMovimientoSeleccionado.id);
        pasarCerrarModal();
        console.log('dataMovimiento:', respuesta);

    }

    const footer = (
        <div className="botonesFooter" style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={pasarCerrarModal} />
            <Button label="Confirmar" icon="pi pi-check" className="p-button-primary" onClick={crear} />
        </div>
    );


    return (
        <>
            <Dialog
                header={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div className="header1" style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ fontSize: '26px', color: '#3B75F1' }}>Trazabilidad</label>
                        <label style={{ fontSize: '18px', fontWeight: 'normal' }}>En esta sección usted puede realizar el flujo </label>

                    </div>

                    <Button icon="pi pi-times" rounded text severity="danger" aria-label="Cancel" onClick={pasarCerrarModal} />
                </div>}
                visible={pasarAbrirModal}
                style={{ width: '45%', minWidth: '300px' }}
                footer={footer}
                onHide={pasarCerrarModal}
                closable={false}
            >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ marginTop: "20px", width: "100%", display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ display: "flex", gap: "20px" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                                <label htmlFor="solicitante" style={{ color: '#344054' }}>Solicitante</label>
                                <InputText value={dataMovimiento.solicitante || ""} id="solicitante" name='solicitante' type="text" className="w-full" onChange={(e) => setDataMovimiento({ ...dataMovimiento, solicitante: e.target.value })} />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                                <label htmlFor="sub_destino_placa" style={{ color: '#344054' }}>Sub destino placa</label>
                                <InputText value={dataMovimiento.sub_destino_placa || ""} id="sub_destino_placa" name='sub_destino_placa' type="text" className="w-full" onChange={(e) => setDataMovimiento({ ...dataMovimiento, sub_destino_placa: e.target.value })} />
                            </div>
                        </div>
                        <SeleccionarCategoria pasarSetSubCategoria={handleSubCategoria} />
                        <div className="1" style={{ display: "flex", gap: "20px" }}>
                            <div className="1 1" style={{ width: "100%" }}>
                                <SeleccionarEstado pasarMovimientoSeleccionado={pasarMovimientoSeleccionado} pasarSetEstado={handleEstado} />

                            </div>
                            <div className="1 2" style={{ width: "100%" }}>
                                <SeleccionarRendicion pasarMovimientoSeleccionado={pasarMovimientoSeleccionado} pasarSetRendicion={handleRendicion} />
                            </div>
                        </div>
                        <div className="2" style={{ display: "flex", gap: "20px", width: "100%" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                                <label htmlFor="serie" style={{ color: '#344054' }}>Serie</label>
                                <InputText id="serie" name='serie' type="text" className="w-full" value={dataMovimiento.serie || ""} onChange={(e) => setDataMovimiento({ ...dataMovimiento, serie: e.target.value })} />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                                <label htmlFor="n_factura" style={{ color: '#344054' }}>N° Factura</label>
                                <InputText id="n_factura" name='n_factura' type="text" className="w-full" value={dataMovimiento.n_factura || ""} onChange={(e) => setDataMovimiento({ ...dataMovimiento, n_factura: e.target.value })} />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                                <label htmlFor="fecha_factura" style={{ color: '#344054' }} >Fecha Factura</label>
                                <InputText id="fecha_factura" name='fecha_factura' type="text" className="w-full" value={dataMovimiento.fecha_factura || ""} onChange={(e) => setDataMovimiento({ ...dataMovimiento, fecha_factura: e.target.value })} />
                            </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                            <label htmlFor="obs" style={{ color: '#344054' }}>OBS</label>
                            <InputText id="obs" name='obs' type="text" className="w-full" value={dataMovimiento.obs || ""} onChange={(e) => setDataMovimiento({ ...dataMovimiento, obs: e.target.value })} />

                        </div>
                        <div className="3" style={{ display: "flex", gap: "20px", width: "100%" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                                <label htmlFor="n_retencion" style={{ color: '#344054' }}>N° Retención</label>
                                <InputText id="n_retencion" name='n_retencion' type="text" className="w-full" value={dataMovimiento.n_retencion || ""} onChange={(e) => setDataMovimiento({ ...dataMovimiento, n_retencion: e.target.value })} />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                                <label htmlFor="fecha_retencion" style={{ color: '#344054' }}>Fecha Retención</label>
                                <InputText id="fecha_retencion" name='fecha_retencion' type="text" className="w-full" value={dataMovimiento.fecha_retencion || ""} onChange={(e) => setDataMovimiento({ ...dataMovimiento, fecha_retencion: e.target.value })} />
                            </div>
                        </div>

                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default ModalTrazabilidadMovimiento;