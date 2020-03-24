import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';

class Navbar extends Component {

    render() { 
        return ( 
        <nav className="navbar">
        <div className="navbar-header">
                {/* <a className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse" aria-expanded="false"></a>
                <i class="material-icons bars">keyboard_backspace</i> */}
                <Link className="navbar-brand" to="/Home">DITS</Link>
        </div>
    </nav> );
    }
}
 
export default Navbar;