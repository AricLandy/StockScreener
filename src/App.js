import React from 'react';
import './App.css';
import Card from './card.js';
// import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { css } from 'glamor';
// import IconButton from '@material-ui/core/IconButton';


class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      num_stocks: 0,
      data: [],
    }

    this.getValues = this.getValues.bind(this);
  }

  validate(term){
    for(var i = 0; i < this.state.data.length; ++i){
      console.log(this.state.data[i].name);
      if (this.state.data[i].name === term.toString().toUpperCase()){
        return false;
      }
    }
    return true;
  }

  getValues(searchTerm){
    // Validate the Input
    if (!this.validate(searchTerm)){
      this._toast(`${searchTerm.toUpperCase()} has already been added`);
      return;
    }

    // Todo -- set this to an environment variable
    const alpha = require('alphavantage')({ key: '08Q0YI6I3581QAAU' });
    alpha.data.quote(searchTerm.toString().toUpperCase())
    .then(response => {

      // var stockData = response['Time Series (Daily)'][date];
      var stockData = response['Global Quote'];

      // Check if actual data was returned
      if (!stockData['01. symbol']) {
         throw new Error("invlid")
      }
      
      // Set the data
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

    })
    .catch((error) => {
        this._toast("Error");
        console.log("error", error);
    });
  }

  _toast(message){
    toast(message,{
      className: css({
        background: 'black'
      }),
    })
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

        <ToastContainer position="bottom-center"
          autoClose={5000}
          hideProgressBar={true}
          newestOnTop={true}
          closeButton={false}
          closeOnClick
          rtl={false}
          draggable
          pauseOnHover
          >
          Aric Landy
          </ ToastContainer>


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
