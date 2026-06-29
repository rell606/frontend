import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { urlApi } from "../../services/apirest";
//import { SoloLetras } from '../../utils/validaciones';

const FormularioEquipamiento = ({ equipamientoAEditar, onClose, onGuardar, notificacion, abrirModal, datoForaneo, idForaneo }) => {

  // 1. Estado inicial del formulario
  const [form, setForm] = useState({
    nombre_equipo: '',
    tipo: '',
    estado: '',
    cantidad: '',
    fecha_adqui: '',
    id_unidad: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. useEffect: Detectar si estamos en modo EDICIÓN
  useEffect(() => {
    if (equipamientoAEditar) {

      setForm({
        ...equipamientoAEditar,
        // Truco importante: SQL devuelve la fecha completa (ISO), pero el input type="date"
        // solo acepta el formato YYYY-MM-DD. Hacemos un split para cortarla.
        //fecha_hora_alquiler: equipamientoAEditar.fecha_hora_alquiler ? equipamientoAEditar.fecha_hora_alquiler.split('T')[0] : ''
        fecha_adqui: equipamientoAEditar.fecha_adqui
          ? equipamientoAEditar.fecha_adqui.slice(0, 16)
          : ''
      });
    } else {
      setForm({
        nombre_equipo: '', tipo: '', estado: '', cantidad: '', fecha_adqui: '', id_unidad: ''
      });
    }

  }, [equipamientoAEditar]);

  useEffect(() => {
    // Si idForaneo tiene un valor real (no es vacío ni "0")
    if (idForaneo && idForaneo !== "0") {
      setForm(estadoAnterior => ({
        ...estadoAnterior,
        cliente_idcliente: idForaneo // Actualizamos el ID interno del formulario
      }));
    }
  }, [idForaneo]);

  // 3. Manejador de cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
    console.log(form);
  };

  // 4. Envío del formulario (Create o Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = localStorage.getItem('token');

    // Determinar si es POST (crear) o PUT (editar)
    const method = equipamientoAEditar ? 'put' : 'post';
    // Si editamos, agregamos el ID a la URL. Si creamos, usamos la URL base.
    const url = equipamientoAEditar
      ? urlApi + `equipamiento/${equipamientoAEditar.id_equipo}`//Put
      : urlApi + 'equipamiento';//Post

    try {
      await axios({
        method: method,
        url: url,
        data: form,
        headers: { Authorization: `Bearer ${token}` }
      });

      // Si todo sale bien:
      notificacion(equipamientoAEditar ? 'Equipamiento actualizado' : 'Equipamiento registrado');
      onGuardar(); // Llamamos a la función del padre para recargar la tabla
      onClose();   // Cerramos el modal

    } catch (err) {
      // Manejo de errores (ej: Cédula duplicada 409, Error servidor 500)
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Error al guardar');
      } else {
        setError('Ocurrió un error inesperado');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formulario-container">
      <h3>{equipamientoAEditar ? 'Editar Equipo' : 'Nuevo Equipo'}</h3>

      {error && <p className="alert alert-danger">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre Equipo:</label>
          <input
            type="text" name="nombre_equipo" value={form.nombre_equipo} onChange={handleChange}
            required maxLength="50"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Tipo:</label>
          <input
            type="text" name="tipo" value={form.tipo} onChange={handleChange}
            required maxLength="30"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Estado:</label>
          <input
            type="text" name="estado" value={form.estado} onChange={handleChange} //onClick={abrirModal}
            required maxLength="20"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Cantidad:</label>
          <input
            type="number" name="cantidad" value={form.cantidad} onChange={handleChange}
            className="form-control"
          />
        </div>
        
        <div className="form-group">
          <label>Fecha de adquisicion:</label>
          <input
            type="datetime-local" name="fecha_adqui" value={form.fecha_adqui} onChange={handleChange}
            required
            className="form-control" maxLength="10" 
          />
        </div>

        <div className="form-group">
          <label>Id Unidad:</label>
          <input
            type="number" name="id_unidad" value={form.id_unidad} onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="botones-accion" style={{ marginTop: '15px' }}>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          <button type="button" onClick={onClose} className="btn btn-secondary" style={{ marginLeft: '10px' }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioEquipamiento;