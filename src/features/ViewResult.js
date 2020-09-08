import React, { Component } from 'react';
import Header from '../features/Header';
import Footer from '../features/Footer';
import { firebase } from '@firebase/app';
import 'firebase/auth';        // for authentication
import 'firebase/storage';     // for storage
import 'firebase/firestore';   // for cloud firestore
import {  Row, Col, Button } from 'react-bootstrap';
import Icon from 'react-simple-line-icons';
import jsPDF from 'jspdf';
import  'jspdf-autotable'
import Report from './Report'
import Logo from '../assets/images/logo.png'
// import pageBg from '../assets/images/homecornerbackground.png'
import Skeleton from 'react-loading-skeleton';
import Sidebar from './Sidebar'
import serverError from '../assets/images/server-error.png'
//import html2canvas from 'html2canvas';
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

// const userId ="";
var month = new Date().getMonth()+1;
var date = new Date().getDate()+"/"+month +"/"+new Date().getFullYear()

export class ViewResult extends Component {

    constructor(props) {
        super(props);
        this.state = {
                        download:true,
                        percent:"",
                        percent2: "",
                        user:'',
                        username:'',
                        mail:'',
                        reportId:"",
                        BI_RADS_prediction:"",
                        Almost_entirely_fatty:"",
                        Heterogeneously_dense:"",
                        Extremely_dense:"",
                        Scattered_areas_of_fibroglandular_density:"",
                        BI_RADS_zero:"",
                        BI_RADS_one:"",
                        BI_RADS_two:"",
                        left_benign:"",
                        left_malignant:"",
                        right_benign:"",
                        right_malignant:"",
                        
                        left_benign2:"",
                        left_malignant2:"",
                        right_benign2:"",
                        right_malignant2:"",
                        
                        highestBiName:"",
                        highestVal:"",
                        highestDensityName:"",
                        highestDensityVal:"",
                        highestImgVal:0,
                        highestImgVal2:0,
                        results:null,

                        pname:"",
                        age:"",
                        pmail:"",
                        downloadURL:"",
                        photoIndex:"",

                        Dp:""
                    };
        this.getResults = this.getResults.bind(this)
        this.downloadPDF = this.downloadPDF.bind(this)


        firebase.auth().onAuthStateChanged(user =>  {
            console.log("user----",user.uid);
            this.setState({ user: user.uid,username:user.displayName,mail:user.email, })
            // const userId = this.state.user.uid;
            console.log("user+id from state ",this.state.user);
           // document.getElementById('displayError').style.display = "block";  
            // document.getElementById('displayError').append("Please Wait....");
            // setTimeout(() => { this.getResults(); }, 100);
            const {reportId} = props.location.state
            console.log(reportId)
            this.setState({ reportId: reportId })
            this.getResults();
        })

    }

    componentDidMount() {
        document.getElementById('displayError').style.display = "none";
        //document.getElementById('displayRes').style.display = "none";
        
    }
   
