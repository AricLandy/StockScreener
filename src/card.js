import React from 'react';
import Paper from '@material-ui/core/Paper';
// import Card from '@material-ui/core/Card';
import './App.css';


class Card extends React.Component{
  constructor(props){
    super(props)
    console.log("!!!!!", this.props.data);

    const alpha = require('alphavantage')({ key: '08Q0YI6I3581QAAU' });
    alpha.data.quote("MSFT").then((response) => {
      console.log(response);
    });


    // this.state = {
    //   name: this.props.data
    //   // data: this.props.name;
    // }
    // console.log("CARD", this.state.name, this.props, props)

  }

  // componentDidMount() {
  // }


  render(){
    if (this.props.name !== ''){
      return(
        <Paper className='card'>

          <h3 className='tick'> {this.props.name} </h3>
          <p className='price'>{this.props.price}</p>

        </Paper>
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
