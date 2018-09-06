import React, { Component } from 'react';
import Landing from './components/landing';
import { HashRouter, Route, Switch } from "react-router-dom";
import './scss/App.css';
import Test from './components/test';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route exact path="/" component={Landing} />
        <Route exact path="/login" component={Test} />
      </div>
    );
  }
}

export default App;
