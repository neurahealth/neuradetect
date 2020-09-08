import React, { Component } from 'react'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { logout } from '../helpers/auth';
import { firebase } from '@firebase/app';
import 'firebase/auth';        // for authentication
import 'firebase/storage';     // for storage
import 'firebase/firestore';   // for cloud firestore
import logo from './logo.png';
import { withRouter,Link } from "react-router-dom";
import Icon from 'react-simple-line-icons';



const appTokenKey = "appToken";
export class Header extends Component {
    constructor(props) {
        super(props);
        this.state = { user:"",pic:""}
        this.handleLogout = this.handleLogout.bind(this);


       

        firebase.auth().onAuthStateChanged(user =>  {
            this.setState({ user:user,pic:user.photoURL })
            
           
        })
       
        
    }

 

    handleLogout() {
        logout()
            .then(() => {
                localStorage.removeItem(appTokenKey);
               
                  this.props.history.push('/login');
            });
    }
 
    render() {
        return (
            <div >
                <AppBar className="" style={{ position: 'relative' }}>
                    <Toolbar className="header">
                        {/* <Link className="homeMenu" to="/app/home"> <Icon name="menu"/></Link> */}
                        <Typography variant="h6">
                            <Link to='/home'>
                                <img src={logo} className="App-neuraHealth" alt="logo" />
                            </Link> 
                        </Typography>
                        <div className="signOutWrapper">

                            <button type="button" className="btn-signOutBtn" onClick={this.handleLogout}> Sign out </button>
                           
                            <img src={this.state.pic} width="45" height="45" style={{ borderRadius: 100 }}
                            alt="profile"/>
                            
                        </div>
                       
                    </Toolbar>
                </AppBar>
                
            </div>
        )
    }
}

export default withRouter(Header);
