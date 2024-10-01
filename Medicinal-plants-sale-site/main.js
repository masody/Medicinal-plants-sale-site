const productsDom = document.querySelector(".Products");
const countProduct = document.querySelector("#cart-count");
const cartContent = document.querySelector(".selected-products-container");
const totalPriceSelectedProduct = document.querySelector(
  '[data-id="total-price"]'
);
const signUpPage = document.querySelector(".hepol");
const body = document.querySelector("body");

import { plants } from "./plants.js";

let cart = [];

let buttonDOM = [];

class Products {
  getProducts() {
    return plants;
  }
}

class UI {
  displayProducts(products) {
    let result = "";
    products.forEach((item) => {
      result += `
           <div class="product">
           <div class="product-image">
               <img src="${item.image}" alt="${item.heading}" class="red-flower">
           </div>
           <h4 class="heading-text">${item.heading}</h4>
           <p class="product-description">${item.description}</p>
           <span class="price-product">${item.price}$</span>
           <button class="add-cart" data-id=${item.id}>add to cart</button>
       </div>`;
    });

    productsDom.innerHTML = result;
  }
  getAddToCart() {
    const addToButton = [...document.querySelectorAll(".add-cart")];
    buttonDOM = addToButton;
    addToButton.forEach((btn) => {
      const getId = btn.dataset.id;
      const isInCart = cart.find((p) => p.id === parseInt(id));

      if (isInCart) {
        btn.innerText = "In Cart";
        btn.disabled = true;
      }

      btn.addEventListener("click", (e) => {
        e.target.innerText = "In Cart";
        e.target.disabled = true;
        const addedProduct = { ...Storeage.getProduct(getId), quantity: 1 };
        cart = [...cart, addedProduct];
        Storeage.saveProducts(cart);
        this.setTotalValue(cart);
        this.addCartItem(addedProduct);
      });
    });
  }
  setTotalValue(cart) {
    let countCartProduct = 0;
    const totalPrice = cart.reduce((acc, curr) => {
      countCartProduct += curr.quantity;
      return acc + curr.quantity * curr.price;
    }, 0);
    totalPriceSelectedProduct.innerText = `total price : ${totalPrice.toFixed(
      2
    )} $`;
    countProduct.innerText = countCartProduct;

    // console.log(cart);
  }
  addCartItem(cartItem) {
    const creatItem = document.createElement("div");
    creatItem.classList.add("selected-product");
    creatItem.innerHTML += `
       <img src="${cartItem.image}" alt="${cartItem.heading}">
       <div class="product-information">
          <h4 class="heading-product-name">${cartItem.heading}</h4>
          <span class="price-product">${cartItem.price}$</span>
        </div>
        <div class="number-of-product-container">
        <span class="increase-number-of-product" data-id ="${cartItem.id}">+</span>
        <span class="number-of-product">${cartItem.quantity}</span>
        <span class="decraese-number-of-product" data-id ="${cartItem.id}">-</span>
        </div>
            <i class="fa-solid fa-trash-can" data-id ="${cartItem.id}"></i>`;
    cartContent.appendChild(creatItem);
  }
  setUpApp() {
    cart = Storeage.getCartItem() || [];
    cart.forEach((cartItem) => this.addCartItem(cartItem));
    this.setTotalValue(cart);
  }

  cartLogic() {
    cartContent.addEventListener("click", (event) => {
      if (event.target.classList.contains("increase-number-of-product")) {
        const addQuantity = event.target;
        const addedItem = cart.find(
          (cartItem) => cartItem.id == addQuantity.dataset.id
        );

        addedItem.quantity++;
        this.setTotalValue(cart);
        Storeage.saveCart(cart);
        addQuantity.nextElementSibling.innerText = addedItem.quantity;
      } else if (event.target.classList.contains("fa-trash-can")) {
        const removeItem = event.target;
        const _removeItem = cart.find(
          (deleteSelectedItem) => deleteSelectedItem.id == removeItem.dataset.id
        );
        Storeage.saveCart(cart);
        this.removeItem(_removeItem.id);
        cartContent.removeChild(removeItem.parentElement);
      } else if (
        event.target.classList.contains("decraese-number-of-product")
      ) {
        const decraeseQuantity = event.target;
        const decraeseItem = cart.find(
          (cItem) => cItem.id == decraeseQuantity.dataset.id
        );

        if (decraeseItem.quantity === 1) {
          this.removeItem(decraeseItem.id);
          cartContent.removeChild(decraeseQuantity.parentElement.parentElement);
        }

        decraeseItem.quantity--;
        Storeage.saveCart(cart);
        this.setTotalValue(cart);
        decraeseQuantity.previousElementSibling.innerText =
          decraeseItem.quantity;
      }
    });
  }

