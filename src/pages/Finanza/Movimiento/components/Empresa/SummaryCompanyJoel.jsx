import { InputText } from "primereact/inputtext";
import UseGetCompanyJoel from "../../hooks/Empresa/UseGetCompanyJoel";
import { Card } from "primereact/card";
import { Message } from "primereact/message";

export const SummaryCompanyJoel = () => {
    //hooks
    const { company } = UseGetCompanyJoel();
    return (
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", padding: "0" }}>
            <Card style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                    <a style={{ color: '#999', fontWeight: 'bold' }}>{company.nombre_empresa}</a>
                </div>
                <div className="movimiento" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '40px' }}>
                    <div className="ingresos">
                        <Message
                            style={{ background: 'rgba(228, 248, 240, 0.7)', color: '#1ea97c', gap: '10px' }}
                            text="Ingresos"
                            icon={<i className="pi pi-chevron-circle-up" style={{ color: '#1ea97c' }} />}
                        />
                        <p style={{ margin: '0' }}>${company.total_ingreso_dolares?.toLocaleString() || "0"}</p>
                        <p style={{ margin: '0' }}>S{company.total_ingreso_soles?.toLocaleString() || "0"}</p>
                    </div>
                    <div className="egresos">
                        <Message
                            style={{ background: 'rgba(255, 231, 230, 0.7)', color: '#ff5757', gap: '10px' }}
                            severity="error"
                            text="Egresos"
                            icon={<i className="pi pi-chevron-circle-down" style={{ color: '#ff5757' }} />}
                        />
                        <p style={{ margin: '0' }}>${company.total_egreso_dolares?.toLocaleString() || "0"}</p>
                        <p style={{ margin: '0' }}>S{company.total_egreso_soles?.toLocaleString() || "0"}</p>
                    </div>
                </div>
            </Card>
        </div>
    );
};
