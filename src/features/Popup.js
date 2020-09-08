import React from 'react';
import { Elements, StripeProvider } from "react-stripe-elements";
import CheckoutForm from "./CheckoutForm";
import PaymentSuccess from "./PaymentSuccess";
import '../assets/css/style.css';
import PaymentFailed from './PaymentFailed';

class Popup extends React.Component {  

	 constructor(props) {
        super(props);
        this.state = { apiKey: null };
    }

  	render() {  
		return (  
			<div className='popup'>  
				<div className='popupInner'>  

					<div id="checkout">
							<button onClick={this.props.closePopup}  className="btnClose">X</button>
               			<StripeProvider apiKey="pk_test_key">
                  			<Elements>
                    			<CheckoutForm />
                  			</Elements>
               			</StripeProvider>
						  
            		</div>
					<div id="paymentSuccess">
						<PaymentSuccess/>
					</div>
					<div id="paymentError">
					<PaymentFailed close={this.props.closePopup}/>
					</div>
				</div>  
			</div>  
		);  
	}  
}  

export default Popup;