  removeItem(id) {
    cart = cart.filter((cItem) => cItem.id !== id);
    this.setTotalValue(cart);
    this.getSingleButton(id);
    Storeage.saveCart(cart);
  }

  getSingleButton(id) {
    const button = buttonDOM.find(
      (btn) => parseInt(btn.dataset.id) === parseInt(id)
    );
    button.innerText = "add to cart";
    button.disabled = false;
  }
  searchItem() {
    const searchInput = document.getElementById("search-item");
    searchInput.addEventListener("input", (event) => {
      const searchInputValue = event.target.value;
      Array.from(productsDom.children).forEach((product) => {
        const productName = product.children[1].innerText;

        if (productName.includes(searchInputValue)) {
          product.style.display = "flex";
          console.log("OK");
        } else {
          product.style.display = "none";
          console.log("NO");
        }
      });
    });
  }
  signUpPage() {
    const loginBtn = document.querySelector(".login-btn");
    loginBtn.addEventListener("click", () => {
      signUpPage.style.display = "flex";
      const loginFormPage = document.createElement("div");
      loginFormPage.classList.add("login-container");
      loginFormPage.innerHTML += `
      <form action="#" method="post">
            <h2>Login Form</h2>
            <label for="login-input">Email or Phone</label>
            <input type="text" id="login-input">
            <label for="password-input">Password</label>
            <input type="password" id="password-input">
            <span>Forget password?</span>
            <button type="submit" class="login-botton" id="login-button">Log In</button>
            <h4>not a member? <a href="#" target="_blank" rel="noopener noreferrer">sign up now.</a></h4>
      </form>`;
      signUpPage.appendChild(loginFormPage);
      body.classList.add("menu-open");
    });

    const signupBtn = document.querySelector(".signup-btn");
    signupBtn.addEventListener("click", () => {
      signUpPage.style.display = "flex";
      const singupFormPage = document.createElement("div");
      singupFormPage.classList.add("signup-container");
      singupFormPage.innerHTML += `
      <form action="#">
            <h2>sign up form</h2>
            <label for="signin-input">Username</label>
            <input type="text" id="signin-input">
            <label for="email-address-input">Email</label>
            <input type="email" id="email-address-input">
            <label for="password-input">Password</label>
            <input type="password" id="password-input">
            <button type="submit" class="sign-up-botton" id="signup-button">Sign up</button>
            <h4>Do you have an accunt? <a href="#" target="_blank" rel="noopener noreferrer">Log in.</a></h4>
        </form>`;
        body.classList.add("menu-open");
      signUpPage.appendChild(singupFormPage);
    });
  }
}

class Storeage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    const _products = JSON.parse(localStorage.getItem("products"));
    return _products.find((p) => p.id === parseInt(id));
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCartItem() {
    return JSON.parse(localStorage.getItem("cart"));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const plants = products.getProducts();

  const ui = new UI();
  ui.displayProducts(plants);
  ui.getAddToCart();
  ui.cartLogic();
  ui.setUpApp();
  ui.searchItem();
  ui.signUpPage();

  Storeage.saveProducts(plants);
});

const showmenubtn = document.querySelector(".show-menu-btn");
const menucontent = document.querySelector(".menu-content");
const closemenu = document.querySelector(".remove-menu-btn");
const cartbtn = document.querySelector(".show-cart-shopping-page");
const showcartpage = document.querySelector(".cart-shopping-page");
const closecartbtn = document.querySelector(".close-shopping-page");





// show menu
showmenubtn.addEventListener("click", () => {
  menucontent.classList.add("pett");
  body.classList.add("menu-open");
});

// close menu
closemenu.addEventListener("click", () => {
  menucontent.classList.remove("pett");
  body.classList.remove("menu-open");
});

// show cart shopping page
cartbtn.addEventListener("click", () => {
  showcartpage.classList.add("mess");
  body.classList.add("menu-open");
});
// close cart
closecartbtn.addEventListener("click", () => {
  showcartpage.classList.remove("mess");
  body.classList.remove("menu-open");
});

// a a
