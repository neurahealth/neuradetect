import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import Popup from './AddPacs'
export class PacsSetting extends Component {
    constructor(props){
        super(props);

        this.state={
            showPopup: false,
        }
    }

    togglePopup() {  
        this.setState({  
        showPopup: !this.state.showPopup  
        });  
      } 

    render() {
        return (
            <div>
                 <h1 className="show-heading title">Pacs Setting</h1>
                 <div className="title-desc"> here you can add or upgrade the PACS.  </div>

                 <div style={styles.pacsWrapper}>

                     <Button style={styles.pacBtn} className="pacBtn" onClick={this.togglePopup.bind(this)} > <span className="btnAddIcon"></span> Add new PACS</Button>
                     <Button style={styles.pacBtn} className="pacBtn" >  <span className="btnUpdateIcon"></span> Update existing PACS</Button>
                 </div>

                  {this.state.showPopup ? <Popup  text='Add new PACS' closePopup={this.togglePopup.bind(this)} />  : null  }  
                      
            </div>
        )
    }
}

export default PacsSetting

const styles={
    pacsWrapper:{
        paddingTop:'5%',
        display:'flex',
        justifyContent:'space-between',
        width:'60%'
    },
    pacBtn:{
        display: 'flex',
        // background:' #0000',
        color:' #000',
        border: 'none',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 30px 0px 0px',
        background:'#D5D7D9',
        borderRadius:25
    }
}