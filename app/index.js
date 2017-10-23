var React     = require('react');
var ReactDOM  = require('react-dom');
import TripSorter from './tripSorter.js';
import * as rb from 'react-bootstrap';

class App extends React.Component{
      render(){
        return (
          <rb.Grid>
            <rb.Row>
                  <rb.Col xs={6} md={6} style={gridStyle}>
                    <rb.Row>
                        <rb.Col style={gridHeadingStyle}>
                              <rb.Label style={gridHeadLabelStyle}>Trip Sorter</rb.Label>
                        </rb.Col>
                    </rb.Row>
                    <rb.Row>
                        <rb.Col style={gridRowStyle}>
                              <TripSorter/>
                        </rb.Col>
                    </rb.Row>
                    </rb.Col>
              </rb.Row>
          </rb.Grid>
        )
      }
}

/*
  Styles
*/

var gridStyle = {
    marginLeft:'10px',
    marginTop:'5px',
    backgroundColor:'#e28e8c',
    borderRadius : '10px',

}

var gridRowStyle = {
    paddingLeft : '15px',
    width: '90%'
}

var gridHeadingStyle = {
    textAlign : 'center',
    marginBottom : '10px',
    fontSize : '24px',
    backgroundColor:'#2d4748',
    height: '40px',
    marginTop: '10px'
}

var gridHeadLabelStyle = {
    color:'#bd709d',
    backgroundColor : 'transparent'
}

ReactDOM.render(<App />,  document.getElementById("app"));