    async downloadPDF(){
        console.log("Inside downloadPDF--------------------");
       
        var pdf = new jsPDF();


     
        pdf.addImage(Logo,'PNG',20,15,50,4,0,'NONE',0)
        pdf.setFontSize(16);
        pdf.setTextColor(4,102,149);
        pdf.text('NeuraDetect', 195, 15, null, null, "right");
        pdf.setTextColor(100);
        pdf.setFontSize(9);
        pdf.text('Get Breast Density, BI-RADS Prediction, Breast Cancer', 195, 20, null, null, "right");
        pdf.text('Classification using Artificial Intelligence.', 195, 24, null, null, "right");
        pdf.setTextColor(4,102,149);
        pdf.text('www.neurahealth.ai | help@neurahealth.ai', 195, 28, null, null, "right");
        pdf.text(' +1-6104530321', 195, 32, null, null, "right");
        pdf.autoTable({ html: '#report', theme: 'plain',startY:31 });
        pdf.setFontSize(15);
        pdf.text("Mammography Screening Report", 105, 44, null, null, "center");
        pdf.setFontSize(10);
        pdf.setTextColor(0);
        pdf.text("Date: " +date,168,54);
        pdf.text("Email Id: "+this.state.pmail,16,64);
        pdf.autoTable({ html: '#pdfContainer1', theme: 'plain',startY:50 });
        pdf.autoTable({ html: '#density' , theme: 'grid',startY:75 , headStyles: {
            fillColor: [4,102,149,]
          },});
        pdf.autoTable({ html: '#birads', theme: 'grid',headStyles: {
            fillColor: [4,102,149,]
          } });

          pdf.setTextColor(100);
          pdf.setFontSize(12);
          pdf.text("Breast Cancer Classification ",16,120);
          pdf.autoTable({ html: '#imgpre', theme: 'grid',startY:125,headStyles: {
            fillColor: [4,102,149,]
          } });
        //   pdf.autoTable({ html: '#imgheatpre', theme: 'grid',startY:155,headStyles: {
        //     fillColor: [4,102,149,]
        //   } });
          
        
           // pdf.getImageFileTypeByImageData(this.state.downloadURL[0]);
            // pdf.addImage(myImage, "JPEG", 15, 40, 180, 180);

// This can be downloaded directly:

        var bll;
         var pTest = new Promise( (resolve , error) => {
            fetch(this.state.downloadURL[0], {
               mode: 'no-cors' 
              })
            .then(r => r.blob())
            .then(blob => {
             var reader = new FileReader();
             reader.onload = (response) => {
                 //console.log("Result : " , response.target.result);
                var b64 = response.target.result.replace(/^data:.+;base64,/, '');
                bll = response.target.result.replace(/^data:.+;base64,/, '');
                //console.log(`${b64.slice(0,20)}...${b64.slice(-20)}`);
                console.log(" Converted Value : ", bll);
                resolve(bll);
             }
             console.log(this.state.downloadURL[0]);
             
             reader.readAsDataURL(blob);
            });
        });



            pTest.then( response => {
                console.log("Response : " , response );
                pdf.setFontSize(8);
                pdf.setTextColor(0);
                pdf.text(" Note : 'L' stands for Left and 'R' stands for Right in above.",16,285);
                // pdf.addImage(response,'PNG',15,40,180,180);
                pdf.save("download.pdf");

            });

           
    }

   

