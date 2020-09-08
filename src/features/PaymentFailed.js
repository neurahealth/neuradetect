import React, { Component } from 'react'
import logo from './logo.png';
import arrowLeft from '../assets/images/arrow-forward.png';
import successIcon from '../assets/images/failed.png';
import { Button } from 'react-bootstrap';

export class PaymentFailed extends Component {

  
    

    render() {
        return (
             <div className="popupWrappre">
                <img src={logo} className="popupLogo" width="80%" alt="logo" />
            
            <div className="modalHead"> NeuraDetect</div>
            <div className="modalDesc" style={{width:'70%'}}> Get Breast Density, BI-RADS Prediction, Breast Cancer Classification using 
                Artificial Intelligence. </div>


                <img src={successIcon} className="successPayment" alt=""/>

                <div style={styles.paymentSuccTitle}>Payment Failed</div>
                <div style={styles.thankyouTitle}>Please try again later, </div>

                <Button style={styles.btnViewResult} onClick={this.props.close}> Go back <img  alt="" src={arrowLeft} width='9' height='12' style={{marginLeft:10}}/></Button>
            </div>
        )
    }
}

export default PaymentFailed

const styles = {

    paymentSuccTitle: {
        color:'#000',
        fontSize: 25,
        fontFamily: 'Montserrat',
        fontWeight: '600',
    },
    thankyouTitle:{
        color:'#046695',
        lineHeight:2,
        fontSize:15,
        fontFamily: 'Montserrat',
    },
    btnViewResult:{
        background:'#046695',
        height:40,
        width:250,
        color:'#fff',
        fontSize:16,
        fontFamily: 'Montserrat',
        fontWeight:500,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        marginTop: '10%',
        cursor:'pointer',
        textDecoration:'none',
    }
}