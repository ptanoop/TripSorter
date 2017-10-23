var React     = require('react');
var ReactDOM  = require('react-dom');
import * as rb from 'react-bootstrap';
import * as tripMaster from "./tripMasterModule.js";
import ShowRoute from './showRoute.js';
import ToggleDisplay from 'react-toggle-display';

var routeSearchResult = null;

export default class TripSorter extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            showSelector : true,
            showRoute : false,
            searchMode : 'Cheapest',
            selectedDeparture : '',
            selectedArrival : ''
        }
    }

    formSelOptions(item){ return <option key={item} value={item}>{item}</option>; }

    onDepartureChange(e){
        this.setState({selectedDeparture : e.target.value});
    }

    onArrivalChange(e){
      this.setState({selectedArrival : e.target.value});
    }

    searchRoutes(){
      if(this.state.selectedDeparture !='' && this.state.selectedArrival != ''
            && this.state.selectedArrival != this.state.selectedDeparture){
        console.log(this.state.selectedDeparture+ "  " + this.state.selectedArrival);
        this.setState({showSelector : false});
        if(this.state.searchMode=='Fastest'){
            routeSearchResult = tripMaster.findFastestRoute(this.state.selectedDeparture, this.state.selectedArrival);
        }
        else {
            routeSearchResult = tripMaster.findCheapestRoute(this.state.selectedDeparture, this.state.selectedArrival);
        }
      }
    }

    selectCheapestSearchMode(){
        this.setState({searchMode : "Cheapest"});
    }

    selectFastestSearchMode(){
        this.setState({searchMode : "Fastest"});
    }

    resetSearchRoutes(){
        this.setState({
          showSelector : true,
          searchMode : "Cheapest",
          selectedDeparture : '',
          selectedArrival : ''
        });
    }

    render(){
      return(
      <rb.FormGroup controlId="formControlsSelect">
          <ToggleDisplay show={this.state.showSelector}>
            <rb.Row style={rowStyle}>
                <rb.Col>
                    <rb.Label style={selectLabel}>From</rb.Label>&nbsp;
                    <rb.FormControl onChange={this.onDepartureChange.bind(this)}
                            value={this.state.selectedDeparture}
                            componentClass="select" placeholder="From">
                        <option key='select' value=''>Select</option>
                        {tripMaster.allDepartures.map(this.formSelOptions)}
                    </rb.FormControl>
                </rb.Col>
            </rb.Row>
            <rb.Row style={rowStyle}>
                <rb.Col>
                    <rb.Label style={selectLabel}>To</rb.Label>
                    <rb.FormControl onChange={this.onArrivalChange.bind(this)}
                           value={this.state.selectedArrival}
                           componentClass="select" placeholder="To">
                        <option key='select' value=''>Select</option>
                        {tripMaster.allArrivals.map(this.formSelOptions)}
                    </rb.FormControl>
                </rb.Col>
            </rb.Row>
            <rb.Row style={rowStyle}>
                <rb.Col xs={6} md={6} style={buttonColStyle}>
                    <rb.Button onClick={this.selectCheapestSearchMode.bind(this)}
                        style={Object.assign({}, buttonLabelStyle,
                          (this.state.searchMode=='Cheapest')?buttonLabelClickedStyle:null)}>
                              Cheapest</rb.Button>
                </rb.Col>
                <rb.Col xs={6} md={6} style={buttonColStyle}>
                    <rb.Button onClick={this.selectFastestSearchMode.bind(this)}
                        style={Object.assign({}, buttonLabelStyle, (
                          this.state.searchMode=='Fastest')?buttonLabelClickedStyle:null)}>
                              Fastest</rb.Button>
                </rb.Col>
            </rb.Row>
            <rb.Row style={rowStyle}>
                <rb.Col>
                  <rb.Button style={searchButtonStyle}
                        onClick={this.searchRoutes.bind(this)}>Search</rb.Button>
                </rb.Col>
            </rb.Row>
            <br/>
          </ToggleDisplay>
          <ToggleDisplay show={!this.state.showSelector}>
              <rb.Row style={rowStyle}>
                  <rb.Col>
                    <ShowRoute
                          departure   = {this.state.selectedDeparture}
                          arrival     = {this.state.selectedArrival}
                          searchMode  = {this.state.searchMode}
                          currency    = {tripMaster.currency}
                          resultRoute = {routeSearchResult}/>
                  </rb.Col>
              </rb.Row>
              <rb.Row style={rowStyle}>
                  <rb.Col>
                    <rb.Button style={searchButtonStyle}
                          onClick={this.resetSearchRoutes.bind(this)}>Reset</rb.Button>
                  </rb.Col>
              </rb.Row>
          </ToggleDisplay>
        </rb.FormGroup>
      )
    }
}


/*
    Styles
*/


var rowStyle = {
    marginLeft:'10px',
    marginBottom:'15px'
};

var selectLabel = {
    fontSize:'15px'
}

var searchButtonStyle = {
    width : '100%',
    backgroundColor: '#f5f5dc',
    color: '#a52a2a'
}

var buttonLabelStyle = {
    width : '100%',
    height: '35px'
}

var buttonLabelClickedStyle = {
    backgroundColor : '#92b9e8'
}

var buttonColStyle = {
    padding:'0px'
}
