import styled from "styled-components";
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Dropdown } from "primereact/dropdown";
import { FloatLabel } from "primereact/floatlabel";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

export function GetProductosSalida({ pasarSetDataSalida,pasarProductoInicial}) {
    //const obtener token
    const {obtenerToken}=useContext(AuthContext)
    const [producto, setProducto] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);

    useEffect(() => {
        const TraerProductos = async () => {
            try {
                const token = obtenerToken();
                if (token) {
                    const respuestaGet = await axios.get("https://jwmalmcenb-production.up.railway.app/api/almacen/producto/get", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const productosConFiltro = respuestaGet.data.data.map(producto => ({
                        ...producto,
                        filtro: `${producto.SKU} ${producto.articulo?.nombre}`
                    }));
                    setProducto(productosConFiltro);
                    if(pasarProductoInicial && pasarProductoInicial.SKU){
                        const productoInicialSeleccionado =productosConFiltro.find(p=> p.SKU === pasarProductoInicial.SKU)
                        if(productoInicialSeleccionado){
                            setProductoSeleccionado(productoInicialSeleccionado)
                        }
                    }
                }
            } catch (error) {
                console.error("Error al obtener Productos:", error);
            }
        };
        TraerProductos();
    }, [pasarProductoInicial]);

    const handleProductoChange = (e) => {
        const productoSeleccionado = e.value;
        setProductoSeleccionado(productoSeleccionado);

        if (productoSeleccionado) {
            pasarSetDataSalida({
                ...productoSeleccionado,
                SKU: productoSeleccionado.SKU
            });
        }
    };

    const itemTemplate = (opciones) => {
        return (
            <div>
                <span style={{ fontWeight: 'bold' }}>{opciones.SKU}</span> {" > "} {opciones.articulo?.nombre}
            </div>
        );
    };

    return (
        <div style={{ width: '100%', margin: '0 auto' }}>
            <FloatLabel>
                <Dropdown
                    id="SKU"
                    value={productoSeleccionado}
                    options={producto}
                    onChange={handleProductoChange}
                    optionLabel="filtro"
                    placeholder="Seleccione un Producto"
                    style={{ width: '100%' }}
                    filter
                    filterBy="filtro"
                    itemTemplate={itemTemplate}
                    showClear
                />
                <label htmlFor="SKU">Seleccione un Producto</label>
            </FloatLabel>
        </div>
    );
}
