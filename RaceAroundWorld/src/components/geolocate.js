import React from 'react';
import { Component } from 'react';
import {geolocated} from 'react-geolocated';


const millisToMinutesAndSeconds = (millis) => {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(2);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds ;
}

class Geolocate extends Component {
    state = {
        status: false,
        runningTime: 0,
        rows: [],
        count: 0,
        start: 0
    };

    handleClick = () => {
        this.setState(state => {
            if (state.status) {
                clearInterval(this.timer);
            } else {
                const startTime = Date.now() - this.state.runningTime;
                this.timer = setInterval(() => {
                this.setState({ runningTime: Date.now() - startTime });
              });
            }
            this.handleAddRow();
            return { status: !state.status
            };
        });
    };

    handleReset = () => {
        clearInterval(this.timer);
        this.setState({ runningTime: 0, status: false, count: 0 });
    };

    handleGeolocate = () => {
        return (!this.props.isGeolocationAvailable
                ? <div>Your browser does not support Geolocation</div>
            : !this.props.isGeolocationEnabled
                ? <div>Geolocation is not enabled</div>
            : this.props.coords
                ? <table>
                    <tbody>
                        <tr><td>latitude: </td><td>{this.giveLocation()[0]}</td></tr>
                        <tr><td>longitude: </td><td>{this.giveLocation()[1]}</td></tr>
                    </tbody>
                </table>
            : <div>Getting the location data&hellip; </div>
            );
    }
    giveLocation = () => {
        if (!this.props.isGeolocationAvailable || !this.props.isGeolocationEnabled) {
            return ["NA", "NA"];
        }
        return ([Math.round((this.props.coords.latitude* 100) )/ 100,
             Math.round((this.props.coords.longitude* 100))/ 100]);
    }

    handleAddRow = () => {
        const time = this.state.runningTime;
        const tracker = (this.state.status ? this.state.count: this.state.count + 1);
        const countDisplay = (this.state.status ? '': tracker);
        const delta = millisToMinutesAndSeconds(this.state.runningTime - this.state.start);
        const dur = (this.state.status ? delta: '-------');
        const row = {
            rownum: countDisplay,
            starttime: millisToMinutesAndSeconds(time),
            duration: "" + dur,
            latitude: "" + this.giveLocation()[0] ,
            longitude: "" + this.giveLocation()[1]
        };
        this.setState((prevState, props) => {
            return { rows: [...prevState.rows, row], count: tracker, start: time };
        });
    };

    handleRemoveRow = () => {
        this.handleReset();
        this.setState((prevState, props) => {
            return { rows: [] };
      });
    };

    render() {
        const { status, runningTime } = this.state;
        return (<div>
            <p class = "timer">
                Current time: {millisToMinutesAndSeconds(runningTime)}
            </p>
            <button id = "start" onClick={this.handleClick}>
                {status ? 'STOP' : 'START'}
            </button>
              <button id = "reset" onClick={this.handleRemoveRow}>RESET</button>
            <center>
            <table>
                <thead>
                    <tr>
                        <th>Iteration</th>
                        <th>Time</th>
                        <th>Elapsed</th>
                        <th>Latitude</th>
                        <th>Longitude</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.rows.map(row => (
                        <tr>
                            <td>{row.rownum}</td>
                            <td>{row.starttime}</td>
                            <td>{row.duration}</td>
                            <td>{row.latitude}</td>
                            <td>{row.longitude}</td>
                        </tr>))
                    }
                </tbody>
        </table>
        </center>
        </div>)
    }
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(Geolocate);
