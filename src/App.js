import React from 'react';
import './App.css';
import Card from './card.js';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';


class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      response: {},
      data: {},
      name: '',
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.getValues = this.getValues.bind(this);
  }

  // componentDidMount() {
  //   this.nameInput.focus();
  // }

  getValues(searchTerm){
    // Todo -- set this to an environment variable
    const alpha = require('alphavantage')({ key: '08Q0YI6I3581QAAU' });
    alpha.data.daily(searchTerm.toString().toUpperCase())
    .then(response => {
      console.log(response);
      console.log(response['Time Series (Daily)']);

      // Get todays most recent price
      var d = new Date();

      var date = `${d.getFullYear()}-${("0" + d.getMonth()).slice(-2)}-${("0" + d.getDay()).slice(-2)}`;
      date = "2019-08-02"; // Todo remove this
      console.log(date);

      var stockData = response['Time Series (Daily)'][date];
      console.log(stockData);
      this.setState({
        name: response['Meta Data']['2. Symbol'],
        data: {
          open: stockData['1. open'],
          close: stockData['2. high'],
          high: stockData['3. low'],
          low: stockData['4. close']
        }
      });
      console.log(this.state.data);
    })
    .catch(err => {
        console.error(err);
    });
  }

  handleSubmit(value){
    console.log("Handle Submit", value);
    this.setState({
      name: value.toUpperCase(),
    })
    this.getValues();
  }


  render(){
    console.log("HERE");
    // console.log(this.state.data)
    // var card;
    // card = this.state.data === {} ? '' : this.state.data;
    return(
      <div>
        <Paper className='search-bar'>
          <InputBase className='search-input'
            placeholder='Search stocks'
            onKeyPress={event => {
              if(event.key === 'Enter') {
                this.getValues(event.target.value)
              }

            }}>

        </InputBase>
        <SearchIcon className='search-icon'/>

        </Paper>

        <Card name={this.state.name}
              open={this.state.data.open}
              high={this.state.data.high}
              low={this.state.data.low}
              close={this.state.data.close}/>
      </div>
    )
  }
}

export default App;
//   // <Card data={this.state.data.toString()}/>
// {this.state.data}

// <Paper>
//   <h1>{this.state.name}</h1>
//   <div>
//     <p>Open: {this.state.data.open}</p>
//     <p>High: {this.state.data.high}</p>
//     <p>Low: {this.state.data.low}</p>
//     <p>Close: {this.state.data.close}</p>
//   </div>
// </Paper>
