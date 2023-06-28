import { CartItem } from "./CartItem";

export class Cart{
  //empty array 
  items:CartItem[] = [];
  totalPrice:number = 0;
  totalCount:number = 0;
}