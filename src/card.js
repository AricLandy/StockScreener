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

const alpha = require('alphavantage')({ key: '08Q0YI6I3581QAAU' });

class Card extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      SMA50: 0,
      SMA200: 0,
      SMAIndicator: '',
      openDropDown: false,
    };

    if (this.props.name !== ''){
      console.log("Getting data");
      this.getMovingAverages()
      .then(() => {
        this.setSMAIndicator();
      })
    }

    this.fireDelete = this.fireDelete.bind(this);
    this.getMovingAverages = this.getMovingAverages.bind(this);
    this.setDropDownOpen = this.setDropDownOpen.bind(this);
    this.setDropDownClosed = this.setDropDownClosed.bind(this);

  }

  async getMovingAverages(){
    // Get the 50 day SMA
    fetch(`https://www.alphavantage.co/query?function=SMA&symbol=${this.props.name}&interval=daily&time_period=50&series_type=open&apikey=${alpha}`).then((response) => {
      return response.json();
    })
    .then(data => {
      var movingAvgs = data['Technical Analysis: SMA'];
      var currentSMA = movingAvgs[Object.keys(data['Technical Analysis: SMA'])[0]];
      var formattedSMA = currentSMA['SMA'];
      this.setState({
        SMA50: formattedSMA
      });
    })
    .catch(error => {
      console.log(error);
    });

    // Get the 200 day SMA
    fetch(`https://www.alphavantage.co/query?function=SMA&symbol=${this.props.name}&interval=daily&time_period=200&series_type=open&apikey=${alpha}`).then((response) => {
      return response.json();
    })
    .then(data => {
      var price200 = data['Technical Analysis: SMA'][Object.keys(data['Technical Analysis: SMA'])[0]]['SMA'];
      this.setState({
        SMA200: price200
      });
      console.log("200",this.state.SMA200);
    })
    .catch(error => {
      console.log(error);
    });
  }

  setSMAIndicator(){
    var temp = this.state.SMA50 > this.state.SMA200 ? 'BUY' : 'SELL';
    this.setState({
      SMAIndicator: temp
    });
    console.log("SET DATA");

  }


  fireDelete(e){
    this.props.onDelete(this.props.index);
  }

  setDropDownOpen(){
    this.setState({
      openDropDown: true
    })
  }
  setDropDownClosed(){
    this.setState({
      openDropDown: false
    })
  }


  render(){
    if (this.props.name !== ''){
      var hideExpandIcon = ''
      if (this.state.openDropDown){
        hideExpandIcon = 'hide-icon';
      }
      var changeCSS = 'column'
      if (this.props.change > 0){
        changeCSS = 'column good change';
      }
      else if (this.props.change < 0){
        changeCSS = 'column bad change';
      }
      var row = <div className='row'>
                  <b className='column ticker'> {this.props.name}</b>
                  <p className='column price'>${this.props.price}</p>
                  <p className={changeCSS}>${this.props.change}  ({this.props.percentChange}%)</p>
                  <ExpandMoreIcon className={'click-icon column drop-icon' + hideExpandIcon} onClick={this.setDropDownOpen}/>
                </div>;
      return(
        <div>
        
        <Paper className='row-wrapper'>
          <Collapsible trigger={row}>
            <div className='expand-content'>
              <p>SMA indicator: {this.state.SMAIndicator}</p>
              {/* <ClearIcon className='column click-icon' onClick={this.fireDelete}/> */}

            
              <Button size='small' className='click-icon dropdown-button' variant="outlined" href={'https://www.google.com/search?tbm=fin&q=NASDAQ:+' + this.props.name}>
                Google Finance
              </Button>
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
