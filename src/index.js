import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './assets/css/style.css';
import registerServiceWorker from './registerServiceWorker';
import { Redirect, Route, Switch } from 'react-router';
import { Router } from 'react-router-dom';
// createBrowserHistory comes from react-router
// import createBrowserHistory from 'history/createBrowserHistory';
import { createBrowserHistory } from 'history'
import Login from './features/Login';
import Home from './features/Home';
import ViewResult from './features/ViewResult'
import DocHome from './features/doctor/Home'
import { PaymentsList } from './features/PaymentsList';
import App from './features/App';
// import PacsSetting from './features/doctor/PacsSetting';
// import Report from './features/Report'
// import ReportList from './features/ReportList';

const customHistory = createBrowserHistory();

const Root = () => {
	return (
		<Router history={customHistory}>
			<Switch>
				<Route exact={true} path="/login" component={Login} />
				<Route  path="/app" component={App} />
				 <Route  path="/app/doctor/home" component={DocHome} />
				<Redirect from="/" to="/login" />
			</Switch>
		</Router>	
	)
}

ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();
