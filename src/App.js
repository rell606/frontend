import React from 'react';
import logo from './logo.svg';
import './css/App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Unidades from './components/unidades/Unidades';

class App extends React.Component {

  notificacion = (mensaje, tipo = 'info', duracion = 3000) => {
    //Accedo al contenedor
    let container = document.querySelector('.notif-container');
    //Crear un elemento de la notifacion
    const notif = document.createElement('div');
    // agrego clases al elemento
    notif.className = `notif-toast ${tipo}`;
    //Agrego mensaje al elemento
    notif.innerText = mensaje;
    //agregamos el elemento al contenedor
    container.appendChild(notif);
    //Activar animación de entrada
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        notif.classList.add('show');//Mostramos la notificación
      });
    });
    setTimeout(() => {
      notif.classList.remove('show');
      notif.classList.add('fade-out');
      notif.addEventListener('transitionend', () => {
        notif.remove(); //eliminar el elemento
      });
    }, duracion);
  }

  render() {
    return (
      <div className="App">
        <div className='notif-container'></div>
        <Router>
          <Routes>
            <Route path='/' element={<Login notificacion = {this.notificacion}/>}></Route>
            <Route path='/unidades' element={<Unidades notificacion = {this.notificacion} />}></Route>
            <Route path='/misiones' element={<Misiones notificacion = {this.notificacion} />}></Route>
            <Route path='/equipamiento' element={<Equipamiento notificacion={this.notificacion} />}></Route>
          </Routes>
        </Router>
      </div>
    );
  }
}

export default App;
