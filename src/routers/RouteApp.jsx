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

export const RouteApp = () => {
  // Traemos al usuario autenticado
  const { autenticadoState } = useContext(AuthContext);
  const usuarioAutenticado = autenticadoState.autenticado;
  const accesos = autenticadoState.accesos;

  // Define los componentes asociados a cada ruta
  const rutasComponentes = {
    'Inventario': InventarioPage,
    'Proveedor': ProveedorPage,
    'Personal': PersonalPage,
    'Ingreso': IngresoPage,
    'Salida': SalidaPage,
    'Orden de Compra': OrdenDeCompra,
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
      if (!Component) return [];

      // Renderiza la ruta principal
      const routes = [<Route key={acceso.id} path={`/${acceso.ruta}`} element={<Component />} />];

      // Renderiza las subrutas si existen
      if (acceso.sub_acceso && acceso.sub_acceso.length > 0) {
        routes.push(
          ...acceso.sub_acceso.map(subAcceso => {
            const SubComponent = rutasComponentes[subAcceso.ruta];
            return SubComponent ? (
              <Route
                key={subAcceso.id}
                path={`/${subAcceso.ruta}`}
                element={<SubComponent />}
              />
            ) : null;
          })
        );
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
