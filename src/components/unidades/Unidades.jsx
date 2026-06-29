import React from "react";
import axios from "axios";
import { urlApi } from "../../services/apirest";
import {confirm} from "../Confirmation";
import FormularioUnidad from "./FormularioUnidad";

class Unidades extends React.Component {
    //Trabajar código JavaScript
    state = {
        registros: [],
        pagina_actual: 1,
        cadena_busqueda: "",
        token: localStorage.getItem('token'),
        total_paginas: 0,
        limite: 10,
        mostrarModal: false,
        usuarioSeleccionado: null
    }

    mostrarModalNuevo = () =>{
        this.setState({
            mostrarModal: true,
            usuarioSeleccionado: null 
        })
    }

    mostrarModalEditada = (id) =>{
        this.setState({
            mostrarModal: true,
            usuarioSeleccionado: id 
        })
    }

    cerrarModal = () =>{
        this.setState({mostrarModal: false})
    }

    alGuardar = () => {
        this.cargarDatos(); //recarga datos
        this.cerrarModal(); //cierra la ventana modal despues de guardar
    }



    componentDidMount = () => {
        this.cargarDatos();
    }

    paginaSiguiente = () => {
        if (this.state.pagina_actual < this.state.total_paginas) {
            this.setState(
                {pagina_actual: this.state.pagina_actual+1},
                () => {this.cargarDatos() }
            )
        }
    }

    paginaAnterior = () => {
        if (this.state.pagina_actual > 1) {
            this.setState(
                {pagina_actual: this.state.pagina_actual-1},
                () => {this.cargarDatos() }
            )
        }
    }

    cargarDatos = () => {
        let url = urlApi +"unidades?page="+ this.state.pagina_actual + "&string="+ this.state.cadena_busqueda + "&limit=" + this.state.limite;
        axios
            .get(url, { headers: { 'Authorization': `Bearer ${this.state.token}`}})
            .then(response => {
                this.setState({
                    registros: response.data.data,
                    total_paginas: response.data.totalPage
                })
            })
            .catch(error => {
                const { notificacion } = this.props;
                notificacion(error);
            })
    }

    busqueda = async e => {
        if (e.charCode === 13) {
            this.setState({
                cadena_busqueda: e.target.value,
                pagina_actual: 1
            }, ()=> {this.cargarDatos() })
        }
    }

    eliminar = async(id, nombre) => {
        if (await confirm('¿Desea eliminar la unidad actual ' + nombre + '?')) {
            const {notificacion} = this.props;
            const url = urlApi + "Unidades/" + id;
            axios
                .delete(url, { headers: { 'Authorization': `Bearer ${this.state.token}`}})
                .then(response => {
                    this.cargarDatos();
                })
                .catch(error => {
                    notificacion( error.response.data.error || 'Error al eliminar' + error)
                })
        }
    }

    render() {
        return(
            <div>
                
                <div className="col-10 position-absolute top-0 start-50 translate-middle-x">
                    <h1>Unidades</h1>
                    <button className="btn btn-success" onClick={this.mostrarModalNuevo}>Nuevo registro</button>
                    <input type="text" onKeyPress={this.busqueda} className="form-control" placeholder="Búsqueda por usuario, nombre de unidad"></input>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">usuario</th>
                                <th scope="col">nombre de unidad</th>
                                <th scope="col">tipo</th>
                                <th scope="col">ubicacion</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.registros.map((value, index) => {//Recorrer los registros
                                return (
                                    <tr key={index}>
                                        <th scope="row">{value.id_unidad}</th>
                                        <td>{value.usuario}</td>
                                        <td>{value.nombre_unidad}</td>
                                        <td>{value.tipo}</td>
                                        <td>{value.ubicacion}</td>
                                        <td>
                                            <svg
                                                onClick={()=>this.mostrarModalEditada(value)}
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="28"
                                                height="28"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="#007aff"
                                                strokeWidth="1"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                                <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                                <path d="M16 5l3 3" />
                                            </svg>
                                            
                                            <svg
                                                onClick={()=>this.eliminar(value.id_unidad, value.nombre)}
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="28"
                                                height="28"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="#ff2d55"
                                                strokeWidth="1"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M4 7l16 0" />
                                                <path d="M10 11l0 6" />
                                                <path d="M14 11l0 6" />
                                                <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                                                <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                                            </svg>

                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>

                        <button type="button" className="btn btn-secondary" onClick={this.paginaAnterior} style={{marginRight: "10px"}}>Anterior</button>
                        <input type="text" readOnly value={this.state.pagina_actual + "de" + this.state.total_paginas} style={{marginRight: "10px", textAlign: "center", width: "120px"}}/>
                        <button type="button" className="btn btn-secondary" onClick={this.paginaSiguiente}>Siguiente</button>

                </div>

                {this.state.mostrarModal && (
                    <div className="modal-overlay" style={modalStyles.overlay}>
                        <div className="modal-content" style={modalStyles.content}>
                            <FormularioUnidad
                            unidadAEditar = {this.state.usuarioSeleccionado}
                            onClose = {this.cerrarModal}
                            onGuardar = {this.alGuardar}
                            notificacion = {this.props.notificacion}
                            />
                        </div>
                    </div> 

                )}

            </div>
        );
    }
}

//Estilos para ventana modal
const modalStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    },
    content: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto'
    }
}

export default Unidades;