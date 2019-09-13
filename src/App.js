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
import red from '@material-ui/core/colors/red';
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
    secondary: red,
  },
  status: {
    danger: 'orange',
  },
});

// I know my key is visible, I don't want the user to have to input their own, it's a free tier so feel free to use it (Lol)
const alpha = require('alphavantage')({ key: '08Q0YI6I3581QAAU' });
const roundTo = require('round-to');

class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      num_stocks: 0,
      data: [],
      displayData: [],
      dialogOpen: false,
      dialogText: '',
      filterTerm: '',
      dialogErrorMessage: '',
      waitToAdd: [],
    };

    // this.getValues = this.getValues.bind(this);
    this.removeOne = this.removeOne.bind(this);
    this.addStock = this.addStock.bind(this);
    this.handleAddStock = this.handleAddStock.bind(this);
    this.handleAddStockFromButton = this.handleAddStockFromButton.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.handleOpenDialog = this.handleOpenDialog.bind(this);
    this.setDialogTextValue = this.setDialogTextValue.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
  }

  componentDidMount(){
    // Get the session data from the database
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


  // Add a stock to the list
  async addStock(searchTerm){
    console.log("adding stock", searchTerm);
    return alpha.data.quote(searchTerm.toString().toUpperCase())
    .then(response => {
      // var stockData = response['Time Series (Daily)'][date];
      var stockData = response['Global Quote'];
      // Check if actual data was returned
      if (!stockData['01. symbol']) {
         throw new Error("invlid")
      }
      // Validate the Input
      // Validate after to prevent error of pushing enter twice and adding before API returns
      if (!this.validate(searchTerm)){
        // this._toast(`${searchTerm.toUpperCase()} has already been added`);
        this.setState({
          dialogErrorMessage: "This stock has already been added"
        });
        return false;
      }
      // Set the data
      var new_data = this.state.data.concat({
        'name': stockData['01. symbol'],
        'price': parseFloat(stockData['05. price']),
        'change': parseFloat(stockData['09. change']),
        'percentChange': parseFloat(stockData['10. change percent']),
      });
      this.setState({
        data: new_data
      });
      this.updateFilter(this.state.filterTerm);
      return true;
    })
    .catch((error) => {
      // console.log("Returning false");
      if (error.substring(50, 57) === "Invalid"){
        this.setState({
          dialogErrorMessage: 'Invlid symbol'
        });
        return false;
      }
      this.setState({
        dialogErrorMessage: "Due to using free data, this exchange will automatically be added as soon as possible"
      });
      return false;
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
    var newData = this.state.data;
    newData.splice(index, 1);
    this.setState({
      data: newData
    });
    this.updateFilter(this.state.filterTerm);
  }

  handleAddStockFromButton(e){
    this.handleAddStock(this.state.dialogText);
  }

  handleAddStock(symbol){
    if (symbol){
      if (this.state.waitToAdd.length > 0){
        this.addToWaitList(symbol);
      }
      else {
        this.addStock(symbol).then(response => {
          if (response === true){
            this.handleCloseDialog();
          }
          else if (response === false && this.state.dialogErrorMessage !== 'Invlid symbol'){
            this.addToWaitList(symbol);
          }
        });
      }
    }
  }

  addToWaitList(symbol){
    console.log("symbol = ", symbol);
    var temp = this.state.waitToAdd;
    temp.push(symbol);
    this.setState({
      waitToAdd: temp
    });

    console.log("Set temp to", temp);
    console.log("adding in ", 60000*(Math.round(this.state.waitToAdd.length / 2)));
    
    setTimeout(() => { 
      console.log("Running", this.state.waitToAdd[0]);
      this.addStock(this.state.waitToAdd[0]);
      this.state.waitToAdd.shift();
    }, 60000*(this.state.waitToAdd.length));
  }

  handleOpenDialog(e){
    this.setState({
      dialogOpen: true
    })
  }

  handleCloseDialog(e){
    this.setState({
      dialogOpen: false,
      dialogErrorMessage: ''
    })
  }

  setDialogTextValue(e){
    this.setState({
      dialogText: e.target.value
    });
  }

  updateFilter(filter){
    this.setState({
      filterTerm: filter
    })
    var tempData = [];
    for(var i = 0; i < this.state.data.length; ++i){
      if (this.state.data[i].name.includes(filter)){
        tempData.push(this.state.data[i]);
      }
    }
    this.setState({
      displayData: tempData
    });
  }




  render(){
    return(
      <MuiThemeProvider className='f' theme={theme}>
        <Paper className='search-bar'>
          <InputBase className='search-input'
            onChange={event => this.updateFilter(event.target.value.toUpperCase())}
            placeholder='Filter by symbol'>
          </InputBase>
          <SearchIcon className='search-icon' color='primary'/>
        </Paper>

        <Fab onClick={this.handleOpenDialog} className='fab' color="primary" size='medium'>
            <AddIcon />
        </Fab>


        {this.state.displayData.map((obj, index) =>
          (<Card key={obj.id}
                index={index}
                name={obj.name}
                price={obj.price}
                change={obj.change}
                percentChange={obj.percentChange}
                onDelete={this.removeOne}/>),
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

      <Dialog open={this.state.dialogOpen} onClose={this.handleCloseDialog} aria-labelledby="form-dialog-title"
        onKeyPress={event => {
          if(event.key === 'Enter') {
            this.handleAddStock();
          }}}>
        <DialogTitle id="form-dialog-title">Add New Stock</DialogTitle>
        <DialogContent>
          <TextField onChange={this.setDialogTextValue} autoFocus margin="dense" id="name" label="Symbol" />
          <DialogContentText color='secondary'>
            {this.state.dialogErrorMessage}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={this.handleCloseDialog} >
            Cancel
          </Button>
          <Button onClick={this.handleAddStockFromButton} >
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
