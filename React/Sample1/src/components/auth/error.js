import React, { Component } from 'react';

import 'bootstrap/dist/css/bootstrap.css'

class Error extends Component {
    render() { 
        return ( 
        <div>
            <div style={{margin:'10% 0',textAlign:'center'}}>
            <img src={require('../../assets/images/errorpage.png')} style={{width:'100%'}} />
            <button onClick={this.goBack} className="btn btn-primary" style={{marginTop:'10px',minWidth:'150px',borderRadius:'10px'}}>Back</button>
            </div>
        </div> );
    }
     
     goBack(){
        window.history.back(-1);
     }

}

export default Error;