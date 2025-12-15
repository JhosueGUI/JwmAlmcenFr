// GetAccesos.js
import React, { useState, useEffect, useContext } from 'react';
import axios from "axios";
import { Tree } from 'primereact/tree';
import { AuthContext } from "../../../context/AuthContext";

export function GetAccesos({ pasarSetRoles, personalInicial }) {
    const { obtenerToken } = useContext(AuthContext);
    const [accesosTreeData, setAccesosTreeData] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState({});

    useEffect(() => {
        const getAccesos = async () => {
            try {
                const token = obtenerToken();
                if (token) {
                    const respuestaGet = await axios.get("https://jwmalmcenb-production.up.railway.app/api/almacen/acceso/get", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    // Función para transformar la estructura anidada a formato de Tree
                    const transformToTreeData = (items) => {
                        return items.map(item => ({
                            key: item.id.toString(),
                            label: item.nombre,
                            children: item.sub_acceso && item.sub_acceso.length > 0 ? transformToTreeData(item.sub_acceso) : [],
                            data: item // Mantener el objeto original si lo necesitas
                        }));
                    };

                    const treeData = transformToTreeData(respuestaGet.data.data);
                    setAccesosTreeData(treeData);
                }
            } catch (error) {
                console.log('Error al obtener accesos', error);
            }
        };

        getAccesos();
    }, [personalInicial]);

    const onSelectionChange = (e) => {
        setSelectedKeys(e.value);
        const selectedNodes = Object.keys(e.value)
            .map(key => findNode(accesosTreeData, key))
            .filter(node => node !== null)
            .map(node => {
                console.log("Nodo Seleccionado en GetAccesos:", node.data);
                return node.data;
            });
        pasarSetRoles(selectedNodes);
    };

    // Función auxiliar para encontrar un nodo en la estructura del árbol por su key
    const findNode = (nodes, key) => {
        for (const node of nodes) {
            if (node.key === key) {
                return node;
            }
            if (node.children) {
                const foundNode = findNode(node.children, key);
                if (foundNode) {
                    return foundNode;
                }
            }
        }
        return null;
    };

    return (
        <div className="card flex justify-content-center" style={{ width: '100%' }}>
            <Tree
                value={accesosTreeData}
                selectionMode="checkbox"
                selectionKeys={selectedKeys}
                onSelectionChange={onSelectionChange}
                style={{ width: '100%', border:'1px solid #fff' }}
            />
        </div>
    );
}