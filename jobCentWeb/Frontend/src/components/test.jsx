import React, { Component } from "react";
import "../scss/components/landing.css";
import { Link } from "react-router-dom";

class Test extends React.Component {
    render() {  
        return <div className="landing">
            <br />
            <br />
            <Link to="/">Home</Link>
            <br />
            <br />
            <img src="http://chateaucats.com/wp-content/uploads/2017/07/Cat-under-construction-2.png" alt="" />
            <br />
            <br />
          </div>;
    }
}

export default Test;
