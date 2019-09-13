import React from 'react';
import Paper from '@material-ui/core/Paper';
import Delete from '@material-ui/icons/DeleteOutlined';
import ClearIcon from '@material-ui/icons/Clear';
// import { Row, Cell } from 'react-inline-grid';
// import Card from '@material-ui/core/Card';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Expand from 'react-expand-animated';
import Collapsible from 'react-collapsible';
import Button from '@material-ui/core/Button';

import './App.css';

// I know my key is visible, I don't want the user to have to input their own, it's a free tier so feel free to use it (Lol)
const alpha = require('alphavantage')({ key: '08Q0YI6I3581QAAU' });

class Card extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      SMA50: 0,
      SMA200: 0,
      SMAIndicator: '',
      openDropDown: false,
      hist50: [],
      hist200: []
    };

    this.fireDelete = this.fireDelete.bind(this);
    this.get50SMA = this.get50SMA.bind(this);
    this.get200SMA = this.get200SMA.bind(this);
    this.changeDropDown = this.changeDropDown.bind(this);

  }

  get50SMA(){
    // Get the 50 day SMA
    fetch(`https://www.alphavantage.co/query?function=SMA&symbol=${this.props.name}&interval=daily&time_period=50&series_type=open&apikey=${alpha}`).then((response) => {
      return response.json();
    })
    .then(data => {
      var movingAvgs = data['Technical Analysis: SMA'];
      var currentSMA = movingAvgs[Object.keys(data['Technical Analysis: SMA'])[0]];
      var formattedSMA = currentSMA['SMA'];
      var histData = []
      histData.push(movingAvgs[Object.keys(data['Technical Analysis: SMA'])[10]], movingAvgs[Object.keys(data['Technical Analysis: SMA'])[20]], movingAvgs[Object.keys(data['Technical Analysis: SMA'])[30]]);
      this.setState({
        SMA50: formattedSMA,
        hist50: histData
      });
      console.log("50",this.state.SMA50);
    })
    .catch(error => {
      console.log(error);
    });
  }
  get200SMA(){
    // Get the 200 day SMA
    fetch(`https://www.alphavantage.co/query?function=SMA&symbol=${this.props.name}&interval=daily&time_period=200&series_type=open&apikey=${alpha}`).then((response) => {
      console.log('response', response);
      return response.json();
    })
    .then(data => {
      console.log('data', data);
      // var price200 = data['Technical Analysis: SMA'][Object.keys(data['Technical Analysis: SMA'])[0]]['SMA'];
      var movingAvgs = data['Technical Analysis: SMA'];
      var currentSMA = movingAvgs[Object.keys(data['Technical Analysis: SMA'])[0]];
      var formattedSMA = currentSMA['SMA'];
      var histData = []
      histData.push(movingAvgs[Object.keys(data['Technical Analysis: SMA'])[10]], movingAvgs[Object.keys(data['Technical Analysis: SMA'])[20]], movingAvgs[Object.keys(data['Technical Analysis: SMA'])[30]]);
      this.setState({
        SMA200: formattedSMA,
        hist200: histData
      });
      console.log("200",this.state.SMA200);
    })
    .catch(error => {
      console.log(error);
    });
  }

  setSMAIndicator(){
    var hist = this.histLower();
    console.log('hist', hist);
    var curr = this.state.SMA50 > this.state.SMA200;
    var temp = 'Hold'
    // 50 just went above 200
    if (hist === 200 && curr === true){
      temp = 'BUY';
    }
    // 50 just went below 200
    else if (hist === 50 && curr === false){
      temp = 'SELL';
    }
    console.log('temp', temp);
    this.setState({
      SMAIndicator: temp
    });
  }

  histLower(){
    console.log('200');
    console.log(this.state.hist200);
    console.log('50');
    console.log(this.state.hist50);
    var result = 0;
    for (var i = 0; i < this.state.hist200.length; ++i){
      if (this.state.hist200 < this.state.hist50){
        ++result;
      }
      else{
        --result;
      }
    }
    console.log('result', result);
    if (result === this.state.hist200.length){
      return 200;
    }
    if (result === -1*this.state.hist200.length){
      return 50;
    }
    return 0;
  }


  fireDelete(e){
    this.props.onDelete(this.props.index);
  }

  changeDropDown(){
    var temp = true;
    if (this.state.openDropDown === true){
      temp = false;
    }
    this.setState({
      openDropDown: temp
    })
  }

  // Get the prediction data
  componentDidMount(){
     if (this.props.name !== ''){
      // console.log("Getting data");
      this.get50SMA();
      this.get200SMA();
      // Have to get values from SMAs before setting the indicator at all
      this.setSMAIndicator();
    }
  }


  render(){
   
    console.log("rendering");
    console.log(this.state.hist200);
    console.log(this.state.hist50);
    console.log('done');

    if (this.props.name !== ''){
      var hideExpandIcon = ''
      if (this.state.openDropDown){
        hideExpandIcon = 'hide-icon';
      }
      var changeCSS = 'column';
      var change = '';
      if (this.props.change > 0){
        changeCSS = 'column good change';
        change = '+';
      }
      else if (this.props.change < 0){
        changeCSS = 'column bad change';
      }
      // console.log("Render", this.state.openDropDown);
      var expand_icon =  this.state.openDropDown === true ? <ExpandLessIcon className={'click-icon column drop-icon' + hideExpandIcon} onClick={this.changeDropDown}/> : <ExpandMoreIcon className={'click-icon column drop-icon' + hideExpandIcon} onClick={this.changeDropDown}/> ;
      var row = <div className='row' onClick={this.changeDropDown}>
                  <b className='column ticker'> {this.props.name}</b>
                  <p className='column price'>${this.props.price.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                  <p className={changeCSS}>{change}{this.props.change.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                  <p className={changeCSS}>{change}{this.props.percentChange.toFixed(2)}%</p>
                  {expand_icon}
                </div>;
      return(
        <div>
        
        <Paper className='row-wrapper'>
          <Collapsible trigger={row}>
            <div className='expand-content'>
              <p>SMA indicator (50 day and 200 day): {this.state.SMAIndicator}</p>
              {/* <ClearIcon className='column click-icon' onClick={this.fireDelete}/> */}
              <Button size='small' className='click-icon dropdown-button' variant="outlined" href={'https://www.google.com/search?tbm=fin&q=NASDAQ:+' + this.props.name}>
                Google Finance
              </Button>
              &nbsp;&nbsp;&nbsp;
              <Button size='small' className='click-icon dropdown-button' variant="outlined" color="secondary" onClick={this.fireDelete}>
                Remove
              </Button>

            </div> 
          </Collapsible>
        </Paper>

        
        <br />
        </div>
      )
    }
    else {
      return (
        <p></p>
        )
      }
      
    }
  }
  // Card.propTypes = {
    //   data: PropTypes.string.isRequired,
    // };
    export default Card;
    
    // <b>Open: </b><p>{this.props.open}</p>
    // <b>High: </b><p>{this.props.high}</p>
    // <b>Low: </b><p>{this.props.low}</p>
    
    // <Row is="center">
    // <p> 200: {this.state.SMA200} 50: {this.state.SMA50} </p>
//   <Cell is="3 tablet-4 phone-4"><div>content_a</div></Cell>
//   <Cell is="3 tablet-4 phone-4"><div>content_b</div></Cell>
// </Row>
