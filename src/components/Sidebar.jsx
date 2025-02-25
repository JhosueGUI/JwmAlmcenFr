import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { empresaLogo } from '../utils/images';
import "./Sidebar.css";
import { AuthContext } from '../context/AuthContext';
import { SidebarContext } from '../context/sidebarContext';
// Iconos
import { MdOutlineInventory } from "react-icons/md";
import { LiaCheckSquareSolid } from "react-icons/lia";
import { CiLogout } from "react-icons/ci";
import { GiReceiveMoney } from "react-icons/gi";
import { BsFileEarmarkBarGraph } from "react-icons/bs";
import { MdSubdirectoryArrowRight } from "react-icons/md";
import { GoContainer } from "react-icons/go";
import { GrVmMaintenance } from "react-icons/gr";

export const Sidebar = () => {
  const { logout, autenticadoState } = useContext(AuthContext);
  const [openSubMenu, setOpenSubMenu] = useState('');

  const accesosUsuario = autenticadoState.accesos;

  // Iconos para cada una de las rutas
  const IconosRutasMap = {
    'Almacen': <GoContainer size={25} />,
    'Inventario': <MdSubdirectoryArrowRight size={25} />,
    'Ingreso': <MdSubdirectoryArrowRight size={25} />,
    'Salida': <MdSubdirectoryArrowRight size={25} />,
    'Orden de Compra': <MdSubdirectoryArrowRight size={25} />,

    'RRHH': <LiaCheckSquareSolid size={25} />,
    'Asistencias': <MdSubdirectoryArrowRight size={25} />,
    'Horarios': <MdSubdirectoryArrowRight size={25} />,

    'Finanzas': <GiReceiveMoney size={25} />,
    'Movimientos': <MdSubdirectoryArrowRight size={25} />,

    'Proveedor': <MdSubdirectoryArrowRight size={25} />,
    'Personal': <MdSubdirectoryArrowRight size={25} />,

    'Mantenimiento': <GrVmMaintenance size={25} />,
    'Ingreso MMTTO': <MdSubdirectoryArrowRight size={25} />,

    'Administración': <MdOutlineInventory size={25} />,
    'Flota': <MdSubdirectoryArrowRight size={25} />,
    'Roles': <MdSubdirectoryArrowRight size={25} />,
    'Reportes': <BsFileEarmarkBarGraph size={25} />,
    'Rep Productos': <MdSubdirectoryArrowRight size={25} />,
    'EPPS': <MdSubdirectoryArrowRight size={25} />,
    'Implementos': <MdSubdirectoryArrowRight size={25} />,
  };

  const { isSidebarOpen } = useContext(SidebarContext);

  const sidebarClass = isSidebarOpen ? 'sidebar-change' : '';

  const handleSubMenuClick = (nombre) => {
    // Toggle el submenú solo si es necesario
    if (openSubMenu === nombre) {
      setOpenSubMenu('');
    } else {
      setOpenSubMenu(nombre);
    }
  };

  return (
    <div className={`sidebar ${sidebarClass}`}>
      <div className="sidebar-header">
        <div className="user-info">
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <img
              src={empresaLogo.LogoSistema}
              alt="profile image"
              style={{ width: '400px', height: '180px', objectFit: 'contain' }}
            />
          </div>

        </div>
      </div>
      <div className="sidebar-content">
        <nav className="navigation">
          <ul className="nav-list">
            {accesosUsuario.map((ruta) => (
              <React.Fragment key={ruta.id}>
                {ruta.sub_acceso.length === 0 ? (
                  <li className="nav-item">
                    <NavLink
                      to={`/${ruta.ruta}`}
                      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                      {IconosRutasMap[ruta.ruta]}
                      <span className="nav-link-text">{ruta.nombre}</span>
                    </NavLink>
                  </li>
                ) : (
                  <li className="nav-item">
                    <div
                      className={`nav-link ${openSubMenu === ruta.nombre ? 'active' : ''}`}
                      onClick={() => handleSubMenuClick(ruta.nombre)}
                    >
                      {IconosRutasMap[ruta.ruta]}
                      <span className="nav-link-text">{ruta.nombre}</span>
                    </div>
                    <ul className={`sub-menu ${openSubMenu === ruta.nombre ? 'active' : ''}`}>
                      {ruta.sub_acceso.map((sub) => (
                        <li key={sub.id}>
                          <NavLink
                            to={`/${sub.ruta}`}
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                          >
                            {IconosRutasMap[sub.ruta]}
                            <span className="nav-link-text">{sub.nombre}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </li>
                )}
              </React.Fragment>
            ))}
          </ul>
        </nav>
        <div className="sidebar-footer">
          <button
            className="logout"
            onClick={logout}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              cursor: 'pointer'
            }}
          >
            <CiLogout size={25} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
};
