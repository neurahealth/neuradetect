import React, { Component } from 'react'
import Lottie from 'react-lottie';
import animationData from '../assets/lottie/loader.json';

export class Loader extends Component {
    
constructor(props){
    super(props);
    this.state = { isStopped: false, isPaused: false };

}
    render() {
        const defaultOptions = {
            loop: true,
            autoplay: true,
            animationData: animationData,
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
            }
        };
        return (
            <div style={styles.container}>
                
                <Lottie options={defaultOptions} height={200} width={300}
                    isStopped={this.state.isStopped}
                    isPaused={this.state.isPaused} />  
                <h3>please wait loading...</h3>
            </div>
        )
    }
}
const styles ={
    container:{
        display:'flex',
        justifyContent:'center',
        background:'#f8f8f9',
        alignIteam:'center',
        flexDirection:'column',
        backgroundRepeat: 'no- repeat',
        height:'100vh',
        textAlign:'center'
        
    }
}
export default Loader