    async getResults(props){

        const userId = this.state.user;

        console.log("reportId",this.state.reportId);
         let resultId = this.state.reportId
        try{ 
        let date = resultId.split('_')[0]
        let time = resultId.split('_')[1]
        let fileRef = `images/${userId}/${date}/${time}/visualization`;

        var downloadUrlLCC = await firebase.storage().ref(fileRef).child('L-CC.png').getDownloadURL();
        var downloadUrlRCC = await firebase.storage().ref(fileRef).child('R-CC.png').getDownloadURL();
        var downloadURLLMLO = await firebase.storage().ref(fileRef).child('L-MLO.png').getDownloadURL();
        var downloadURLRMLO = await firebase.storage().ref(fileRef).child('R-MLO.png').getDownloadURL();
        var downloadURLs = []
        downloadURLs.push(downloadUrlLCC, downloadUrlRCC, downloadURLLMLO, downloadURLRMLO)
        this.setState({ downloadURL: downloadURLs});
        }
        catch(e){
            console.log();
        }
   
      
      try {
      await firebase.firestore().collection('stripe_customers').doc(userId).collection('results').onSnapshot(snapshot => {
            snapshot.forEach(doc => {
              if (doc.id == resultId){
                let data = doc.data();
                let results = JSON.stringify(data);
                this.setState({ results: data});
                console.log('results',results)

                        this.setState({
                                Density_prediction: this.state.results.Density_prediction.error,
                                Almost_entirely_fatty:this.state.results.Density_prediction.Almost_entirely_fatty,
                                Extremely_dense:this.state.results.Density_prediction.Extremely_dense,
                                Heterogeneously_dense:this.state.results.Density_prediction.Heterogeneously_dense,
                                Scattered_areas_of_fibroglandular_density:this.state.results.Density_prediction.Scattered_areas_of_fibroglandular_density,
                                percent: " %",
                                highestDensityVal: (Math.max(this.state.results.Density_prediction.Almost_entirely_fatty, this.state.results.Density_prediction.Extremely_dense, this.state.results.Density_prediction.Heterogeneously_dense, this.state.results.Density_prediction.Scattered_areas_of_fibroglandular_density)),


                                pname:this.state.results.userDetails.patient_name,
                                age:this.state.results.userDetails.patient_age,
                                pmail:this.state.results.userDetails.patient_mail,
                            })

                            var arr = [this.state.results.Density_prediction.Almost_entirely_fatty, this.state.results.Density_prediction.Extremely_dense, this.state.results.Density_prediction.Heterogeneously_dense, this.state.results.Density_prediction.Scattered_areas_of_fibroglandular_density ];
                           
                            var highpoint = this.state.highestDensityVal
                            function checkHighest(value) {
                                return value >= highpoint;
                              }
                              
                            var intx = arr.indexOf(this.state.highestDensityVal);
                             console.log("highestVal Density", this.state.highestDensityVal);
                            // console.log("highestVal Density index1", arr.findIndex(checkHighest));
                            var densityName=["Almost Entirely Fatty (0)","Extremely dense (3)","Heterogeneously dense (2)", "Scattered areas of fibroglandular density (1)"]
                            console.log("highestVal Density Name",densityName[ arr.findIndex(checkHighest)]);
                            this.setState({ highestDensityName:densityName[ arr.findIndex(checkHighest)]})
                  if (this.state.results.BI_RADS_prediction){
                    this.setState({
                        BI_RADS_prediction: this.state.results.BI_RADS_prediction.error,
                        BI_RADS_zero: this.state.results.BI_RADS_prediction.BI_RADS_zero,
                        BI_RADS_one: this.state.results.BI_RADS_prediction.BI_RADS_one,
                        BI_RADS_two: this.state.results.BI_RADS_prediction.BI_RADS_two,
                        percent2: " %",
                        download: false,
                        highestVal: (Math.max(this.state.results.BI_RADS_prediction.BI_RADS_zero, this.state.results.BI_RADS_prediction.BI_RADS_one, this.state.results.BI_RADS_prediction.BI_RADS_two)),
                        })

                      var arr2 = [this.state.results.BI_RADS_prediction.BI_RADS_zero, this.state.results.BI_RADS_prediction.BI_RADS_one, this.state.results.BI_RADS_prediction.BI_RADS_two];
                      var highpoint2 = this.state.highestVal
                      console.log("highpoint2", highpoint2 );
                      function checkHighest(value) {
                          return value >= highpoint2;
                      }

                      var intx = arr.indexOf(this.state.highestVal);
                      console.log("highestVal birads", this.state.highestVal);
                      console.log("highestVal birads index1", arr2.findIndex(checkHighest));
                      var biName = ["BI-RADS 0 (Need Additional Imaging)", "BI-RADS 1 (Negative)", "BI-RADS 2 (Benign) "]
                      console.log("highestVal birads Name", biName[arr2.findIndex(checkHighest)]);
                      this.setState({ highestBiName: biName[arr2.findIndex(checkHighest)] })
                      console.log("highestVal birads", this.state.highestVal);



                    }
                  if (this.state.results.Image_Predictions){ 
                        this.setState({
                            Image_Predictions: this.state.results.Image_Predictions.error,
                            left_benign: this.state.results.Image_Predictions.left_benign,
                            left_malignant: this.state.results.Image_Predictions.left_malignant,
                            right_benign: this.state.results.Image_Predictions.right_benign,
                            right_malignant: this.state.results.Image_Predictions.right_malignant,
                        
              
                             
                            highestImgVal2: (Math.max(this.state.left_benign2, this.state.left_malignant2, this.state.right_benign2, this.state.right_malignant2)),
                            highestImgVal: (Math.max(this.state.left_benign, this.state.left_malignant, this.state.right_benign, this.state.right_malignant)),
                        });

                        
                    } 
                      if (this.state.results.visualization) {
                        this.setState({
                        visualization: this.state.results.visualization.error,
                        // left_benign2: this.state.results.Imageheatmaps_predictions.left_benign,
                        // left_malignant2: this.state.results.Imageheatmaps_predictions.left_malignant,
                        // right_benign2: this.state.results.Imageheatmaps_predictions.right_benign,
                        // right_malignant2: this.state.results.Imageheatmaps_predictions.right_malignant,

                       
                        })
                    }

                    
                
                
                // document.getElementById('displayError').style.display = "none";
                // document.getElementById('displayRes').style.display = "block";
              }
              
            })
      });
    //  console.log('this.state.results',this.state.results);
        if (this.state.results == ""){
            document.getElementById('displayError').style.display = "block";
            var elem = document.createElement("img");
            elem.src =serverError;
            document.getElementById('displayError').appendChild(elem);
            document.getElementById('displayError').innerHTML = "Could not display results at this moment please contact at help@neurahealth.ai";
            document.getElementById('displayRes').style.display = "none";
        }
    }
    catch(err) {
        console.error(err);
      }

    }

