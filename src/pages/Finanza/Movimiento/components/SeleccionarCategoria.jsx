import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";
import UsarGetCategoria from "../hooks/UsarGetCategoria";

export const SeleccionarCategoria = ({pasarSetSubCategoria}) => {
    const { data } = UsarGetCategoria();
   
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
    const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState(null);
    const [subcategorias, setSubcategorias] = useState([]);

    useEffect(() => {
        if (categoriaSeleccionada) {
            const categoria = data.find(cat => cat.id === categoriaSeleccionada);
            setSubcategorias(categoria ? categoria.subcategoria : []);
            setSubcategoriaSeleccionada(null); 
        } else {
            setSubcategorias([]);
        }
    }, [categoriaSeleccionada, data]);

    const ManejoDeCategoria=(e)=>{
        const seleccion=e.value;
        setSubcategoriaSeleccionada(seleccion);
        pasarSetSubCategoria(seleccion);
    }

    return (
        <div  style={{ display: "flex", gap: "20px" }}>
            {/* Selección de Categoría */}
            <div style={{ width: "100%" }}>
                <label htmlFor="categoria_id" style={{ color: '#344054' }}>Clasificación</label>
                <Dropdown
                    id="categoria_id"
                    value={categoriaSeleccionada}
                    onChange={(e) => setCategoriaSeleccionada(e.value)}
                    options={data}
                    optionLabel="nombre_categoria"
                    optionValue="id"
                    showClear
                    placeholder="Seleccione una categoría"
                    style={{ width: "100%" }}
                />
            </div>

            {/* Selección de Subcategoría */}
            <div style={{ width: "100%" }}>
                <label htmlFor="subcategoria_id" style={{ color: '#344054' }}>Destino</label>
                <Dropdown
                    id="subcategoria_id"
                    value={subcategoriaSeleccionada}
                    onChange={ManejoDeCategoria}
                    options={subcategorias}
                    optionLabel="nombre_sub_categoria"
                    optionValue="id"
                    showClear
                    placeholder="Seleccione una subcategoría"
                    style={{ width: "100%" }}
                    disabled={!categoriaSeleccionada}
                />
            </div>
        </div>
    );
};
