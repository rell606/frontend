import React from "react";
import '../css/login.css';
import { urlApi } from "../services/apirest";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import App from "../App";
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBIcon,
  MDBInput,
  MDBCheckbox
}
  from 'mdb-react-ui-kit';

class Login extends React.Component {
  //Código java script
  state = {
    form: {
    "username": "",
    "password": ""
    }
  }

  manejadorOnChange = async e => {
    this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    })
    console.log(this.state.form);
  }

  manejadorLogin = () => {
    let url = urlApi + "auth/login";
    const {notificacion} = this.props;
    axios
      .post(url, this.state.form)
      .then(response => {
        if (response.data.message === "logeo exitoso") {
          localStorage.setItem("token", response.data.token) //Almacenar en un item el token
          localStorage.setItem("id_unidad", response.data.id_unidad) //Almacenar en un item el token
          this.props.navigate('/unidades'); //Navegamos al componente
        } else {
          notificacion(response.data.message, 'warning');
        }
      })
      .catch(error => {
        if (error.response) {
          notificacion(error.response.data.message, 'error');
        } else if (error.request) {
          notificacion("No se pudo conectar con el servidor", 'error');
        }
      })
    }

    render() {
      return (
        <MDBContainer fluid className="p-3 my-5">

          <MDBRow>

            <MDBCol col='10' md='6'>
              <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg" className="img-fluid" alt="Phone image" />
            </MDBCol>

            <MDBCol col='4' md='6'>


              <MDBInput wrapperClass='mb-4' name="username" label='Email address' id='formControlLg' type='email' onChange={this.manejadorOnChange} />
              <MDBInput wrapperClass='mb-4' name="password" label='Password' id='formControlLg' type='password' onChange={this.manejadorOnChange} />


              <div className="d-flex justify-content-between mx-4 mb-4">
                <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
                <a href="!#">Forgot password?</a>
              </div>

              <MDBBtn className="mb-4 w-100" size="lg" onClick={this.manejadorLogin}>Sign in</MDBBtn>

              <div className="divider d-flex align-items-center my-4">
                <p className="text-center fw-bold mx-3 mb-0">OR</p>
              </div>

              <MDBBtn className="mb-4 w-100" size="lg" style={{ backgroundColor: '#3b5998' }}>
                <MDBIcon fab icon="facebook-f" className="mx-2" />
                Continue with facebook
              </MDBBtn>

              <MDBBtn className="mb-4 w-100" size="lg" style={{ backgroundColor: '#55acee' }}>
                <MDBIcon fab icon="twitter" className="mx-2" />
                Continue with twitter
              </MDBBtn>

            </MDBCol>

          </MDBRow>

        </MDBContainer>
      );
    }
  }
function ContenedorNavegacion(props) {
  let navigate = useNavigate();
  return < Login {...props} navigate={navigate} />
}

export default ContenedorNavegacion;
