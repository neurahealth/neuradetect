import React, { Component } from 'react'
import { withRouter } from "react-router";
import { firebase } from '@firebase/app';
import {Table, Modal} from 'react-bootstrap'
import BootstrapTable from 'react-bootstrap-table-next';
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import dcmfile from '../assets/images/dcmfile.png'

var v = 0;
let charge ;

 
export class UploadsList extends Component {

	constructor(props){
        super(props)
        this.state = { user:'',files:[], dateTime:[],isOpen:false,photoIndex:"", fileType:""}
        this.getFileUploads = this.getFileUploads.bind(this)
        this.handleClick = this.handleClick.bind(this)

        firebase.auth().onAuthStateChanged(user =>  {
            console.log("user----",user.uid);
            this.setState({ user: user.uid,username:user.displayName,mail:user.email })
           // const userId = this.state.user.uid;

            console.log("user+id from state ",this.state.user);
            this.getFileUploads();
           
        })

    }

    async getFileUploads(props){
        console.log("user+id from get files ",this.state.user);
        const userId = this.state.user;
      
      console.log("from statexxxx",this.state.user);
      
      let val = await firebase.firestore().collection('stripe_customers').doc(userId).get();
      console.log('val', val.data());
      let resultId = val.data().resultId
      console.log('resultId', resultId);
      this.setState({ resultId: resultId })
      try {
      firebase.firestore().collection('stripe_customers').doc(userId).collection('files').onSnapshot(snapshot => {
            snapshot.forEach(doc => {
            	let dateTime = doc.id.split("_")[0] + " " + doc.id.split("_")[1]
                charge = JSON.stringify(doc.data());
              //  console.log(" doc", JSON.parse(charge).fileNames);
                this.setState(oldState => ({
                  files: [...oldState.files, JSON.parse(charge) ],
                  dateTime: [...oldState.dateTime, dateTime ]
              }));               
            })
      });
      console.log("files",this.state.files);
    }
    catch(err) {
        console.error(err);
      }
    } 

handleClick=(e)=>{
        console.log("img url",e);
        this.setState({ isOpen: true,photoIndex:e })

    }

    findFile=(e)=>{
      if(e.split('.').pop().toLowerCase()==="dcm"){
        this.setState({fileType:"dcm"})
        console.log("fileT",this.state.fileType);
        
      }
    }

    render() {
        return (
            <div id="displayFiles">
             <h3 className="title"> Uploads  </h3>  

             <Table responsive style={{ marginTop:'5%',border:'1px solid #000'}} >
             <thead>
                 <tr>
                    <th > Sr.No.</th>
                    <th > Date_Time </th>
                    <th > Patient Name</th>
                    <th>  Age</th>
                    {/* <th> Email</th> */}
                    <th > Files </th>
                </tr>
            </thead>
            <tbody>
               { this.state.files.slice(0).reverse().map((files,i)=>
                 <tr key={i}> 
                    <td >{v=i+1}</td>
                    <td >{files.currentTime} </td>
                    <td >{files.patient_name} </td>
                    <td >{files.age} </td>
                    {/* <td >{files.email} </td> */}
                  
                    <td style={styles.rowData}> 
                        <div style={styles.wrapImgData} onClick={() => this.handleClick(files.url[0])} > 
                            {this.findFile(files.url[0])
                               
                            }{this.state.fileType}
                            <img src={files.fileNames[0].split('.').pop().toLowerCase()==="dcm"?dcmfile:files.url[0]} style={styles.imgData}/>{files.fileNames[0]}  
                        </div> 
                        <div style={styles.wrapImgData} onClick={() => this.handleClick(files.url[1])}>
                            <img src={files.fileNames[0].split('.').pop().toLowerCase()==="dcm"?dcmfile:files.url[1]} style={styles.imgData}/>{files.fileNames[1]}  
                        </div> 
                        <div style={styles.wrapImgData} onClick={() => this.handleClick(files.url[2])}>
                            <img src={files.fileNames[0].split('.').pop().toLowerCase()==="dcm"?dcmfile:files.url[2]} style={styles.imgData}/>{files.fileNames[2]}  
                        </div> 
                        <div style={styles.wrapImgData} onClick={() => this.handleClick(files.url[3])}>
                            <img src={files.fileNames[0].split('.').pop().toLowerCase()==="dcm"?dcmfile:files.url[3]} style={styles.imgData}/>{files.fileNames[3]}  
                        </div> 
                                 {this.state.isOpen &&( <Lightbox
                                    mainSrc={this.state.photoIndex}
                                    onCloseRequest={() => this.setState({ isOpen: false })}
                               
                                /> )}
                    </td>
                    </tr>

                  
               )}
               
            </tbody>

            </Table>
           
        


            </div>
        )
    }
}

export default UploadsList
const styles = {
    wrapImgData:{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center"
    },
    imgData:{
        width:'50px',
        height:'50px',
        borderRadius:"4"
    },
    rowData:
    { display: "flex", justifyContent: "space-between" },
    img: { borderRadius: "4px !important" } ,
    ".ril__outer": { opacity: "0.5" }
}