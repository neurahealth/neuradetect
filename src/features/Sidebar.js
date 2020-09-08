import React, { Component } from 'react'
import Icon from 'react-simple-line-icons';
import { NavLink,withRouter} from 'react-router-dom';
// import { createBrowserHistory } from 'history'
import { firebase } from '@firebase/app';
import 'firebase/auth';        // for authentication
import 'firebase/storage';     // for storage
import 'firebase/firestore';
import bgimg from '../assets/images/homecornerbackground.png'
var user ;
export class Sidebar extends Component {
    constructor(props) {
        super(props);       
        this.state = {
                        user:"",
                        pic:""
                    }
      
        this.pageRefresh.bind(this)
        
        firebase.auth().onAuthStateChanged(user =>  {
            this.setState({ user:user,pic:user.photoURL })

            user = user.photoURL;
        })

        
    }

    pageRefresh=()=>{
       // window.location.reload();
        console.log("page refreshed");
        
      }
    render() {
        return (
            <div style={styles.SidebarWrapper}>
                <h3 style={styles.Menu}> 
                <div style={{ backgroundImage:'url('+this.state.pic+')', backgroundSize:'contain', borderRadius: 100, width:45, height:45,margin:10 } } ></div>
                <div  style={styles.navlink} > {this.state.user.displayName} </div>
                   
                 </h3>

                <ul style={styles.Sidebar}>
                    <hr/>
                <li style={styles.Item} >
                    <NavLink to={'/app/home'} activeClassName="active" style={styles.navlink} onClick={this.pageRefresh}> <Icon name="home" style={{paddingRight:10}}/>  Home</NavLink>
                </li>
                <hr/>
                <li style={styles.Item}>
                <NavLink to={'/app/uploadslist'}  style={styles.navlink} activeClassName="active" disabled >  <Icon name="picture" style={{paddingRight:10}}/> Uploads </NavLink>
               
                </li>
                <hr/>
                <li style={styles.Item}>
                <NavLink to={'/app/reportlist'} activeClassName="active" style={styles.navlink}> <Icon name="notebook" style={{paddingRight:10}}/> Inferences</NavLink>
                
                </li>
                <hr/>
                <li style={styles.Item}>
                <NavLink to={'/app/paymentslist'} activeClassName="active" style={styles.navlink}> <Icon name="wallet" style={{paddingRight:10}}/> Payments</NavLink>
                </li>
            </ul>
               
               
            </div>
        )
    }
}

export default  withRouter(Sidebar);

const styles={

    SidebarWrapper:{
        width:'20%',
        minWidth:250,
        height:'95%',
        background:'#fff',
        boxShadow: '2px 0px 3px 0px rgba(209, 205, 205)',
        margin:'15px 0',
        backgroundImage: 'url('+bgimg+')',
        backgroundRepeat: "no-repeat",
        backgroundSize: "200px",
        backgroundPositionX: "0",
        backgroundPositionY: "100%",
        minWidth: "250px"
    },
   
    Menu:{
        padding:'5%',
        display:'flex',
        justifyContent: "center", 
        alignItems: "center" 

    },
    Item:{
        fontSize:16,
        color:'rgb(103, 99, 99)',
        fontFamily:'Montserrat',
        // padding:'0 10px',
        padding:'1px 35px',
       
        
    },
    navlink: { display: "flex", 
    alignItems: "baseline",  
    textDecoration: "none",
    textTransform:"capitalize"
    },
    
}