import React from 'react';
export function MovimientoPage() {

    return (
        <>
            <div className="contenedor" style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                <div className="encabezado" style={{ width: '100%', color: '#1A55B0', display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '30px', fontWeight: 'bold' }}> Gestión Financiera </span>
                    <span style={{ color: '#1A55B0', fontSize: '15px' }}>
                    A continuación, se visualiza la lista de los registro de Movimientos Financieros en el sistema
                    </span>
                </div>

                <div className="acciones" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                </div>
                <div className="general" style={{ display: 'flex', width: '100%', gap: '50px' }}>
                    <div className="contenido" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <div className="tabla-contenedor" style={{ width: '100%' }}>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}