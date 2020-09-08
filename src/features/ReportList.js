import React, { Component } from 'react'
import { withRouter } from "react-router";
import { NavLink, Link } from 'react-router-dom';
import { firebase } from '@firebase/app';
import { Table } from 'react-bootstrap'
import { createBrowserHistory } from 'history'
import { keys } from '@material-ui/core/styles/createBreakpoints';
import Reportview from './ReportView'
import Report from './Report'
import ViewResult from './ViewResult';
import myData from './data.json'
import Skeleton from 'react-loading-skeleton';



const username = "";
var v = 0;
let result;
var resultx = [];

export class ReportList extends Component {
    constructor(props) {
        super(props)
        this.state = { user: '', usernames: [], results: [], dates: [] }
        this.getReports = this.getReports.bind(this)

    }

   
    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            console.log("user----", user.uid);
            this.setState({ user: user.uid, username: user.displayName, mail: user.email, })
            // const userId = this.state.user.uid;

            console.log("user+id from state ", this.state.user);
            this.getReports();
        })

    }


    async getReports(props) {
        // window.location.reload();
        const userId = this.state.user;
        console.log("from state userId", userId);
        try {
            firebase.firestore().collection('stripe_customers').doc(userId).collection('results').onSnapshot(snapshot => {
                this.setState({ results: [], dates:[], usernames:[] })
                snapshot.forEach(doc => {
                    let date = doc.id;
                    console.log('date ', date);
                   
                    
                    result = JSON.stringify(doc.data());
                    console.log("result", result);
                    var username = this.state.username

                    // if (result){
                    this.setState(oldState => ({
                        dates: [...oldState.dates, date],
                        usernames: [...oldState.usernames, username],
                        results: [...oldState.results, JSON.parse(result)]
                    }));

                // }
                console.log(" date ***",this.state.dates);
               
                  

                })

            });
        }
        catch (err) {
            console.error(err);
        }

     
    }




    render() {

        return (
            <div id="displayReports">
                <h3 className="title">  Inferences  </h3>

                <div style={styles.noteWrapp}>
                    <h4> Note : If you have recently made the payments, results will be displayed within 5 minutes.</h4>
                </div>

                {/* {this.state.reports[0]} */}
                <div className="list"></div>
                <Table responsive style={{ marginTop: '2%', border: '1px solid #000' }} >
                    <thead>
                        <tr>
                            <th> Sr.No.</th>
                            <th> Date_Time </th>
                            <th> Patient Name </th>
                            <th> Patient Age </th>
                            <th> View </th>
                        </tr>
                    </thead>
                    <tbody>
                        
                        {this.state.results.slice(0).reverse().map((rec, i) => {
                            console.log("rec.payment",rec.payment);
                           

                            if (rec.payment == "succeeded" ) {
                                // window.location.reload();
                                console.log("1111111111");
                                return (
                                    <tr key={i}>
                                        <td > {v = i + 1 || <Skeleton />}   </td>
                                        {/* <td > {rec.all_results ? rec.date_time_userId.date+"  "+rec.date_time_userId.time : <Skeleton />}   </td> */}
                                        <td > { rec.date_time_userId? rec.date_time_userId.date: <Skeleton />} </td>
                                        <td > { rec.userDetails ? rec.userDetails.patient_name : <Skeleton />} </td>
                                        <td > { rec.userDetails ? rec.userDetails.patient_age : <Skeleton /> } </td>
                                        <td > { <Link className="text-success"  to={{ pathname: '/app/viewresult', state: { reportId: rec.date_time_userId.date } }}>View Reports </Link> || <Skeleton />} </td>
                                
                                    </tr>
                                )
                            } else if(rec.payment == "succeeded") {
                                console.log("22222222222");
                                return (
                                    <tr key={i}>
                                        <td> {v = i + 1} </td>
                                        {/* <td > { this.state.dates[i] } </td> */}
                                        <td > { rec.date_time_userId? rec.date_time_userId.date: <Skeleton />} </td>
                                        <td > { rec.userDetails ? rec.userDetails.patient_name : <Skeleton />} </td>
                                        <td > { rec.userDetails ? rec.userDetails.patient_age : <Skeleton /> } </td>
                                        <td > Results in process </td>
                                    </tr>
                                )
                            } else if (rec.payment == "succeeded" ) {
                                console.log("22222222222");
                                return (
                                    <tr key={i}>
                                        <td> {v = i + 1} </td>
                                        {/* <td > { this.state.dates[i] } </td> */}
                                        <td > {rec.date_time_userId ? rec.date_time_userId.date : <Skeleton />} </td>
                                        <td > {rec.userDetails ? rec.userDetails.patient_name : <Skeleton />} </td>
                                        <td > {rec.userDetails ? rec.userDetails.patient_age : <Skeleton />} </td>
                                        <td > {rec.BI_RADS_prediction.msg} </td>
                                    </tr>
                                )
                            } else if(rec.payment == "error" ) {
                                console.log("3333333333");
                                return (
                                    <tr key={i}>
                                        <td> {v = i + 1} </td>
                                        <td > { rec.date_time_userId? rec.date_time_userId.date: <Skeleton />} </td>
                                        <td > { rec.userDetails ? rec.userDetails.patient_name : <Skeleton /> } </td>
                                        <td > { rec.userDetails ? rec.userDetails.patient_age : <Skeleton /> } </td>
                                        <td > Payment Fail </td>
                                    </tr>
                                )
                            } else if(rec.payment == "pending" ) {
                                console.log("44444444444");
                                return (
                                    <tr key={i}>
                                        <td> {v = i + 1} </td>
                                        <td > { rec.date_time_userId? rec.date_time_userId.date: <Skeleton />} </td>
                                        <td style={{textTransform:"capitalize"}} > { rec.userDetails ? rec.userDetails.patient_name : <Skeleton /> } </td>
                                        <td > { rec.userDetails ? rec.userDetails.patient_age : <Skeleton /> } </td>
                                        <td > Payment Not Done </td>
                                    </tr>
                                )
                            } 
                        }, this)}
                    </tbody>

                </Table>

            </div>
        )
    }
}

export default ReportList


const styles = {
    noteWrapp: {
        color: 'red',
        marginTop: '2%'
    }
}
