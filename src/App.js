import React from 'react';
import './App.css';
import Card from './card.js';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { css } from 'glamor';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { createMuiTheme } from '@material-ui/core/styles';
import indigo from '@material-ui/core/colors/indigo';
import green from '@material-ui/core/colors/green';
import { MuiThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


const theme = createMuiTheme({
  palette: {
    primary: indigo,
    secondary: green,
  },
  status: {
    danger: 'orange',
  },
});
// Todo -- make this an environment variable
const alpha = require('alphavantage')({ key: '08Q0YI6I3581QAAU' });



class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      num_stocks: 0,
      data: [],
      dialogOpen: false,
    }

    this.getValues = this.getValues.bind(this);
    this.removeOne = this.removeOne.bind(this);
    this.addStock = this.addStock.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.handleOpenDialog = this.handleOpenDialog.bind(this);

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
    alpha.data.quote(searchTerm.toString().toUpperCase())
    .then(response => {

      // var stockData = response['Time Series (Daily)'][date];
      var stockData = response['Global Quote'];
      console.log("HERE", response);

      // Check if actual data was returned
      if (!stockData['01. symbol']) {
         throw new Error("invlid")
      }

      // Validate the Input
      // Validate after to prevent error of pushing enter twice and adding before API returns
      if (!this.validate(searchTerm)){
        this._toast(`${searchTerm.toUpperCase()} has already been added`);
        return;
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
  removeOne(index){
    console.log("remove one", this.state.data, index);
    var newData = this.state.data;
    newData.splice(index, 1);
    this.setState({
      data: newData
    });
  }

  addStock(e){
    console.log("open add dialog");
  }

  handleOpenDialog(e){
    this.setState({
      dialogOpen: true
    })
  }

  handleCloseDialog(e){
    this.setState({
      dialogOpen: false
    })
  }




  render(){
    console.log("Render app", this.state.data);

    return(
      <MuiThemeProvider theme={theme}>
        <Paper className='search-bar'>
          <InputBase className='search-input'
            placeholder='Search stocks'
            onKeyPress={event => {
              if(event.key === 'Enter') {
                this.getValues(event.target.value)
              }

            }}>

        </InputBase>
        <SearchIcon className='search-icon' color='primary'/>

        </Paper>

        {this.state.data.map((obj, index) =>
          (<Card key={obj.id}
                index={index}
                name={obj.name}
                open={obj.open}
                high={obj.high}
                low={obj.low}
                price={obj.price}
                onDelete={this.removeOne}/>),
        )}

        <Fab onClick={this.handleOpenDialog} className='fab' position="bottom-right" color="primary" size='medium'>
            <AddIcon />
        </Fab>


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



      <Dialog open={this.state.dialogOpen} onClose={this.handleCloseDialog} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add New Stock to List</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" id="name" label="Symbol" fullWidth/>
        </DialogContent>

        <DialogActions>
          <Button onClick={this.handleCloseDialog} >
            Cancel
          </Button>
          <Button onClick={this.addStock} >
            Add
          </Button>
        </DialogActions>
      </Dialog>


      </MuiThemeProvider>
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
