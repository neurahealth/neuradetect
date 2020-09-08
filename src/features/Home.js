import React, { Component } from 'react';
import Checkbox from 'muicss/lib/react/checkbox';
import { Container, Row, Col,ProgressBar,Alert } from 'react-bootstrap';
import { logout } from '../helpers/auth';
import FileUploader from 'react-firebase-file-uploader';
import Radium,{ StyleRoot} from 'radium';

import { firebase } from '@firebase/app';
import 'firebase/auth';        // for authentication
import 'firebase/storage';     // for storage
import 'firebase/firestore';   // for cloud firestore
import { Elements, StripeProvider } from "react-stripe-elements";
import moment from 'moment-timezone'; 
import CheckoutForm from "./CheckoutForm";
import Popup from "./Popup";  
import {  withRouter } from 'react-router';
import { createBrowserHistory } from 'history'
import { PaymentsList } from './PaymentsList'

import { fadeInUp } from 'react-animations';

import arrowLeft from '../assets/images/arrow-forward.png';
import uploadBack from '../assets/images/uploadBacj-image.png'
import uploadIcon from '../assets/images/iconUpload.png'
import dcmfile from '../assets/images/dcmfile.png'

import {ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const appTokenKey = "appToken";
// var downloadURL;

const browserHistory = createBrowserHistory();
const $ = window.$;
const aggreeterms="block"
const styles = {
  fadeInUp: {
      animation: 'x 2s',
      animationName: Radium.keyframes(fadeInUp, 'fadeInUp')
  },
  userInfoWrapper:{
    display:'flex',
    marginBottom:'15px'
  },
  hr:{
    border: 0,
    borderTop:' 1px solid #007bff',
    },
}



 class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
          LLC:"",
          RCC:"",
          LMLO:"",
          RMLO:"",
          user:"",
          pname:"",
          age:"",
          pmail:"",
          Sidebar:"",
          thumbnileLCC:"",
          thumbnileRCC:"",
          thumbnileL_MLO:"",
          thumbnileR_MLO:"",
          fileRef: '',
          apiKey: null,
          isUploadingLCC: false,
          isUploadingRCC: false,
          isUploadingL_MLO: false,
          isUploadingR_MLO: false,
          progress: 0,
          progress1: 0,
          progress2: 0,
          progress3: 0,
          stripeCustomerInitialized: false,
          sources: {},
          charges: {},
          filenames: [],
          downloadURLs: [],
          fullPaths: [],
          showPopup: false,
          makePayment: true,
          currentTime:"",
          allowUploadLcc:false,
          allowUploadRcc:false,
          allowUploadLMLO:false,
          allowUploadRMLO:false,
          allImageUpload: false,
          detailsFilled: false,
          checked1: false,
          checked2: false,
          newCharge: {
            source: null,
            amount: 2000
          }
        }; 

        this.handleLogout = this.handleLogout.bind(this);
        this.getInitial = this.getInitial.bind(this);        
        this.handleProgress = this.handleProgress.bind(this);
        this.handleProgress1 = this.handleProgress1.bind(this);
        this.handleProgress2 = this.handleProgress2.bind(this);
        this.handleProgress3 = this.handleProgress3.bind(this);
        this.handleUploadStart = this.handleUploadStart.bind(this);
        this.handleUploadStart1 = this.handleUploadStart1.bind(this);
        this.handleUploadStart2 = this.handleUploadStart2.bind(this);
        this.handleUploadStart3 = this.handleUploadStart3.bind(this);
        this.handleUploadSuccess = this.handleUploadSuccess.bind(this)
        // this.getResults = this.getResults.bind(this)
        this.aggreeTerm = this.aggreeTerm.bind(this)
        this.notify =this.notify.bind(this)
        this.checkagg=this.checkagg.bind(this);
        this.handleChange = this.handleChange.bind(this);

      
        firebase.auth().onAuthStateChanged(user =>  {
          this.setState({ user })
      })
    }

  
