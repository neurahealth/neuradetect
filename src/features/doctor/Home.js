import React, { Component } from 'react'
import { BrowserRouter as Router ,Route,Link} from 'react-router-dom';
import Header from './Header';
import Footer from '../../features/Footer'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Icon from 'react-simple-line-icons';
import PacsSetting from './PacsSetting';


//const customHistory = createBrowserHistory();
export class Home extends Component {
   
constructor(props){
    super(props);

    this.state={ open:false}
}
  
  
 
    render() {
      
        this.handleClick = () => {
            alert("Hiii");
          this.setState({open: !this.state.open})
          };
     

        return (
            <div className="pageWrapper">
               <Router forceRefresh={false}>
                    <Header/>
                    <div className="homeWrapper"> 
                    <div style={styles.sidebarWrapper}>
                    <List
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                        className={styles.root}
                        >
                        
                        
                        <ListItem button onClick={this.handleClick}>
                            <ListItemIcon>
                            <Icon  name="layers" style={styles.Icon}/>
                            </ListItemIcon>
                            <ListItemText primary="Datastore" />
                            {this.state.open ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                            <ListItem button className={styles.nested} component={Link} to="/app/doctor/pacssetting">
                                <ListItemIcon>
                                <Icon name="doc" style={styles.Icon} />
                                </ListItemIcon>
                                <ListItemText primary="Datastore123" />
                            </ListItem>
                            <ListItem button className={styles.nested}>
                                <ListItemIcon>
                                <Icon name="doc" style={styles.Icon} />
                                </ListItemIcon>
                                <ListItemText primary="Datastore4321" />
                            </ListItem>
                            </List>
                        </Collapse>
                    
                        <ListItem button >
                            <ListItemIcon>
                            <Icon  name="notebook" style={styles.Icon}/>
                            </ListItemIcon>
                            <ListItemText primary="Studies" />
                        </ListItem>
    
                        <ListItem button >
                            <ListItemIcon>
                            <Icon  name="speedometer" style={styles.Icon}/>
                            </ListItemIcon>
                            <ListItemText primary="Series" />
                        </ListItem>
                        <ListItem button >
                            <ListItemIcon>
                            <Icon  name="energy" style={styles.Icon}/>
                            </ListItemIcon>
                            <ListItemText primary="Instances" />
                        </ListItem>

                        </List>
                    </div>
                    <div className="upload-deatils" style={styles.homeContainer}> 
                         {/* <h1 className="show-heading title">NeuraDetect</h1>
                         <div className="title-desc">Get Breast Density, BI-RADS Prediction, Breast Cancer Classification using Artificial Intelligence.  </div> */}
                         <Route exact path="/doctor/home"  />
                         <Route exact path="/app/doctor/pacssetting" component={PacsSetting}  />
                       
                    </div>
                    </div>
                    <Footer/>
                    </Router>
            </div>
        )
    }
}

export default Home

const styles = {
    homeContainer:{
        backgroundPositionX: "100%",
        backgroundPositionY: "100%",
        minWidth: 200,
    },
    sidebarWrapper:{
        background:'#046695',
        color:'#fff', 
        margin: "0",
        marginRight:"0px",
        padding: "20px",
        height:'100%',
        minWidth:230

    },
    root: {
        width: '100%',
        maxWidth: 360,
       
      },
      nested: {
        paddingLeft: 30,
      },
     Icon:{
         color:'#fff'
     },

}