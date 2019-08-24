import React from 'react';
import Paper from '@material-ui/core/Paper';
import Delete from '@material-ui/icons/DeleteOutlined';
import ClearIcon from '@material-ui/icons/Clear';
// import { Row, Cell } from 'react-inline-grid';
// import Card from '@material-ui/core/Card';
import './App.css';


class Card extends React.Component{
  constructor(props){
    super(props)
    console.log("!!!!!", this.props.data);

    // const alpha = require('alphavantage')({ key: '08Q0YI6I3581QAAU' });
    // alpha.data.quote("MSFT").then((response) => {
    //   console.log(response);
    // });

    this.fireDelete = this.fireDelete.bind(this);


  }


  fireDelete(e){
    this.props.onDelete(this.props.index);
  }


  render(){
    if (this.props.name !== ''){
      var changeCSS = 'column'
      if (this.props.change > 0){
        changeCSS = 'column increase';
      }
      else if (this.props.change < 0){
        changeCSS = 'column decrease';
      }
      return(
        <div>
        <div className='row'>
          <h6 className='column'> {this.props.name}</h6>
          <p className='column'>{this.props.price}</p>
          <p className={changeCSS}>{this.props.change}  ( {this.props.percentChange} )</p>
          <ClearIcon className='column delete-icon' onClick={this.fireDelete}/>

        </div>
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
//   <Cell is="3 tablet-4 phone-4"><div>content_a</div></Cell>
//   <Cell is="3 tablet-4 phone-4"><div>content_b</div></Cell>
// </Row>
