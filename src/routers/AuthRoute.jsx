import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { RouteApp } from "./RouteApp"
import {LoginPage} from "../pages/Login/LoginPage"

export const AuthRoute = () => {
    const {autenticadoState}=useContext(AuthContext)
    console.log(autenticadoState.autenticado)
    return(
        autenticadoState.autenticado ? 
        <RouteApp/>
        :<LoginPage/>
    )
}