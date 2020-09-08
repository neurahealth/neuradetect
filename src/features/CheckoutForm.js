import React, { Component } from "react";
import { CardElement, injectStripe } from "react-stripe-elements";
import { firebase } from '@firebase/app';
import "./CheckoutForm.css";
import logo from './logo.png';
import arrowLeft from '../assets/images/arrow-forward.png';
import moment from 'moment-timezone'; 


class CheckoutForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: 0,
      currency: "",
      name: "",
      clientSecret: null,
      error: null,
      metadata: null,
      disabled: false,
      succeeded: false,
      processing: false,
      currentUser: null,
      paymentStatus: "",
      stripeCustomerInitialized: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

 

  componentDidMount() {
    console.log('Inside componentDidMount');
    document.getElementById('paymentSuccess').style.display = "none";
    document.getElementById('displayResults').style.display = "none";
    document.getElementById('paymentError').style.display = "none";
  }

  async handleSubmit(ev) {
    ev.preventDefault();
    if (this.props.stripe) {
      let email = firebase.auth().currentUser.email;
      console.log('email', email);
      let uid = firebase.auth().currentUser.uid;
      console.log('uid', uid);
      let userName = this.refs.name.value
      let amount = this.refs.amount.value
      console.log('amount', amount);
      let val = await firebase.firestore().collection('stripe_customers').doc(uid).get();
      console.log('val', val.data());
      let resultId = val.data().resultId
      console.log('resultId', resultId);
      let currentTime = moment().tz("America/New_York").format('YYYY-MM-DD_HH:mm:ss');
      console.log('currentTime in getInitial', currentTime)
      let time = currentTime.split("_")[1]
      let date = currentTime.split("_")[0]
      console.log('time', time);
      console.log('date', date);
      if (userName === "" || amount === ""){
        console.log('inside blank field')
        this.setState({
          processing: false,
          error: 'Please fill all details'
        });
        return;
      }
      console.log('After blank validation success');
      const { error, token } = await this.props.stripe.createToken({name: userName});
      console.log('token first time', token);
      this.setState({
        processing: true,
        disabled: true,
      });
      if (error){
        console.log('inside invalid token error', error)
        this.setState({
          processing: false,
          error: `Payment failed: ${error.message}`
        });
        return;
      }
     
      firebase.firestore().collection('stripe_customers').doc(uid).onSnapshot(snapshot => {
        this.stripeCustomerInitialized = (snapshot.data() !== null);
      }, () => {
        this.stripeCustomerInitialized = false;
      });
            
            firebase.firestore().collection('stripe_customers').doc(uid).collection('charges').onSnapshot(snapshot => {
            let newCharges = {};
             snapshot.forEach(doc => {
               const id = currentTime;
               newCharges[id] = doc.data();
             })
             this.charges = newCharges;
            }, () => {
              this.charges = {};
            });
            

      try {
      

        await firebase.firestore().collection('stripe_customers').doc(uid).collection('charges').doc(currentTime).set({
          token: token.id,
          amount: parseInt(amount),
          resultId: resultId,
          currentTime: currentTime
        });

        firebase.firestore().collection("stripe_customers").doc(uid).collection('charges').doc(currentTime)
  .onSnapshot(function(doc) {            
              console.log("change.doc.data()", doc.data());
                const status = doc.data().status
                console.log('status @@@',status);
                if (status === "succeeded"){
                  console.log('Inside payment success................');
                 

                  firebase.firestore().collection('stripe_customers').doc(uid).collection('results').doc(resultId).update({
                      payment: "succeeded"
                  });
                  
                  document.getElementById('displayResponse').style.display = "none";
                  document.getElementById('checkout').style.display = "none";
                  document.getElementById('paymentSuccess').style.display = "block";
                  document.getElementById('paymentError').style.display = "none";
                  document.getElementById('displayResults').style.display = "none";
                  return;
                }
                else if (status === "error"){
                 

                  firebase.firestore().collection('stripe_customers').doc(uid).collection('results').doc(resultId).update({
                    payment: "error"
                  });
                  document.getElementById('displayResponse').style.display = "none";
                  document.getElementById('checkout').style.display = "none";
                  document.getElementById('paymentSuccess').style.display = "none";
                  document.getElementById('displayResults').style.display = "none";
                  document.getElementById('paymentError').style.display = "block";
                  return;
                }
                // setPaymentStatus(uid, resultId, status);
  });
        
       

      } catch (error) {
        console.log('error2', error);
        this.setState({
          processing: false,
          error: `Payment failed: ${error}`
        });
      }
      
    } else {
      console.log("Stripe.js hasn't loaded yet.");
    }
  }

  async setPaymentStatus(uid, resultId, status){
    console.log("***************************");
    if (status === "succeeded"){
      console.log("Inside payment status succeeded---");
      await firebase.firestore().collection('stripe_customers').doc(uid).collection('results').doc(resultId).set({
          payment: "succeeded"
      });
    }else if(status === "error"){
      console.log("Inside payment status error---");
      await firebase.firestore().collection('stripe_customers').doc(uid).collection('results').doc(resultId).set({
          payment: "error"
      });
    }
  }

  renderSuccess() {
    return (
      <div className="sr-field-success message ">
        <h1>Your test payment succeeded</h1>
        <p>View PaymentIntent response:</p>
        <pre className="sr-callout">
          <code>{JSON.stringify(this.state.metadata, null, 2)}</code>
        </pre>
      </div>
    );
  }

 

  renderForm() {
    var style = {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4"
        }
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    };
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="popupWrappre">
        <img src={logo} className="popupLogo" width="80%" alt="logo" />
      
      <div className="modalHead"> NeuraDetect</div>
      <div className="modalDesc"> Get Breast Density, BI-RADS Prediction, Breast Cancer Classification using 
          Artificial Intelligence. </div>

        <div className="paymentDesc">
        Please make the payment of $30 using credit card details, Upon receipt of payment you will be able to view results. 

        </div>
        <div className="paymentHead">
        Make the payment
        </div>

        <div className="sr-combo-inputs paymentInputWrapper ">
            {/* <label>Name</label> */}
          <div className="sr-combo-inputs-row">
            <input
              type="text"
              id="name"
              ref="name"
              placeholder="Name"
              autoComplete="cardholder"
              className="sr-input"
            />
          </div>
          {/* <label>Amount</label> */}
          <div className="sr-combo-inputs-row">
            <input
              type="number"
              id="amount"
              ref="amount"
              value="30"
              autoComplete="cardholder"
              className="sr-input"
              disabled={true}
              style={{background: '#dddddd'}}
            />
          </div>

          {/* <label>Card Details</label> */}
          <div className="sr-combo-inputs-row">
            <CardElement className="sr-input sr-card-element" onReady={(c) => this._element = c} style={style} />
          </div>
        </div>

          <div className="message sr-field-error" >{this.state.error ? this.state.error : <div style={{color:'black'}}> * all fields are madatory</div>}</div>

        {!this.state.succeeded && (
         
          <button className="btnPayemnt" disabled={this.state.disabled}>
            {this.state.processing ? "Processing ": "Proceed to Pay "}
           {this.state.processing ? "...":(<img src={arrowLeft} width='9' height='12' style={{marginLeft:10}} alt=""/>)}
          </button>
        )}
        
        </div>
      </form>
    );
  }

  render() {
    return (
     
      <div className="checkout-form">
        
        <div className="sr-payment-form">
          <div className="sr-form-row" />
            {this.state.succeeded && this.renderSuccess()}
            {!this.state.succeeded && this.renderForm()}

         
        </div>
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);