import React, { Component } from 'react';
import logo from './logo.png';
import arrowLeft from '../assets/images/arrow-forward.png';
import successIcon from '../assets/images/succes.png';

import {Link} from 'react-router-dom';


export default class PaymentSuccess extends Component {
 
           

    render() {
    return (
        <div className="popupWrappre">
        <img src={logo} className="popupLogo" width="80%" alt="logo" />
      
      <div className="modalHead"> NeuraDetect</div>
      <div className="modalDesc"> Get Breast Density, BI-RADS Prediction, Breast Cancer Classification using 
          Artificial Intelligence. </div>


          <img src={successIcon} className="successPayment" alt=""/>

        <div style={styles.paymentSuccTitle}>Payment Successful</div>
        <div style={styles.thankyouTitle}>Thank you for making payment, </div>
        <div className="modalDesc">Results will be available at Inference tab within 5 minuts</div>
        <Link style={styles.btnViewResult} to="/app/reportlist">View Reports <img alt="" src={arrowLeft} width='9' height='12' style={{marginLeft:10}}/></Link>
      </div>

     
    )
}
}


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