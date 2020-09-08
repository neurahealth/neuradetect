import React, { Component } from 'react'
import logo from '../logo.png';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withRouter,Link } from "react-router-dom";

import Icon from 'react-simple-line-icons';
import { firebase } from '@firebase/app';
import 'firebase/auth';        // for authentication
import 'firebase/storage';     // for storage
import 'firebase/firestore';
import IconSetting from '../../assets/images/iconSetting.png'
import { Dropdown } from 'react-bootstrap';
import { logout } from '../../helpers/auth';


const appTokenKey = "appToken";
export class Header extends Component {
    constructor(props) {
        super(props);        this.state = { user:"",pic:""}
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
              window.location.reload(false);
        });
          
    }
    
    
    render() {
        return (
            <div>
                  <AppBar className="" style={{ position: 'relative' }}>
                    <Toolbar className="header">
                       <Link className="homeMenu" to="/app/doctor/home"> <Icon name="menu"/></Link>
                        <Typography variant="h6">
                       
                            <img src={logo} className="App-neuraHealth" alt="logo" />
                        </Typography>
                        <div className="signOutWrapper">
                           
                            <div style={{ backgroundImage:'url('+this.state.pic+')', backgroundSize:'contain', borderRadius: 100, width:45, height:45 } } ></div>
                            <div className="userDetailsWrapper">
                                <button type="button" className="btn-signOutBtn"  > {this.state.user.displayName} </button>
                                <div style={styles.role}>Admin</div>
                            </div>
                            <div style={styles.settingWrapper}>
                                <Dropdown   alignRight>
                                    <Dropdown.Toggle  variant="none" id="dropdown-basic" style={styles.btnSetting}>
                                        <img src={IconSetting} width='60%' alt="" /> 
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu  style={{width:160}}>
                                        <Dropdown.Item  > <Link to="/app/doctor/pacssetting" style={styles.dropItem}>PACS Setting </Link></Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item > <Link to="/app/doctor/pacssetting" style={styles.dropItem}>Role Allocation</Link></Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item  onClick={this.handleLogout} ><Link to="/login" style={styles.dropItem}>Logout</Link></Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>   
                        </div>
                        </div>
                      
                       
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
}

export default  withRouter(Header);


const styles = {
    role:{
        color:'#000',
        fontSize:14,
        paddingLeft:15
    },
    btnSetting:{
        background:'#0000',
        border:'none'
    },
    dropItem:{
        fontSize:14 ,
        fontWeight:500,
        padding:10,
        display:'block',
        filter:'brightness(1)'
    }
}