    handleClick=(e)=>{
        console.log("img url",e);
        this.setState({ isOpen: true,photoIndex:e })
    }


    render(props) {
        // const {res} = this.state;

        return (
            // <div className="pageWrapper">
            //     <div className="headerWrapper">
            //     <Header/>
            //     </div>
            //      <div className="homeWrapper">
            //      <Sidebar />
            <div style={{height:'100%'}}>
                <div id="displayError" style={{ fontSize: '17px' }}></div>
                <div className="" style={{ height: '100%' }}>

                    <div id="displayRes" style={{ height: '100%' }}>
                        <Row style={styles.resultContaner}>
                            <Col style={styles.colBorder}>
                            {/* <h1 className="show-heading title">NeuraDetect </h1>
                        <div className="title-desc" style={{width:'100%'}}>Get Breast Density, BI-RADS Prediction, Breast Cancer Classification using Artificial Intelligence.  </div> */}
                       {/* <h2 style={{fontFamily: 'Montserrat'}}>Hi, <span className="show-heading title"> {this.state.pname} </span> </h2> */}
                        {/* <div className="title-desc" style={{width:'100%'}}>Get Breast Density, BI-RADS Prediction, Breast Cancer Classification using Artificial Intelligence.  </div> 
                        <div id="displayContent descWrappwer" style={{marginBottom: '2%'}}>
                            <div className="title-desc" >You can find your results here.</div>
                        </div> */}

                     
                        <div style={styles.resTitle} > Breast Density prediction</div>
                               
                        <hr style={styles.hr}/>
                       
                        <ul className="resultWrapper" >
                            <li  style={styles.item}>
                                        {this.state.Density_prediction =="true" ? 
                                <Row> 
                                               
                                    <Col style={{fontWeight: 'bold'}}> Invalid image resolution </Col>
                                </Row>
                                :
                                <Row>
                                    <Col style={{minWidth: 377}}>{this.state.highestDensityName || <Skeleton />}</Col>
                                    <Col style={{fontWeight: 'bold', textAlign: 'end'}}>  {this.state.highestDensityVal+ this.state.percent || <Skeleton /> } </Col>
                                </Row>
                                        }
                            </li>
                           {/* <li  style={styles.item}>
                                <Row style={{display:`${parseFloat(this.state.highestDensityVal) === parseFloat(this.state.Scattered_areas_of_fibroglandular_density) ? 'block' : 'none'}`}}>
                                    <Col md="auto" style={{minWidth: 377}}> Scattered areas of fibroglandular density (1) </Col>
                                    <Col> {this.state.Scattered_areas_of_fibroglandular_density+ this.state.percent   || <Skeleton />}</Col>
                                </Row>
                            </li>
                            <li  style={styles.item}>
                                <Row style={{display:`${parseFloat(this.state.highestDensityVal) === parseFloat(this.state.Heterogeneously_dense) ? 'block' : 'none'}`}}>
                                    <Col style={{minWidth: 377}}>Heterogeneously dense (2)  </Col>
                                    <Col> {this.state.Heterogeneously_dense+ this.state.percent   || <Skeleton />}</Col>
                                </Row>
                            </li>
                            <li  style={styles.item}>
                                <Row style={{display:`${parseFloat(this.state.highestDensityVal) === parseFloat(this.state.Extremely_dense) ? 'block' : 'none'}`}}>
                                    <Col style={{minWidth: 377}}>Extremely dense (3)    </Col>
                                    <Col> {this.state.Extremely_dense+ this.state.percent   || <Skeleton />}  </Col>
                                </Row>
                            </li> */}
                        </ul>

                        {/* <div id="displayResults"></div> */}
                        <div style={styles.resTitle}> BI-RADS Prediction</div>
                        <hr style={styles.hr}/>
                        <ul className="resultWrapper" >
                            <li  style={styles.item}>
                                        {this.state.BI_RADS_prediction == "true"  ? 
                                <Row> 
                                    <Col style={{fontWeight: 'bold'}}> Invalid image resolution </Col>
                                </Row>
                            :
                                <Row>
                                    <Col> {this.state.highestBiName || <Skeleton />}</Col>
                                                <Col style={{ fontWeight: 'bold', textAlign: 'end'}}> {this.state.highestVal+ this.state.percent2    || <Skeleton />} </Col>
                                </Row>
                            }
                            </li>
                           {/* <li  style={styles.item}>
                                <Row style={{display:`${parseFloat(this.state.highestVal) === parseFloat(this.state.BI_RADS_one) ? 'block' : 'none'}`}}>
                                    <Col>  BI-RADS 1 (Negative)</Col>
                                    <Col>{this.state.BI_RADS_one+ this.state.percent2   || <Skeleton />} </Col>
                                </Row>
                            </li>
                            <li  style={styles.item}>
                                <Row style={{display:`${parseFloat(this.state.highestVal) === parseFloat(this.state.BI_RADS_two) ? 'block' : 'none'}`}}>
                                    <Col> BI-RADS 2 (Benign)    </Col>
                                    <Col>{this.state.BI_RADS_two+ this.state.percent2   || <Skeleton />}  </Col>
                                </Row>
                            </li> */}
                        </ul>
                        <div style={styles.resTitle}>Breast Cancer Classification</div>
                        <hr style={styles.hr}/>
                                <div style={styles.resTitle}>Image Predictions </div>
                        {this.state.Image_Predictions == "true" ? 
                            <ul className="resultWrapper"  >
                              <li  style={styles.item}>
                               <Row>
                                   <Col style={{ fontWeight: 'bold' }}> Invalid image resolution </Col>
                               </Row>
                               </li>
                               </ul>
                            :
                        <ul className="resultWrapper" style={{textAlign:'center'}} >
                           
                            <li  style={styles.item}>
                                <Row>
                                    {/* <Col> Index  </Col> */}
                                    <Col>    L Benign </Col>
                                    <Col>   R Benign</Col>
                                    <Col>    L Malignant   </Col>
                                    <Col>  R Malignant </Col>
                                </Row>
                               
                            </li>
                            <li  style={styles.item}>
                                <Row>
                                    <Col style={{fontWeight:`${parseFloat(this.state.highestImgVal) === parseFloat(this.state.left_benign) ? 'Bold' : 'normal'}`}}>{(this.state.left_benign*100).toFixed(2) + this.state.percent2   || <Skeleton />}</Col>
                                    <Col style={{fontWeight:`${parseFloat(this.state.highestImgVal) === parseFloat(this.state.left_malignant) ? 'Bold' : 'normal'}`}}>{(this.state.left_malignant*100).toFixed(2)+ this.state.percent2   || <Skeleton />}</Col>
                                    <Col style={{fontWeight:`${parseFloat(this.state.highestImgVal) === parseFloat(this.state.right_benign) ? 'Bold' : 'normal'}`}}>{(this.state.right_benign*100).toFixed(2)+ this.state.percent2   || <Skeleton />}</Col>
                                    <Col style={{fontWeight:`${parseFloat(this.state.highestImgVal) === parseFloat(this.state.right_malignant) ? 'Bold' : 'normal'}`}}>{(this.state.right_malignant*100).toFixed(2)+ this.state.percent2   || <Skeleton />}</Col>
                                </Row>
                               
                            </li>
                        </ul>
                      }
 
     {/* <hr style={styles.hr}/> */}
                      
                      
                        {/* <div style={styles.resTitle}>Image heatmaps Predictions</div>
                        <ul className="resultWrapper" style={{textAlign:'center'}} >
                        <li  style={styles.item}>
                                <Row>

                                    <Col>    L Benign </Col>
                                    <Col>   R Benign</Col>
                                    <Col>    L Malignant   </Col>
                                    <Col>  RMalignant </Col>
                                </Row>
                            </li>
                              <li  style={styles.item}>
                            <Row >
                                    <Col style={{fontWeight:`${parseFloat(this.state.highestImgVal2) === parseFloat(this.state.left_benign2) ? 'Bold' : 'normal'}`}}>{(this.state.left_benign2*100).toFixed(2)+ this.state.percent2   || <Skeleton />}</Col>
                                    <Col style={{fontWeight:`${parseFloat(this.state.highestImgVal2) === parseFloat(this.state.left_malignant2) ? 'Bold' : 'normal'}`}}>{(this.state.left_malignant2*100).toFixed(2)+ this.state.percent2   || <Skeleton />}</Col>
                                    <Col style={{fontWeight:`${parseFloat(this.state.highestImgVal2) === parseFloat(this.state.right_benign2) ? 'Bold' : 'normal'}`}}>{(this.state.right_benign2*100).toFixed(2)+ this.state.percent2   || <Skeleton />}</Col>
                                    <Col style={{fontWeight:`${parseFloat(this.state.highestImgVal2) === parseFloat(this.state.right_malignant2) ? 'Bold' : 'normal'}`}}>{(this.state.right_malignant2*100).toFixed(2)+ this.state.percent2   || <Skeleton />}</Col>
                                </Row>
                            </li>
                        </ul> */}
                        <hr style={styles.hr}/>
                        <h6>   Note : 'L' stands for Left and 'R' stands for Right in above.</h6>
                                       </Col>
                    <Col>
                  
                        {/* <hr style={styles.hr}/> */}
                                {this.state.visualization == "true" ? 
                                    <ul className="resultWrapper"  >
                                        <li style={styles.item}>
                                            <Row>
                                                <Col style={{ fontWeight: 'bold' }}> Invalid image resolution </Col>
                                            </Row>
                                        </li>
                                    </ul>
                                :
                                <div> 
                                <div ><h4> L-CC </h4> <div className="cursor" onClick={() => this.handleClick(this.state.downloadURL[0])}>  {this.state.downloadURL[0] ? <img src={this.state.downloadURL[0]} style={styles.visualizationImg} /> : <Skeleton />} </div> </div>
                                <div ><h4> R-CC </h4><div className="cursor" onClick={() => this.handleClick(this.state.downloadURL[1])}>  {this.state.downloadURL[1] ?<img src={this.state.downloadURL[1]} style={styles.visualizationImg} /> : <Skeleton />}</div> </div>
                                <div ><h4> L-MLO </h4> <div className="cursor" onClick={() => this.handleClick(this.state.downloadURL[2])}>  {this.state.downloadURL[2] ?<img src={this.state.downloadURL[2]} style={styles.visualizationImg} /> : <Skeleton />}</div> </div>
                                <div ><h4> R-MLO </h4> <div className="cursor" onClick={() => this.handleClick(this.state.downloadURL[3])}>  {this.state.downloadURL[3] ?<img src={this.state.downloadURL[3]} style={styles.visualizationImg} /> : <Skeleton />}</div> </div>
                                </div>
                                }
                                {this.state.isOpen &&( <Lightbox
                                    mainSrc={this.state.photoIndex}
                                    onCloseRequest={() => this.setState({ isOpen: false })}
                               
                                /> )}
                        <div style={styles.btnReportWrapper}>
                            {/* <Button style={styles.btnReport}>Get Report by Email<Icon name="arrow-right"  style={styles.icon}/></Button> */}
                                    <Button onClick={this.downloadPDF} disabled={this.state.download }   style={styles.btnReport} >Download Report<Icon name="arrow-right"  style={styles.icon}/></Button>
                        </div>
                        <h3 className="primary-color" style={{textAlign:'center',marginTop:'5%',display:'none'}}>Thank you for using NeuraDetect. You can sign out now.</h3>
                        <div style={{display:'none'}}>
                        <Report pdf={this.state} />
                        </div>
                         
                    </Col>
                </Row>

                 </div>
                </div>
        </div>
        )
    }
}

export default ViewResult

const styles = {
    resultContaner:{
        height:'100%'
    },


    colBorder: {
        height: 'calc(100 - 200)',
        borderRight:'2px solid #046695'
    },
    resTitle:{
        fontFamily:'Montserrat',
        color:'#046695',
        fontSize:18,
        fontWeight:600

    },
    hr:{
    border: 0,
    borderTop:' 1px solid #007bff',
    },
    item:{
        fontFamily:'Montserrat',
        fontSize:15,
        color:'#000',
        listStyle: 'none',
        lineHeight: 2.1,
    },
    btnReportWrapper:{
        display:'flex'
    },
    btnReport:{
        background:'#046695',
        fontFamily:'Montserrat',
        fontSize:15,
        fontWeight:500,
        color:'#fff',
        margin:15,
        padding: 8,
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        minWidth:220,
        marginTop:'5%'
    },
    icon:{
        fontSize: 14,
        marginLeft: 10,
        fontWeight: 600,
    },
    visualizationImg:{
        width:'100%',
    }
}