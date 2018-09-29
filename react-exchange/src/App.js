import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state={
      productList: []
    }
  }
  componentDidMount() {
    axios.get('products');
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Glovo Exchange</h1>
        </header>
      </div>
    );
  }
}

export default App;
