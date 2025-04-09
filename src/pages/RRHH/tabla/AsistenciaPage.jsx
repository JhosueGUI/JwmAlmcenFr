import React, { useEffect, useState } from "react";
import axios from "axios";
import { BsFuelPumpFill } from "react-icons/bs";

export function AsistenciaPage() {
    // const [vehiculos, setVehiculos] = useState([]);
    // const API_URL = "https://v2api.frotcom.com/v2/vehicles?includeSensors=true&api_key=521e4a8c-70a8-4ff4-bcd3-202632418629";
    // const GOOGLE_MAPS_API_KEY = "AIzaSyAv-bbCgMHnfy6z-9iu-2daDf9Wv6YbWm0"; // Reemplaza con tu API Key

    // useEffect(() => {
    //     const fetchVehiculos = async () => {
    //         try {
    //             const response = await fetch(API_URL);
    //             if (!response.ok) throw new Error("Error al obtener los datos");
    //             const data = await response.json();

    //             // Obtener direcciones y ciudades para cada vehículo
    //             const vehiculosConDirecciones = await Promise.all(
    //                 data.map(async (vehiculo) => {
    //                     if (vehiculo.latitude && vehiculo.longitude) {
    //                         try {
    //                             const addressResponse = await axios.get(
    //                                 `https://maps.googleapis.com/maps/api/geocode/json?latlng=${vehiculo.latitude},${vehiculo.longitude}&key=${GOOGLE_MAPS_API_KEY}`
    //                             );
    //                             if (addressResponse.data.results.length > 0) {
    //                                 vehiculo.direccion = addressResponse.data.results[0].formatted_address;
    //                                 // Obtener la ciudad del resultado
    //                                 const cityComponent = addressResponse.data.results[0].address_components.find(component =>
    //                                     component.types.includes('locality') || component.types.includes('administrative_area_level_3')
    //                                 );
    //                                 vehiculo.ciudad = cityComponent ? cityComponent.long_name : "Ciudad no encontrada";
    //                             } else {
    //                                 vehiculo.direccion = "Dirección no encontrada";
    //                                 vehiculo.ciudad = "Ciudad no encontrada";
    //                             }
    //                         } catch (error) {
    //                             console.error("Error al obtener la dirección:", error);
    //                             vehiculo.direccion = "Error al obtener la dirección";
    //                             vehiculo.ciudad = "Error al obtener la ciudad";
    //                         }
    //                     } else {
    //                         vehiculo.direccion = "N/A";
    //                         vehiculo.ciudad = "N/A";
    //                     }
    //                     return vehiculo;
    //                 })
    //             );

    //             setVehiculos(vehiculosConDirecciones);
    //         } catch (error) {
    //             console.error("Error:", error);
    //         }
    //     };

    //     fetchVehiculos();
    //     const interval = setInterval(fetchVehiculos, 600);

    //     return () => clearInterval(interval);
    // }, []);

    return (
        <div className="contenedor" style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
            <div className="general" style={{ display: "flex", width: "100%", gap: "50px" }}>
                <div className="contenido" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                    <div className="tabla-contenedor" style={{ width: "100%" }}>
                        {/* <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                    <th>Unidad</th>
                                    <th>Conductor</th> */}
                                    {/* <th>Dirección</th> */}
                                    {/* <th>Ciudad</th> */}
                                    {/* <th>KM / H</th> */}
                                    {/* <th>Estado</th>
                                    <th>Combustible</th>
                                </tr>
                            </thead> */}
                            {/* <tbody>
                                {vehiculos.length > 0 ? (
                                    vehiculos.map((vehiculo) => (
                                        <tr key={vehiculo.id}>
                                            <td style={{ color: vehiculo.speed > 0 ? 'green' : 'red' }}>{vehiculo.licensePlate}</td>
                                            <td>{vehiculo.driverName}</td> */}
                                            {/* <td>{vehiculo.direccion || "N/A"}</td> */}
                                            {/* <td>{vehiculo.ciudad || "N/A"}</td> */}
                                            {/* <td>{vehiculo.speed || ""}</td>
                                            <td>{vehiculo.speed > 0 ? "En ruta" : "Parado"}</td>
                                            <td><BsFuelPumpFill /></td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: "center" }}>Cargando datos...</td>
                                    </tr>
                                )} */}
                            {/* </tbody> */}
                        {/* </table> */}
                    </div>
                </div>
            </div>
        </div>
    );
}