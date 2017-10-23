var React     = require('react');
var ReactDOM  = require('react-dom');
import * as rb from 'react-bootstrap';
import * as tripMaster from "./tripMasterModule.js";

var currency    = '';
var departure   = '';
var arrival     = '';
var searchMode  = '';

export default class ShowRoute extends React.Component{
      constructor(props){
          super(props);
          this.state = {
              showingRouteIndex : 0
          }
      }

      moveForward(){
        if(this.state.showingRouteIndex < this.props.resultRoute.length - 1)
          this.setState({
            showingRouteIndex : (this.state.showingRouteIndex + 1)
          });
      }

      moveBackward(){
        if(this.state.showingRouteIndex > 0)
          this.setState({
              showingRouteIndex : (this.state.showingRouteIndex - 1)
          });
      }

      render(){
          var routeDeals = [];
          if(this.props.resultRoute!=null){
              if(departure!=this.props.departure){
                  this.state.showingRouteIndex = 0;
              }
              currency          = this.props.currency;
              departure         = this.props.departure;
              arrival           = this.props.arrival;
              searchMode        = this.props.searchMode;
              var routes            = [];
              var totalRoutesCount  = 0
              if(this.props.resultRoute[this.state.showingRouteIndex]!=null &&
                  this.props.resultRoute[this.state.showingRouteIndex].route){
                    routes            = this.props.resultRoute[this.state.showingRouteIndex].route.split(",");
                    totalRoutesCount  = this.props.resultRoute.length;
              }
              var totalCost = 0;
              var totalTime = 0;
              routeDeals.push(
                  <rb.Row key="routeHead1">
                      <rb.Col xs={12} md={12}>
                        <rb.Row style={routeHeaderRow}>
                            <rb.Col xs={4} md={4}>
                                {departure}
                            </rb.Col>
                            <rb.Col xs={4} md={4}>
                                &gt;
                            </rb.Col>
                            <rb.Col xs={4} md={4}>
                                {arrival}
                            </rb.Col>
                        </rb.Row>
                        <rb.Row>
                            <rb.Col xs={12} md={12} style={navText}>
                                <rb.Button style={routeHeaderButton}
                                    onClick={this.moveBackward.bind(this)}> &lt; </rb.Button>
                                <rb.Label>
                                  Showing Route : {this.state.showingRouteIndex + 1} of {totalRoutesCount} Results
                                  - &nbsp;
                                  {searchMode} first
                                </rb.Label>
                                <rb.Button style={routeHeaderButton}
                                    onClick={this.moveForward.bind(this)}>  &gt;  </rb.Button>
                            </rb.Col>
                        </rb.Row>
                    </rb.Col>
                </rb.Row>
              )
              routes.forEach(function(route){
                  var deal = tripMaster.tripMapByRef[route];
                  var cost = deal.cost - deal.cost * deal.discount / 100;
                  totalCost = totalCost + cost;
                  var timeInMinutes = parseInt(deal.duration.h) * 60 + parseInt(deal.duration.m);
                  totalTime = totalTime + timeInMinutes;
                  routeDeals.push(
                      <rb.Row key={route}  style={rowStyle}>
                        <rb.Col>
                          <rb.Row>
                              <rb.Col xs={6} md={6} style={routeColumn}>
                                        {deal.departure} > {deal.arrival}
                              </rb.Col>
                              <rb.Col xs={6} md={6} style={costColumn}>{cost} €</rb.Col>
                          </rb.Row>
                          <rb.Row>
                              <rb.Col style={durationColumn}>
                                  <rb.Label> {deal.transport} </rb.Label> &nbsp;
                                  <rb.Label> {deal.reference} </rb.Label> &nbsp;
                                  <rb.Label> {deal.duration.h}h{deal.duration.m}m </rb.Label> &nbsp;
                              </rb.Col>
                          </rb.Row>
                        </rb.Col>
                      </rb.Row>
                  );
              })

              routeDeals.push(
                  <rb.Row key="total" style={totalRowStyle}>
                      <rb.Col xs={4} md={4}>
                          Total
                      </rb.Col>
                      <rb.Col xs={4} md={4} style={totalColumn}>
                          {Math.floor(totalTime/60)}h {totalTime%60}m
                      </rb.Col>
                      <rb.Col xs={4} md={4} style={totalColumn}>
                          {totalCost} {currency}
                      </rb.Col>
                  </rb.Row>
              );
          }
          return(
              routeDeals
          )
      };
}

/*
  Sytles
*/
var rowStyle = {
    padding:'10px',
    borderRadius:'10px',

    marginBottom:'5px',
    backgroundColor:'#e0d8ba',
    color:'#a52a2a'
}

var routeColumn = {
    fontSize : '15px'

}

var costColumn = {
    textAlign: 'right'
}

var durationColumn = {
    paddingLeft:'10px',
    fontSize : '15px',
    fontStyle : 'italic'
}

var totalRowStyle = {
    paddingTop:'10px',
    paddingBottom:'10px',
    borderRadius:'10px',
    marginBottom:'5px',
    backgroundColor:'#e0b66a',
    color:'#a52a2a'
}

var totalColumn = {
    textAlign:'center'
}

var placeSeparater = {
    color:'#fff',
    backgroundColor: '#777'
}

var routeHeaderRow ={
    marginBottom: '2px',
    textAlign:'center',
    fontSize:'18px',
    fontStyle:'italic',
    backgroundColor:'#d8b3b3',
    borderRadius:'10px',
    color:'#a52a2a'
}

var moveForwardStyle = {
    fontSize : '10px',
    textAlign : 'center'
}

var moveBackwardStyle = {
    fontSize : '10px',
    textAlign : 'center'
}

var navText = {
    fontSize : '15px',
    textAlign : 'center'
}

var routeHeaderButton = {
    padding:'5px',
    marginBottom :'2px',
    lineHeight:'1',
    fontSize:'10px'
}
