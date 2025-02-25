import { Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { LoginPage } from "../pages/Login/LoginPage";
import { PersonalPage } from "../pages/Personal/Table/PersonalPage";
import { InventarioPage } from "../pages/Inventario/Table/InventarioPage";
import { ProveedorPage } from "../pages/Proveedor/Table/ProveedorPage";
import { IngresoPage } from "../pages/Ingreso/Table/IngresoPage";
import { SalidaPage } from "../pages/Salida/Table/SalidaPage";
import { OrdenDeCompra } from "../pages/OrdenDeCompra/Table/OrdenDeCompraPage";
import { FlotaPage } from "../pages/Flota/Table/FlotaPage";
import { Sidebar } from "../components/Sidebar";
import Content from "../layout/Content/Content";
import { RolesPage } from "../pages/Roles/Table/RolesPage";
import { ReporteGraficoFiltro } from "../pages/Reportes/Filtro/ReporteGraficoFiltro";
import { ReporteGraficoEpps } from "../pages/Reportes/Epps/ReporteGraficoEpps";
import { ReporteGraficoImplemento } from "../pages/Reportes/Implementos/ReporteGraficoImplemento";
import { Home } from "../pages/Home";
import { MovimientoPage } from "../pages/Finanza/Movimiento/tabla/MovimientoPage";
import { AsistenciaPage } from "../pages/RRHH/tabla/AsistenciaPage";

export const RouteApp = () => {
  // Traemos al usuario autenticado
  const { autenticadoState } = useContext(AuthContext);
  const usuarioAutenticado = autenticadoState.autenticado;
  const accesos = autenticadoState.accesos;

  // Define los componentes asociados a cada ruta
  const rutasComponentes = {
    'Inventario': InventarioPage,
    'Salida': SalidaPage,
    'Ingreso': IngresoPage,
    'Orden de Compra': OrdenDeCompra,

    'Asistencias': AsistenciaPage,
    'Horarios': AsistenciaPage,
    
    'Movimientos': MovimientoPage,
    'Proveedor': ProveedorPage,
    'Personal': PersonalPage,
    'Flota': FlotaPage,
    'Roles': RolesPage,
    'Reportes': RolesPage,
    'Rep Productos': ReporteGraficoFiltro,
    'EPPS': ReporteGraficoEpps,
    'Mantenimiento': InventarioPage,
    'Implementos': ReporteGraficoImplemento
  };

  // Función para generar rutas
  const renderRoutes = (accesos) => {
    return accesos.flatMap(acceso => {
      const Component = rutasComponentes[acceso.ruta];
      const routes = [];

      if (Component) {
        routes.push(
          <Route key={acceso.id} path={`/${acceso.ruta}`} element={<Component />} />
        );
      }

      if (acceso.sub_acceso && acceso.sub_acceso.length > 0) {
        acceso.sub_acceso.forEach(subAcceso => {
          const SubComponent = rutasComponentes[subAcceso.ruta];
          if (SubComponent) {
            routes.push(
              <Route key={subAcceso.id} path={`/${subAcceso.ruta}`} element={<SubComponent />} />
            );
          }
        });
      }

      return routes;
    });
  };


  return (
    <>
      <div className="app">
        <Sidebar />
        <Content>
          <Routes>
            {usuarioAutenticado ? (
              <>
                <Route path="/" element={<Home />} />
                {renderRoutes(accesos)}
              </>
            ) : (
              <Route path="/*" element={<LoginPage />} />
            )}
          </Routes>
        </Content>
      </div>
    </>
  );
};
