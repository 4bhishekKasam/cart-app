import React, { Component } from "react";
import Filter from "./Components/Filter";
import Products from "./Components/Products";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size: "",
      sort: "",
      cartItems: [],
      products: [],
      filteredProducts: []
    };
    this.handleAddToCart = this.handleAddToCart.bind(this);
    this.handleSizeChange = this.handleSizeChange.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
  }

  componentWillMount() {
    fetch("http://localhost:8000/products")
      .then(res => res.json())
      .then(data => {
        this.setState({ products: data }, () =>
          console.log(this.state.products)
        );
        this.listProducts();
      });
  }

  handleSortChange(e) {
    this.setState({ sort: e.target.value });
    this.listProducts();
  }

  handleSizeChange(e) {
    this.setState({ size: e.target.value });
    this.listProducts();
  }

  listProducts() {
    this.setState(state => {
      if (state.sort !== "") {
        state.products.sort((a, b) =>
          state.sort === "lowestprice"
            ? a.price > b.price
              ? 1
              : -1
            : a.price < b.price
            ? 1
            : -1
        );
      } else {
        state.products.sort((a, b) => (a.id > b.id ? 1 : -1));
      }

      return { filteredProducts: state.products };
    });
  }

  handleAddToCart = (e, product) => {
    this.setState(
      state => {
        const cartItems = state.cartItems;
        let productAlreadyInCart = false;

        cartItems.forEach(item => {
          if (item.id === product.id) {
            item.count += 1;
            productAlreadyInCart = true;
          }
        });

        if (!productAlreadyInCart) {
          cartItems.push({ ...product, count: 1 });
        }
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        return { cartItems: cartItems };
      },
      () => console.log(this.state.cartItems)
    );
  };

  render() {
    const {} = this.state;

    return (
      <div className="container">
        <h1>E-commerce Shopping Cart Application</h1>
        <hr />
        <div className="row">
          <div className="col-md-9">
            <Filter
              count={this.state.filteredProducts.length}
              handleSortChange={this.handleSortChange}
              handleSizeChange={this.handleSizeChange}
            />
            <hr />
            <Products
              products={this.state.filteredProducts}
              handleAddToCart={this.handleAddToCart}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
