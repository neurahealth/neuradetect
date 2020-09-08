import React, { Component } from 'react'
import {  Switch,withRouter } from 'react-router';
import { BrowserRouter as Router ,Route} from 'react-router-dom';
import Home from './Home'
import UploadsList from './UploadsList'
import ReportList from './ReportList'
import { PaymentsList } from './PaymentsList'
import ViewResult from './ViewResult'
import Report from './Report'
import { Sidebar } from './Sidebar'
import Footer from './Footer'
import {ToastContainer, toast } from 'react-toastify';
import Header from './Header'
import Reportview from './ReportView'
export class App extends Component {
    render() {
        return (
            <div className="pageWrapper">
            <div className="headerWrapper">
               {/* header Component  */}
            <Header/>
            </div>
            <div className="homeWrapper"> 
            {/* forceRefresh={false} */}
        <Router >

            <Sidebar/>
            <ToastContainer
              position="top-center"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnVisibilityChange
              draggable
              pauseOnHover
              />

            <div className="upload-deatils">
              
              <Switch> 
                  <Route exact path='/app/home' component={Home} />
                  <Route exact path='/app/' component={Home} />
                  <Route exact path='/app/uploadslist' component={UploadsList} />
                  <Route exact path='/app/reportlist' component={ReportList} />
                  <Route exact path='/app/paymentslist' component={PaymentsList} />
                  <Route exact={true} path="/app/viewresult" component={ViewResult} />
                  <Route exact path="/app/Report" component={Report} />
                  <Route exact path="/app/Reportview" component={Report} />
                 
                 
             </Switch>
            </div>
          </Router>
            </div>
           <Footer/>
            </div>
    
              
        )
    }
}

export default App
