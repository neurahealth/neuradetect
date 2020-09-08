import React from 'react'
import Logo from '../assets/images/logo.png'
import {Table} from 'react-bootstrap'

function ReportView(props) {

   
    return (
        <div style={styles.Pagecontainer} >

            <div style={styles.header} >
            <img src={Logo} style={styles.logo}  alt="logo" />
                <div style={styles.rightInfo}   id="pdfContainer">
                    <div style={styles.title}> NeuraDetect </div>
                    <div style={styles.desc}>Get Breast Density, BI-RADS Prediction, Breast Cancer 
                        Classification using Artificial Intelligence. 
                    </div>
                    <div style={styles.contactInfo}> www.neurahealth.ai | help@neurahealth.ai </div>
                </div>
            </div>
          
           {/* <h4 id="report" style={styles.report}>Report</h4> */}
            <div style={styles.tableWrapper}>
            <Table responsive style={styles.patienInfo} id="report"   > 
           
            <tbody>
               
                <tr>
                    <td > {props.pdf.BI_RADS_one}  </td>
                </tr>
               
            </tbody>
               
            </Table>
           
            </div>

        </div>
    )
}

export default ReportView

const styles={
    Pagecontainer:{
        height:'100%',
        width:'100%',
        display:'block',
        background:'#fff',
        padding:'60px 36px'
    },
    header:{
        display: "flex", justifyContent: "space-between",alignItems:'center'
    },
    logo:{
       height:12
    },
    rightInfo:{
        textAlign: "right",
       
    },
    title:{
        fontFamily: "Montserrat",
        fontWeight: "600",
        fontSize: "16px",
        textAlign: "right",
        color: "#046695"
    },
    desc:{
        width: "260px",
        fontFamily: "Montserrat",
        fontWeight: "normal",
        fontSize: "9px",
        lineHeight: "15px",
        textAlign: "right",
        color: "#000"
    },
    contactInfo:{
        fontFamily: "Montserrat",
        fontWeight: "normal",
        fontSize: "9px",
        color: "#046695"
    },
    hr:{
        color: "#046695",
        background:"#046695",
        height:2
    },
    report:{
        fontFamily: "Montserrat",
        fontWeight: "600",
        fontSize: "16px",
        lineHeight: "15px",
        textAlign: "center",
        color: "#000",
        margin:'auto'
    },
    patienInfo:{
        // display:'flex',
        justifyContent: "space-between",alignItems:'center',
        margin: "auto",marginTop: "5%" ,lineHeight:'25px' ,
        display:'table'
    },
    patienName:{
        display:'flex',
        justifyContent: "space-between",alignItems:'center',
        width: "80%", margin: "auto"
    },
    tableWrapper:{
        width: '90%',
        margin: 'auto',
    
    },
    tbleHed:{
        background: "rgb(4, 102, 149)",
        color: "rgb(255, 255, 255)",
        fontFamily: "Montserrat",
        fontWeight: "normal",
        fontSize: "12px",
        textAlign: "left",
       
    }
,
    tbleRow:{
        color: "#000",
        fontFamily: "Montserrat",
        fontWeight: "normal",
        fontSize: "12px",
        textAlign: "left",
        background:'#fff'
    }
   
}