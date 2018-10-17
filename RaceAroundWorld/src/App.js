import React, { Component } from 'react';
import './App.css';

import Geolocation from './components/geolocate';


class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Stopwatch</h1>
        <Geolocation />
        <center>
        </center>
      </div>
    );
  }
}



export default App;
