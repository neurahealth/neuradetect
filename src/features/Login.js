import React, { Component } from 'react';
import { loginWithGoogle } from '../helpers/auth';
import brandLogo from '../assets/images/logo-white.png';
import { fadeInUp } from 'react-animations';
import Radium,{ StyleRoot} from 'radium';
import Loader from '../loader/Loader.js';
import { firebase } from '@firebase/app';
import 'firebase/auth';

const firebaseAuthKey = 'firebaseAuthInProgress';
const appTokenKey = 'appToken';
const user ="";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { splashScreen: false,userType:"" };
        this.handleGoogleLogin = this.handleGoogleLogin.bind(this);
        this.doctorGoogleLogin = this.doctorGoogleLogin.bind(this);
    }

    doctorGoogleLogin(){
        loginWithGoogle()
        .catch(err => {
            localStorage.removeItem(firebaseAuthKey)
        });
        // this will set the splashscreen until its overridden by the real firebaseAuthKey
        localStorage.setItem(firebaseAuthKey, '1');
        localStorage.setItem(user,"doctor"); 
    }

    handleGoogleLogin() {
        loginWithGoogle()
        .catch(err => {
            localStorage.removeItem(firebaseAuthKey)
        });
        localStorage.setItem(firebaseAuthKey, '1');
        localStorage.setItem(user,"user");
       
    }
    
    componentDidMount() {
        if(localStorage.getItem(user) === "user"){
          
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                   localStorage.removeItem(firebaseAuthKey);
                   localStorage.setItem(appTokenKey, user.uid);
                    console.log("user data", user);
                   this.props.history.push('/app/home')
                }else{
                    localStorage.removeItem(firebaseAuthKey);
                    this.props.history.push('/login');
                }
                
            });
            
        }else{
             
           
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                   localStorage.removeItem(firebaseAuthKey);
                   localStorage.setItem(appTokenKey, user.uid);
                    this.props.history.push('/app/doctor/home');
                }
            });
            console.log(localStorage.getItem(user));
        }
       
    }

    render() {
        if (localStorage.getItem(firebaseAuthKey) === '1') 
            return <Splashscreen />;
            return <LoginPage handleGoogleLogin={this.handleGoogleLogin} doctorGoogleLogin={this.doctorGoogleLogin}  />;
    }
}

const styles = {
    fadeInUp: {
        animation: 'x 2s',
        animationName: Radium.keyframes(fadeInUp, 'fadeInUp')
    }
}

const LoginPage = ({ handleGoogleLogin, doctorGoogleLogin }) => (

    <div className="loginContainer">
        <StyleRoot className="loginWrapper"> 
            <div className="loginContainerWrapper">
            <div className="logoWrapper">
                <img src={brandLogo} style={styles.fadeInUp} width='70%' alt="Neura Health"/>
            </div>
            <h1 className="show-heading loginTitle" style={styles.fadeInUp}>NeuraDetect</h1>
            <h3 className="loginDesc" style={styles.fadeInUp}>Get Breast Density, BI-RADS Prediction, Breast Cancer Classification using Artificial Intelligence. Just upload Mammography Images!</h3>
                <div className="loginButtonWrapper" style={styles.fadeInUp}>
                    <div onClick={handleGoogleLogin} className="loginButton" >
                    <span className="button-text">Sign in as Patient</span>
                    </div>
                    <div value={"example"} onClick={ doctorGoogleLogin} className="loginButton" >
                        <span className="button-text">Sign in as Doctor</span>
                    </div>
                </div>
            </div>
        </StyleRoot>  
    </div>
)

const Splashscreen = () => (<Loader/>);