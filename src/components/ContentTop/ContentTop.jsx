import { iconsImgs } from "../../utils/images";
import "./ContentTop.css";
import { useContext, useState } from "react";
import { SidebarContext } from "../../context/sidebarContext";
import { RiMenu5Fill } from "react-icons/ri";
import { Button } from "primereact/button";
import { Avatar } from 'primereact/avatar';
import { personalLogo } from '../../utils/images';
import { AuthContext } from "../../context/AuthContext";

import React, { useRef } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { ModalCambiarContra } from "../Contraseña/ModalCambiarContra";

const ContentTop = () => {
    const { toggleSidebar } = useContext(SidebarContext);
    const { autenticadoState,logout } = useContext(AuthContext)
    const usuario = autenticadoState.persona.nombre
    const rol = autenticadoState.roles[0].nombre

    const overlayPanel = useRef(null);

    const [modal,setModal]=useState(false)
    const abrirModal=()=>{
        setModal(true)
    }
    const cerrarModal=()=>{
        setModal(false)
    }
    // console.log(autenticadoState.roles[0])
    return (
        <div className="main-content-top">
            <div className="content-top-left">
                <RiMenu5Fill size={30} style={{ color: '#7998ec', cursor: 'pointer' }} onClick={() => toggleSidebar()} />
            </div>
            <div className="content-top-btns" >
                <div className="card flex flex-wrap justify-content-center gap-3" style={{ display: 'flex', gap: '10px', justifyContent: 'center', justifyItems: 'center', alignItems: 'center' }}>
                    <div className="notifi">
                        <Button className='mensaje' type="button" label="Emails" badge="8" />
                    </div>
                    <div className="mens">
                        <Button className='mensaje' type="button" label="Messages" icon="pi pi-users" outlined badge="2" badgeClassName="p-badge-danger" />
                    </div>
                    <div
                        className="perfil"
                        style={{
                            width: '170px',
                            height: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '10px',
                            padding: '5px',
                            background: 'var(--clr-primary)',
                            borderRadius: '12px',
                            boxShadow: 'rgba(0, 0, 0, 0.05) 0px 8px 24px',

                        }}
                    >
                        <div
                            className="contenido"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                flexGrow: 1,
                            }}
                        >
                            <span
                                className="nombre"
                                style={{
                                    color: '#454545',
                                    textAlign: 'right',
                                    fontWeight: '400',
                                    marginBottom: '-5px'
                                }}
                            >
                                {usuario}
                            </span>
                            <span
                                className="rol"
                                style={{
                                    fontSize: '.875rem',
                                    color: '#d1d1d1',
                                    textAlign: 'right'
                                }}
                            >
                                {rol}
                            </span>
                        </div>
                        <img
                            src={personalLogo.logo_perfil}
                            style={{
                                borderRadius: '100%',
                                width: '45px',
                                height: '45px',
                                background: '#d0e1fd',
                                cursor: 'pointer'
                            }}
                            onClick={(e) => overlayPanel.current.toggle(e)}
                            alt="Profile"
                        />
                    </div>
                    <OverlayPanel ref={overlayPanel} dismissable style={{ width: '11%' }}>
                        <div style={{ display: 'flex', flexDirection: 'column'}}>
                            <Button  icon='pi pi-user' label="Perfil" text style={{ fontSize:'14px',textAlign:'left' }}/>
                            <Button  icon='pi pi-sign-out' label="Cerrar Sesión" text style={{ fontSize:'14px',textAlign:'left' }} onClick={logout}/>
                            <Button  icon='pi pi-cog' label="Cambiar Contraseña" text style={{ fontSize:'14px',textAlign:'left' }} onClick={abrirModal}/>
                        </div>
                    </OverlayPanel>
                </div>
            </div>
            <ModalCambiarContra pasarAbrirModal={modal} pasarCerrarModa={cerrarModal}/>
        </div>
        
    )
}

export default ContentTop
