import React from 'react'
import Logo from '../assets/images/logo.png'
import {Table} from 'react-bootstrap'

function Report(props) {

   
    return (
        <div style={styles.Pagecontainer} >

            <div style={styles.header} >
            {/* <img src={Logo} style={styles.logo}  alt="logo" /> */}
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
                    <td >___________________________________________________________________________________________ </td>
                </tr>
               
            </tbody>
               
            </Table>
            <Table responsive style={styles.patienInfo} id="pdfContainer1"   > 
           
            <tbody>
               
                <tr>
                    {/* <td > Patient ID  : &nbsp;{props.pdf.user}  </td> */}
                   
                   
                </tr>
                <tr>
                    <td > Patient Name :<span style={{textTransform:'capitalize'}}> &nbsp;{props.pdf.pname} [Age : {props.pdf.age}] </span>   </td>
                </tr>
            </tbody>
               
            </Table>
           
            </div>
          

            <div style={styles.tableWrapper}>
            <Table responsive style={{ marginTop:'5%',border:'1px solid #000'}} id="density">
                <thead>
                    <tr>
                    <th colSpan="2" style={styles.tbleHed} >Breast Density Prediction </th>
                   
                    </tr>
                </thead>
                <tbody style={styles.tbleRow}>
                    <tr style={{display:`${parseFloat(props.pdf.highestDensityVal) === parseFloat(props.pdf.Almost_entirely_fatty) ? 'block' : 'none'}`}}>
                    <td>{props.pdf.highestDensityName}  </td>
                    <td>{props.pdf.highestDensityVal}%</td>
                   
                   
                    </tr>
                   
                </tbody>
                </Table>

                <Table responsive bordered style={{ marginTop:'5%'}} id="birads">
                <thead>
                    <tr>
                    <th colSpan="2" style={styles.tbleHed} >Screening BI-RADS Prediction</th>
                   
                    </tr>
                </thead>
                <tbody style={styles.tbleRow}>
                    <tr style={{fontWeight:`${parseFloat(props.pdf.highestVal) === parseFloat(props.pdf.BI_RADS_zero) ? 'Bold' : 'normal'}`}}>
                    <td>{props.pdf.highestBiName}  </td>
                    <td>{props.pdf.highestVal}%</td>
                   
                   
                    </tr>
                    
                   
                </tbody>
                </Table>


                <Table responsive bordered style={{ marginTop:'5%'}} id="imgpre">
                <thead>
                    <tr>
                        <th colSpan="4" style={styles.tbleHed} >Image Predictions</th>
                    </tr>
                </thead>
                <tbody style={styles.tbleRow}>
                    <tr>
                        <th style={styles.tbleHed2} > L Benign </th>
                        <th style={styles.tbleHed2} >  R Benign </th>
                        <th style={styles.tbleHed2} >  L Malignant  </th>
                        <th style={styles.tbleHed2} > R Malignant  </th>
                   
                    </tr>
                    <tr style={{fontWeight:`${parseFloat(props.pdf.highestVal) === parseFloat(props.pdf.BI_RADS_zero) ? 'Bold' : 'normal'}`}}>
                    <td> {(props.pdf.left_benign*100).toFixed(2) + props.pdf.percent2 } </td>
                    <td>{(props.pdf.left_malignant*100).toFixed(2)+ props.pdf.percent2 }</td>
                    <td> {(props.pdf.right_benign*100).toFixed(2)+ props.pdf.percent2 }  </td>
                    <td>{(props.pdf.right_malignant*100).toFixed(2)+ props.pdf.percent2}</td>
                   
                    </tr>
                    
                   
                </tbody>
                </Table>

              


            </div>

        </div>
    )
}

export default Report

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
       
    },
    tbleHed2:{
        color: "rgb(4, 102, 149)",
        fontFamily: "Montserrat",
        fontWeight: "normal",
        fontSize: "12px",
        textAlign: "left",
       border:"1px solid rgb(4, 102, 149)",
    },
    tbleRow:{
        color: "#000",
        fontFamily: "Montserrat",
        fontWeight: "normal",
        fontSize: "12px",
        textAlign: "left",
        background:'#fff'
    },
    visualizationImg:{
        width:'100%',
    }
   
}