import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart } from '../shared/models/Cart';
import { CartItem } from '../shared/models/CartItem';
import { Food } from '../shared/models/Food';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  //create new cart
  private cart: Cart = this.getCartFromLocalStorage();
  //behaviour subject - need to look this up
  private cartSubject: BehaviorSubject<Cart> = new BehaviorSubject(this.cart);
  constructor() {}

  //this adds food to the cart
  addToCart(food: Food): void {
    //find the cart time,
    let cartItem = this.cart.items
      //find the food where the food is equal to the fooditem
      .find((item) => item.food.id === food.id);
    //check of the cartitem is within the cart
    if (cartItem)
      //return this
      return;

    //if the cart item isn't present add this item to the cart
    this.cart.items.push(new CartItem(food));
    this.setCartToLocalStorage();
  }

  //remove item from cart
  removeFromCart(foodId: string): void {
    //you want to check the cart for items which are not equal to the food id being checked
    this.cart.items = this.cart.items.filter((item) => item.food.id != foodId);
    this.setCartToLocalStorage();
  }

  //change the food id. fill in with food id and num params.
  changeQuantity(foodId: string, quantity: number) {
    //assign cart item to the food id, where the foodId selected is equal to the FoodID
    let cartItem = this.cart.items.find((item) => item.food.id === foodId);
    // if the cart item is not available then return (shouldn't need this but to pass JS checks)
    if (!cartItem) return;

    // if teur update the quantity and price
    cartItem.quantity = quantity;
    cartItem.price = quantity * cartItem.food.price;
    this.setCartToLocalStorage();
  }

  // clear the cart setting the car to the value of a new cart
  clearCart() {
    this.cart = new Cart();
    this.setCartToLocalStorage(); // need this to ensure data is persistant when refreshed
  }

  // to make the cart observable
  getCartObservable(): Observable<Cart> {
    return this.cartSubject.asObservable();
  }

  //setting cart to the local storage
  private setCartToLocalStorage(): void {
    // reduce function will start to call this function (prevSum, currentItem) => prevSum + currentItem.price, 0 depending on the number of items you have in the cart
    this.cart.totalPrice = this.cart.items.reduce(
      (prevSum, currentItem) => prevSum + currentItem.price,
      0
    );
    //need to do the same for the total count
    this.cart.totalCount = this.cart.items.reduce(
      (prevSum, currentItem) => prevSum + currentItem.quantity,
      0
    );

    //now we have a string respresentation of the cart
    const cartJson = JSON.stringify(this.cart);
    // set the key of the local storage of cart
    localStorage.setItem('Cart', cartJson);
    this.cartSubject.next(this.cart); 
  }

  // returns the Cart
  private getCartFromLocalStorage(): Cart {
    //get the cart JSOn from local storage using Cart Key
    const cartJson = localStorage.getItem('Cart');
    //return and check if the cartJSON is availabel and return a new Cart if not avaialbel 
    return cartJson ? JSON.parse(cartJson) : new Cart();
  }
}
