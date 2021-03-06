import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor() {
    super();
    this.state = {
      productList: [],
      productInfo: [],
      selectedProduct: '',
      showLoading: false,
      showErrorState: false
    }
    this.selectProduct = this.selectProduct.bind(this);
  }
  selectProduct(evt) {
    let self = this;
    self.setState({ selectedProduct: evt.target.value,  productInfo: [], showLoading: true, showErrorState: false});
    let url = 'products/' + evt.target.value + '/prices'
    axios.get(url).then((res) => {
      let maxVal = self.findMaxValue(res.data);
      res.data.forEach(element => {
        return element["price"] === maxVal ? element["color"] = "green" : "red";
      });
      self.setState({showLoading: false, productInfo: this.state.productInfo.concat(res.data) });
    }).catch(err=>{
      self.setState({showLoading: false, showErrorState: true });
    });
  }

  findMaxValue(data) {
    return Math.max.apply(null, data.map(function(item) {
      return item.price;
    }));
  }
  componentDidMount() {
    axios.get('products').then((products) => {
      this.setState({  productList: this.state.productList.concat(products.data) });
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Glovo Exchange</h1>
        </header>
        <main>
          <p>Please select a product from List</p>
          <select className="selector" value={this.state.selectedProduct} onChange={(evt) => this.selectProduct(evt)}>
            {
              this.state.productList.map((item) => {
                return <option key={item} id={item} value={item}>{item}</option>
              })
            }
          </select>
          <div className="Loading">{this.state.showLoading ? 'Loading.....' : ''}</div>
          <div className="Loading">{this.state.showErrorState ? 'Error Occured!! Select Another Product for List' : ''}</div>
          <div className="product-info">
            {this.state.productInfo.map(item => {
              return (
                <div className="product-info-container" key={item.exchange}>
                  <div className="exchange-title">
                    {item.exchange}
                  </div>
                  {console.log(item.color)}
                  <div className={"exchange-price  " + (item.color === 'green' ? 'green' : 'red') }>{item.price}</div>
                </div>
              )
            })}
          </div>
        </main>
      </div>
    );
  }
}

export default App;
