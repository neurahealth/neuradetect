import React, { Component } from 'react'
import { withRouter } from "react-router";
import { firebase } from '@firebase/app';
import {Table} from 'react-bootstrap'
import { createBrowserHistory } from 'history'
import BootstrapTable from 'react-bootstrap-table-next';


  var v = 0;
  let charge ;
  const browserHistory = createBrowserHistory();

 
export class PaymentsList extends Component {

    constructor(props){
        super(props)
        this.state = { user:'',charges:[], date:[]}
        this.getCharges = this.getCharges.bind(this)

        firebase.auth().onAuthStateChanged(user =>  {
            console.log("user----",user.uid);
            this.setState({ user: user.uid,username:user.displayName,mail:user.email, })
           // const userId = this.state.user.uid;

            console.log("user+id from state ",this.state.user);
            this.getCharges();
           
        })

    }

  componentDidMount(){
    const {history}=this.props;
    console.log("payment list",history.location.pathname);

    browserHistory.push('paymentslist')
    
  }


    async getCharges(props){
        console.log("user+id from get charges ",this.state.user);
        const userId = this.state.user;
      
      console.log("from statexxxx",this.state.user);
      
      let val = await firebase.firestore().collection('stripe_customers').doc(userId).get();
      console.log('val', val.data());
      let resultId = val.data().resultId
      console.log('resultId', resultId);
      try {
      firebase.firestore().collection('stripe_customers').doc(userId).collection('charges').onSnapshot(snapshot => {
            snapshot.forEach(doc => {
                let date = doc.id
                let data = doc.data();
                charge = JSON.stringify(doc.data());
                // this.setState({ charges: data});
                // console.log('charges',charges)

                console.log(" doc", doc.data());
                let username = this.state.username
                this.setState(oldState => ({
                  charges: [...oldState.charges, JSON.parse(charge) ],
                  date: [...oldState.date, date ]
              }));

              

                console.log("charges",this.state.charges);
                
                
                
            })
      });
    }
    catch(err) {
        console.error(err);
      }
    } 

    renderTableData() {
      return  this.state.charges.slice(0).reverse().map((charges,i) => {
         return (
            <tr key={i}>
               <td>{v=i+1}</td>
               <td> {charges.resultId}</td>
               <td>{charges.billing_details ? charges.billing_details.name : "-"}</td>
               <td>${charges.amount?charges.amount/100 ?30:30:0}</td>
               <td>{charges.status}</td>
               <td>{charges.balance_transaction ? charges.balance_transaction : "-"}</td>
            </tr>
         )
      })
   }

   renderTableHeader() {
    let header = ["Sr.No.","Date_Time","First Name on Card","Amount","Payments Status","Transaction ID"]
    return header.map((key, index) => {
       return <th key={index}>{key}</th>
    })
 }

    render() {
      
        return (
            <div id="displayCharges">
             <h3 className="title"> Payments  </h3>  

             <Table responsive style={{ marginTop:'5%',border:'1px solid #000'}} >
             <thead>
                 <tr>
                    {this.renderTableHeader()}
                </tr> 
                    
            </thead>
            <tbody>
               {this.renderTableData()}
            </tbody>

            </Table>
            
            </div>
        )
    }
}

export default withRouter(PaymentsList)
