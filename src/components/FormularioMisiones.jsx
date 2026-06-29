import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { urlApi } from "../../services/apirest";
//import { SoloLetras } from '../../utils/validaciones';

const FormularioMisiones = ({ misionAEditar, onClose, onGuardar, notificacion, abrirModal, datoForaneo, idForaneo }) => {

  // 1. Estado inicial del formulario
  const [form, setForm] = useState({
    nombre_mision: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_fin: '',
    estado: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. useEffect: Detectar si estamos en modo EDICIÓN
  useEffect(() => {
    if (misionAEditar) {

      setForm({
        ...misionAEditar,
        // Truco importante: SQL devuelve la fecha completa (ISO), pero el input type="date"
        // solo acepta el formato YYYY-MM-DD. Hacemos un split para cortarla.
        //fecha_hora_alquiler: misionAEditar.fecha_hora_alquiler ? misionAEditar.fecha_hora_alquiler.split('T')[0] : ''
        fecha_inicio: misionAEditar.fecha_inicio
          ? misionAEditar.fecha_inicio.slice(0, 16)
          : '',
        fecha_fin: misionAEditar.fecha_fin
          ? misionAEditar.fecha_fin.slice(0, 16)
          : ''
      });
    } else {
      setForm({
        nombre_mision: '', descripcion: '',  fecha_inicio: '', fecha_fin: '', estado: localStorage.getItem('idusuario')
      });
    }

  }, [misionAEditar]);

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
    const method = misionAEditar ? 'put' : 'post';
    // Si editamos, agregamos el ID a la URL. Si creamos, usamos la URL base.
    const url = misionAEditar
      ? urlApi + `misiones/${misionAEditar.id_mision}`//Put
      : urlApi + 'misiones';//Post

    try {
      await axios({
        method: method,
        url: url,
        data: form,
        headers: { Authorization: `Bearer ${token}` }
      });

      // Si todo sale bien:
      notificacion(misionAEditar ? 'Misión actualizada' : 'Misión registrada');
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
      <h3>{misionAEditar ? 'Editar Misión' : 'Nueva Misión'}</h3>

      {error && <p className="alert alert-danger">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text" name="nombre_mision" value={form.nombre_mision} onChange={handleChange}
            required maxLength={40}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Descripción:</label>
          <input
            type="text" name="descripcion" value={form.descripcion} onChange={handleChange}
            className="form-control"
            maxLength={100}
          />
        </div>

        <div className="form-group">
          <label>Fecha/Hora inicio:</label>
          <input
            type="datetime-local" name="fecha_inicio" value={form.fecha_inicio} onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Fecha/Hora fin:</label>
          <input
            type="datetime-local" name="fecha_fin" value={form.fecha_fin} onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Estado:</label>
          <input
            type="text" name="estado" value={datoForaneo} onClick={abrirModal}
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

export default FormularioMisiones;