checkagg(){
  if(localStorage.getItem(aggreeterms)==="none"){

    this.setState({ allowUpload: false })
   
  }else{
    console.log(" aggre falsw");
    
  }
}

    componentDidMount() {
        this.getInitial();
        this.checkagg();
       
        document.getElementById('checkout').style.display = "none";
        document.getElementById('paymentSuccess').style.display = "none";
        document.getElementById('displayResults').style.display = "none";
        document.getElementById('paymentError').style.display = "none";
    }

    getInitial() {

      firebase.auth().onAuthStateChanged(user => {
        let userId = user.uid;
        let currentTime = moment().tz("America/New_York").format('YYYY-MM-DD_HH:mm:ss');
        console.log('currentTime in getInitial', currentTime)
        let time = currentTime.split("_")[1]
        let date = currentTime.split("_")[0]
        console.log('time', time);
        console.log('date', date);
      
        let fileRef = `images/${userId}/${date}/${time}`;
        this.setState({ fileRef, currentTime});
        firebase.firestore().collection('stripe_customers').doc(userId).onSnapshot(snapshot => {
              this.stripeCustomerInitialized = (snapshot.data() !== null);
            }, () => {
              this.stripeCustomerInitialized = false;
            });
           
            firebase.firestore().collection('stripe_customers').doc(userId).collection('files').onSnapshot(snapshot => {
            let newCharges = {};
             snapshot.forEach(doc => {
               const id = currentTime;
               newCharges[id] = doc.data();
             })
             this.charges = newCharges;
            }, () => {
              this.charges = {};
            });
           
      });
    }

    async togglePopup() {  
      var toastId = null;
      this.notify2 = () => this.toastId = toast.error("Please fill the patient details properly", {  autoClose: 3000 });
      this.notifyAge = () => this.toastId = toast.error("Please enter valid Age", {  autoClose: 3000 });
      this.notifyEmail = () => this.toastId = toast.error("Please enter valid Email", {  autoClose: 3000 });
      if (this.state.pname=="" || this.state.age==""){
       return this.notify2();
      }else if(this.state.age.length > 3 || this.state.age < 1 || this.state.age > 120){
        return this.notifyAge();
      }else if(this.state.pmail != "" && !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.pmail))){
        return this.notifyEmail();
      }
    else{
      let userId = await firebase.auth().currentUser.uid;
      let currentTime = this.state.currentTime

        

        await firebase.firestore().collection('stripe_customers').doc(userId).collection('files').doc(currentTime).set({
              patient_name:this.state.pname,
              email: this.state.pmail,
              age:this.state.age
          }, { merge: true });

        this.setState({  
          showPopup: !this.state.showPopup  
        });  
    }
  }  

    toggleNavigation(){
      this.setState({
        Sidebar:!this.state.Sidebar
      })
   
    }


    toastId = null;
    notify = () => this.toastId = toast.error("Please accept disclaimers by checking the checkboxes", {  autoClose: 3000 });
   
    aggreeTerm(){
     
    }

    handleLogout() {
      logout()
      .then(() => {
          localStorage.removeItem(appTokenKey);
          this.props.history.push("/login");
          console.log("User signed out from firebase");            
      });
    }

    async onChange1(ev) {
      console.log("inside onChange1", ev.target.checked);
      await this.setState({checked1: ev.target.checked});
      console.log("value",this.state.checked1);
      if ((this.state.checked1 === true && this.state.checked2 === true)){
         $('#checkboxgroup').addClass("disabled")
      }
      if ((this.state.checked1 === true && this.state.checked2 === true && this.state.allImageUpload === true)){
        console.log("inside handleUpload sucess");

      
         this.setState({makePayment: false})
      }else{
      }
    }

    async onChange2(ev) {
      console.log("inside onChange2", ev.target.checked);
      await this.setState({checked2: ev.target.checked});
      if ((this.state.checked1 === true && this.state.checked2 === true)||localStorage.getItem(aggreeterms)==="none" ){
        $('#checkboxgroup').addClass("disabled")
      }
      if ((this.state.checked1 === true && this.state.checked2 === true && this.state.allImageUpload === true)||localStorage.getItem(aggreeterms)==="none" ){
       
        this.setState({makePayment: false})
      }else{
      }
    }

    handleProgress = (progress) => this.setState({progress});
    handleProgress1 = (progress1) => this.setState({progress1});
    handleProgress2 = (progress2) => this.setState({progress2});
    handleProgress3 = (progress3) => this.setState({progress3});

    async handleUploadStart (filename){
      console.log("Inside handleUploadStart",filename)
      this.setState({isUploadingLCC: true, progress: 0})
    }

    async handleUploadStart1 (filename){
      console.log("Inside handleUploadStart",filename)
      this.setState({isUploadingRCC: true, progress1: 0})
    }

    async handleUploadStart2 (filename){
      console.log("Inside handleUploadStart",filename)
      this.setState({isUploadingL_MLO: true, progress2: 0})
    }

    async handleUploadStart3 (filename){
      console.log("Inside handleUploadStart",filename)
      this.setState({isUploadingR_MLO: true, progress3: 0})
    }

    handleUploadError =(error )=>{
      this.setState({
        isUploadingLCC: false
        // Todo: handle error
      });
      console.error(error);
    }
    handleUploadError1 =(error )=>{
      this.setState({
        isUploadingRCC: false
        // Todo: handle error
      });
      console.error(error);
    }
    handleUploadError2 =(error )=>{
      this.setState({
        isUploadingL_MLO: false
        // Todo: handle error
      });
      console.error(error);
    }
    handleUploadError3 =(error )=>{
      this.setState({
        isUploadingR_MLO: false
        // Todo: handle error
      });
      console.error(error);
    }

    

    async handleUploadSuccess (filename) {
      console.log('****filename', filename);
      if(filename === "L-CC"){
        console.log("1111111111")
        this.setState({progress: 100, isUploadingLCC: false});
      }else if(filename === "R-CC"){
        this.setState({progress1: 100, isUploadingRCC: false});
      }else if(filename === "L-MLO"){
        this.setState({progress2: 100, isUploadingL_MLO: false});
      }else if(filename === "R-MLO"){
        this.setState({progress3: 100, isUploadingR_MLO: false});
      }
      let userId = await firebase.auth().currentUser.uid;
      let currentUser = firebase.auth().currentUser;
      console.log('currentUser***********', currentUser);
     
      console.log('currentTime', this.state.currentTime) 
      let currentTime = this.state.currentTime
      console.log('currentTime', currentTime);
      let time = currentTime.split("_")[1]
      let date = currentTime.split("_")[0]
      console.log('time', time);
      console.log('date', date);
      let testpath = `images/${userId}/${date}/${time}`;
      console.log("testpath", testpath);
      let fileRef = `images/${userId}/${date}/${time}`;
      try {
        var { bucket, fullPath } = await firebase.storage().ref(fileRef).child(filename).getMetadata();
        console.log('bucket', bucket)
        console.log('fullPath', fullPath)

        var path = fullPath.split(filename)[0]
        console.log('path-------', path)

         var downloadURL = await firebase.storage().ref(fileRef).child(filename).getDownloadURL();
            console.log('downloadURL xxxx', downloadURL)
       
        
        
      } 
      catch(err) {
        console.error(err);
      }
      this.setState(oldState => ({
      filenames: [...oldState.filenames, filename],
      downloadURLs: [...oldState.downloadURLs, downloadURL],
      fullPaths: [...oldState.fullPaths, fullPath]
    }));

      const fileNames = this.state.filenames
      const downloadURLs = this.state.downloadURLs
      const fullPaths = this.state.fullPaths
      const paths = this.state.paths
      console.log('filenamesxxx', fileNames)
      console.log("fileNames length: ",fileNames.length)
      console.log("downloadURLs: ",downloadURLs)
      console.log("****path: ",path)
      
      console.log("..........filename :",filename);
        if(filename.split(".")[0] === "L-CC"){
        this.setState({allowUploadLcc: true});
      }else if(filename.split(".")[0] === "R-CC"){
        this.setState({allowUploadRcc: true});
      }else if(filename.split(".")[0] === "L-MLO"){
        this.setState({allowUploadLMLO: true});
      }else if(filename.split(".")[0] === "R-MLO"){
        this.setState({allowUploadRMLO: true});
      }

        if(filename.split('.').slice(0, -1).join('.') === 'L-CC'){
       
        //  this.setState({ LCC:downloadURL})

          filename.split('.').pop().toLowerCase()==='dcm' ? this.setState({LCC:dcmfile}):this.setState({ thumbnileLCC:downloadURL})
        }else if(filename.split('.').slice(0, -1).join('.') === 'R-CC' ){
          
        //  this.setState({ RCC:downloadURL})
          filename.split('.').pop().toLowerCase()==='dcm' ? this.setState({RCC:dcmfile}):this.setState({ RCC:downloadURL})
        }
        else if(filename.split('.').slice(0, -1).join('.') === 'L-MLO'){
         
        //  this.setState({ LMLO:downloadURL})
          filename.split('.').pop().toLowerCase()==='dcm' ? this.setState({LMLO:dcmfile}):this.setState({ LMLO:downloadURL})
        }else{
          
         // this.setState({ RMLO:downloadURL})
          filename.split('.').pop().toLowerCase()==='dcm' ? this.setState({RMLO:dcmfile}):this.setState({ RMLO:downloadURL})
        }

 
      if (fileNames.length === 4 ){
        try {
        
          let { email } = await firebase.auth().currentUser;

          let data = {
            fileLength: fileNames.length,
            fileNames: fileNames,
            url: downloadURLs,
            bucket: bucket,
            fullPaths: fullPaths,
            currentTime: currentTime,
            time: time,
            date: date,
            path: path
          }

          let filesAdded2 = await firebase.firestore().collection('stripe_customers').doc(userId).collection('files').doc(currentTime).set(data, { merge: true });
          console.log('filesAdded', filesAdded2);
          // this.setState({makePayment: false})
          await this.setState({allImageUpload: true})

          if (this.state.checked1 === true && this.state.checked2 === true && this.state.allImageUpload === true){
            console.log("inside handleUpload sucess");
            this.setState({makePayment: false})
          }

          //let userId = await firebase.auth().currentUser.uid;
          // let currentTime = this.state.currentTime

          await firebase.firestore().collection('stripe_customers').doc(userId).collection('results').doc(currentTime).set({
            payment: "pending",
            userDetails: { patient_name: this.state.pname, patient_age: this.state.age, patient_mail: this.state.pmail },
            date_time_userId: {
              date: currentTime,
              userId: userId,
            }
          });

          
        } 
        catch(err) {
          console.error(err);
        }

      }
    } 
      
    

   async handleChange(event) {
     await  this.setState({
        [event.target.name]: event.target.value
      });
      console.log('A name was onchange: ', this.state.pname);
     
      
    }
    checkAge=(e)=>{
      if(e.target.value <1){
        alert("Enter valid age")
        e.target.value=""
      }
      
    }
   

  render() {
    
    return (
         <div>
            <div>
                  
                  {/* <h1 className="show-heading title">NeuraDetect</h1>
          
                  <div className="title-desc">Get Breast Density using Artificial Intelligence. </div> */}
                  <div id="displayContent descWrappwer">
                    <div className="welcomeUser">Welcome <span className="user">{this.state.user.displayName},</span></div>
                    <div className="title-desc">Please upload DICOM or PNG images you received from Mammography procedure: &nbsp;<b>L_CC</b>, &nbsp;<b>R_CC</b>, &nbsp;<b>L_MLO</b> &nbsp; and &nbsp;<b>R_MLO</b></div>
                  <h3 className="user"> Fill the Patient Details </h3>
          
                    <Container className="uploadWarapper">

                      <div style={styles.userInfoWrapper}> 
                            <input type="text" autoComplete="off"   className="inputText" placeholder="Enter Patient Name"  name='pname'  onChange={this.handleChange} required/>
                            <input type="number" autoComplete="off"  className="inputText"  placeholder="Enter Patient Age" style={{width:'50%'}} name="age"  maxLength="3" min="1" onBlur={this.checkAge}  onChange={this.handleChange}  required/>
                            <input  type="text" autoComplete="off"  className="inputEmail" placeholder="Enter Patient Email ID"  name="pmail" onChange={this.handleChange}  required/>
                          
                      </div>
                      <hr style={styles.hr}/>
                        <Row className="show-grid" >
                           
                            <Col  md={3} sm={6} xs={12}  className="col-bottom">
                              <div className="uploadCol" style={{backgroundColor:`${ this.state.allowUploadLcc ? '#F2F2F2' : 'unset'}`}} onClick={this.aggreeTerm}>
                                <div className="labelWrapp"> <label className="dicom-label"> <img src={uploadIcon} width="28" style={{paddingRight:10}} alt=""/> Upload L_CC File</label> </div>
                                <label style={{ margin:'5%', cursor: 'pointer', height:60}}>
                                
                                    <div className="thumbnil-dicom" style={{background:`url(${ this.state.progress ? this.state.LCC : uploadBack})`}} ></div>
                                  <label style={{color:'#212529', display: 'block',fontWeight: "500", letterSpacing: "1px"}}>click here to upload</label>
                                <FileUploader
                                  hidden
                                  disabled={this.state.allowUploadLcc}
                                  accept="image/x-png, .dcm"
                                  name="L-CC"
                                  filename="L-CC"
                                  className="fileUpload"
                                  storageRef={firebase.storage().ref(this.state.fileRef)}
                                  onUploadStart={this.handleUploadStart}
                                  onUploadError={this.handleUploadError}
                                  onUploadSuccess={this.handleUploadSuccess}
                                  onProgress={this.handleProgress}
                                />
                                </label>
                               
                                <div className="progressWrap">  {this.state.isUploadingLCC &&
                                    <ProgressBar  now={this.state.progress} label={`${this.state.progress}%`}  />
                                      
                                    }
                                </div>
                              
                              </div>
                              
                            </Col>
                            <Col md={3} sm={6} xs={12}  className="col-bottom">
                            <div className="uploadCol" style={{backgroundColor:`${ this.state.allowUploadRcc ? '#F2F2F2' : 'unset'}`}} onClick={this.aggreeTerm}>
                              <div  className="labelWrapp"> <label className="dicom-label"> <img src={uploadIcon} width="28" style={{paddingRight:10}}  alt=""/> Upload R_CC File</label></div>
                              <label style={{ margin:'5%', cursor: 'pointer', height:60}}>
                                
                              <div className="thumbnil-dicom" style={{background:`url(${ this.state.progress1 ? this.state.RCC : uploadBack })`}} ></div>
                                <label style={{color:'#212529', display: 'block',fontWeight: "500", letterSpacing: "1px"}}>click here to upload</label>
                              <FileUploader
                                hidden
                                disabled={this.state.allowUploadRcc}
                                accept=".png, .dcm"
                                name="R-CC"
                                filename="R-CC"
                                className="fileUpload"
                                storageRef={firebase.storage().ref(this.state.fileRef)}
                                onUploadStart={this.handleUploadStart1}
                                onUploadError={this.handleUploadError1}
                                onUploadSuccess={this.handleUploadSuccess}
                                onProgress={this.handleProgress1}
                              />
                              </label>
                              <div className="progressWrap">  {this.state.isUploadingRCC &&
                                    <ProgressBar  now={this.state.progress1} label={`${this.state.progress1}%`}  />
                                      
                                    }</div>
                                
                          
                              </div>
                            </Col>
                            <Col  md={3} sm={6} xs={12}  className="col-bottom">
                            <div className="uploadCol" style={{backgroundColor:`${ this.state.allowUploadLMLO ? '#F2F2F2' : 'unset'}`}} onClick={this.aggreeTerm}>
                              <div  className="labelWrapp"> <label className="dicom-label"> <img src={uploadIcon} width="28" style={{paddingRight:10}}  alt=""/> Upload L_MLO File </label></div>
                              <label style={{ margin:'5%', cursor: 'pointer', height:60}}>
                                
                              <div className="thumbnil-dicom" style={{background:`url(${  this.state.progress2 ? this.state.LMLO : uploadBack } )`}} ></div>
                                <label style={{color:'#212529', display: 'block',fontWeight: "500", letterSpacing: "1px"}}>click here to upload</label>
                              <FileUploader
                                hidden
                                disabled={this.state.allowUploadLMLO}
                                accept=".png, .dcm"
                                name="L-MLO"
                                filename="L-MLO"
                                className="fileUpload"
                                storageRef={firebase.storage().ref(this.state.fileRef)}
                                onUploadStart={this.handleUploadStart2}
                                onUploadError={this.handleUploadError2}
                                onUploadSuccess={this.handleUploadSuccess}
                                onProgress={this.handleProgress2}
                              />
                              </label>
                              <div className="progressWrap">  {this.state.isUploadingL_MLO &&
                                    <ProgressBar  now={this.state.progress2} label={`${this.state.progress2}%`}  />
                                      
                                    }</div>
                                
                              </div>
                            </Col>
                            <Col  md={3} sm={6} xs={12}  className="col-bottom">
                            <div className="uploadCol" style={{backgroundColor:`${ this.state.allowUploadRMLO ? '#F2F2F2' : 'unset'}`}} onClick={this.aggreeTerm}>
                              <div  className="labelWrapp"><label className="dicom-label"> <img src={uploadIcon} width="28" style={{paddingRight:10}}  alt=""/> Upload R_MLO File</label></div>
                              <label style={{ margin:'5%', cursor: 'pointer', height:60}}>
                                
                              <div className="thumbnil-dicom" style={{background:`url(${  this.state.progress3 ? this.state.RMLO : uploadBack } )`}} ></div>
                                <label style={{color:'#212529', display: 'block',fontWeight: "500", letterSpacing: "1px"}}>click here to upload</label>
                              <FileUploader
                                hidden
                                disabled={this.state.allowUploadRMLO}
                                accept=".png, .dcm"
                                name="R-MLO"
                                filename="R-MLO"
                                className="fileUpload"
                                storageRef={firebase.storage().ref(this.state.fileRef)}
                                onUploadStart={this.handleUploadStart3}
                                onUploadError={this.handleUploadError3}
                                onUploadSuccess={this.handleUploadSuccess}
                                onProgress={this.handleProgress3}
                              />
                              </label>
                              <div className="progressWrap">  {this.state.isUploadingR_MLO &&
                                    <ProgressBar  now={this.state.progress3} label={`${this.state.progress3}%`}  />
                                      
                                    }</div>
                                
                              </div>
                            </Col>
                        </Row>
                      
                        <Row style={{fontSize: "13px"}}>
                          {this.state.isUploading &&
                            <p>Wait until progress is complete upto 100% </p>
                          }
                        </Row>
                        <div className="checkboxWrapper" id="checkboxgroup" style={{display:localStorage.getItem(aggreeterms)}} >
                      
                      {localStorage.getItem(aggreeterms)}
                    <Checkbox className="check-desc"
                      label="I agree Neura Health to run AI prediction on my provided DICOM or PNG Images. I agree to the terms and conditions."
                      checked={this.state.checked1}
                      onChange={this.onChange1.bind(this)}
                    /> 
                    <Checkbox className="check-desc"
                      label="The inferences/results are provided by running AI Model and not by any Doctor or Physician."
                      checked={this.state.checked2}
                      onChange={this.onChange2.bind(this)}
                    /> 
                  </div>
                  <div className="paymentButtonWrapper">  
                    <div className="">
                      <button disabled={this.state.makePayment} className="paymentButton" onClick={this.togglePopup.bind(this)}>Procced to Payment &nbsp; &nbsp; <img src={arrowLeft} width='9' height='12'  alt=""/> </button>  
                    </div>
          
                    {this.state.showPopup ?  
                    <Popup  style={styles.fadeInUp}
                      text='Make Payment'  
                      closePopup={this.togglePopup.bind(this)}  
                    />  
                    : null  
                    }  
                  </div>  
                    </Container>
                  </div> 
                 
                
                  <div id="displayResponse">
                    {/* <h3>Successfully uploaded all 4 DICOM Images</h3><br></br>
                    <h4>Now please make payment of $50 using Credit Card details. <br></br> Upon reciept of payment, Breast Density information will be Emailed to you in 2 hours. </h4> */}
                  </div>

                </div>
            
  
            <div id="checkout">
               <StripeProvider apiKey="pk_test_key">
                  <Elements>
                    <CheckoutForm />
                  </Elements>
               </StripeProvider>
            </div>
            <div id="paymentSuccess">
              <h3>Payment Successfull. Thank you for payment!</h3>
              <h4>You will be sent Breast Density Information within 2 hours to your registered Gmail account.If there is any issue with DICOM Images, we will reach out to you through your registered email.</h4><br></br>
              <h4>If you uploaded images during weekdays between hours of 9 to 5 EST, you will receive the breast density information in 2 hours. If its outside of the hours then you will receive info on Monday within 2 hours</h4><br></br>
              <h4>You can sign out now.</h4>
              <button onClick={this.getResults}>
                Get Results
              </button>
            </div>
            <div id="displayResults"></div>
            <div id="paymentError">
              <h3>Payment did not process successfully!</h3>
              <h4>To find out additional details please contact at <i>help@neurahealth.ai</i></h4><br></br>
              <h4>You can sign out now.</h4>
            </div>
        </div>
    );
  }
}
export default withRouter(Home)

