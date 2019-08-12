import React from 'react';
import './App.css';
import Card from './card.js';
// import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
// import IconButton from '@material-ui/core/IconButton';


class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      num_stocks: 0,
      data: [],
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.getValues = this.getValues.bind(this);
  }

  // componentDidMount() {
  // }

  validate(term){
    console.log('validate');

    for(var i = 0; i < this.state.data.length; ++i){
      console.log(this.state.data[i].name);
      if (this.state.data[i].name === term.toString().toUpperCase()){
        return false;
      }
    }
    return true;
  }

  getValues(searchTerm){
    console.log('getvals');
    // Validate the Input
    if (!this.validate(searchTerm)){
      window.alert("invalid input");
      return;
    }

    // Todo -- set this to an environment variable
    const alpha = require('alphavantage')({ key: '08Q0YI6I3581QAAU' });
    alpha.data.quote(searchTerm.toString().toUpperCase())
    .then(response => {
      console.log(response);

      // var stockData = response['Time Series (Daily)'][date];
      var stockData = response['Global Quote'];
      var new_data = this.state.data.concat({
        'name': stockData['01. symbol'],
        'open': stockData['02. open'],
        'close': stockData['03. high'],
        'high': stockData['04. low'],
        'price': stockData['05. price']
      });
      this.setState({
        data: new_data
      })
      console.log(this.state);

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
    console.log("Render app", this.state.data);

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

        {this.state.data.map(obj =>
          (<Card name={obj.name}
                open={obj.open}
                high={obj.high}
                low={obj.low}
                price={obj.price}/>),
        )}


      </div>
    )
  }
}

export default App;
//   // <Card data={this.state.data.toString()}/>
// {this.state.data}
// <Card name={this.state.data[0].name}
//       open={this.state.data[0].open}
//       high={this.state.data[0].high}
//       low={this.state.data[0].low}
//       price={this.state.data[0].price}/>
// <Paper>
//   <h1>{this.state.name}</h1>
//   <div>
//     <p>Open: {this.state.data.open}</p>
//     <p>High: {this.state.data.high}</p>
//     <p>Low: {this.state.data.low}</p>
//     <p>Close: {this.state.data.close}</p>
//   </div>
// </Paper>
