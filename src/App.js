import React from 'react';
import './App.css';


class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      response: {},
      data: [],
      name: '',
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.getValues = this.getValues.bind(this);
  }

  componentDidMount() {
    this.getValues();
  }

  getValues(){
    const alpha = require('alphavantage')({ key: '08Q0YI6I3581QAAU' });
    alpha.data.daily(this.state.name.toString())
    .then(response => {
      console.log(response);
      this.setState({
        name: response['Meta Data']['2. Symbol'],
        data: Object.values(response['Time Series (Daily)'])
      });
    })
    .catch(err => {
        console.error(err);
    });
  }

  handleSubmit(value){
    console.log("Handle Submit", value);
    this.setState({
      name: value,
    })
    this.getValues();
  }


  render(){
    return(
      <div>
        <input type="text" name="ticker"
          onKeyPress={event => {
            if(event.key === 'Enter') {
              this.handleSubmit(event.target.value)
            }
          }}
        />

        <h1>{this.state.name}</h1>
        <div>
          {this.state.data.map((item) => (
            <p> {item['1. open']} </p>
          ))}
        </div>

      </div>
    )
  }
}

export default App;
