import { Food } from "./Food";

export class CartItem{
  //making Food public
  constructor(public food:Food){ }
  quantity:number = 1 ;
  price: number = this.food.price;
}