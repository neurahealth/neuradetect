import React, { Component } from 'react'
import {Form,Button} from 'react-bootstrap'
import Icon from 'react-simple-line-icons'


export class AddPacs extends Component {
    constructor(props) {
        super(props);
        this.state = { apiKey: null,
            validated:false,
        setValidated:false };
    }


      
      
  	render() {  
		return (  
			<div className='popup' > 
            
				<div className='popupInner' style={{padding:'0',display:'block',height:'fit-content'}}>  
				
                <div style={styles.modalHeader}>
                 <div> Add new PACS</div>
                 <button onClick={this.props.closePopup}  style={styles.close}>X</button>
                </div>
				<div style={styles.modalBody}>
                <Form >
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>PACS Name</Form.Label>
                        <Form.Control type="email" placeholder="Enter PACS Name" />
                    </Form.Group>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>PACS ATE</Form.Label>
                        <Form.Control type="email" placeholder="Enter PACS Name" />
                    </Form.Group>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>PACS Host (Public IP) </Form.Label>
                        <Form.Control type="email" placeholder="Enter PACS Name" />
                    </Form.Group>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>PACS Port</Form.Label>
                        <Form.Control type="email" placeholder="Enter PACS Name" />
                    </Form.Group>
                
                    <Button variant="primary" type="submit" style={styles.submitButton}>
                        Submit Details <Icon name="arrow-right" style={styles.icon}/>
                    </Button>
               </Form>
                </div>
				
					
				</div> 

			</div> 
         
		);  
	} 
}

export default AddPacs

const styles={
    modalHeader:{
        background:'rgb(4, 102, 149)',
        color:'#fff',
        width: '100%',
        height:40,
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        fontSize:16,
        borderRadius:'5px 5px 0 0',
    },
    close:{
        background: "#0000",
        border: "none",
        right: "20px",
        position: "absolute",
        color:'#fff'
    },
    modalBody:{
        padding: "8% 10%" ,
        fontSize: "15px", 
        fontWeight: "500 !important"
    },
  
    submitButton:{
        width:'100%',
        height:45,
        display:"flex",
        justifyContent:'center',
        alignItems:'center'
    },
    icon:{
        fontSize: 14,
        marginLeft: 10,
        fontWeight: 600,
    }
}