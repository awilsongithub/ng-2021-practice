import { Injectable } from "@angular/core";
import { Product, products } from "./products";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CartService {
  itemsInCart: Array<Product>;

  constructor(private http: HttpClient) {
    this.itemsInCart = [];
  }

  addToCart(product: Product) {
    // const item = products.find((product) => product.id === productId) as any;
    this.itemsInCart.push(product);
  }

  clearCart() {
    this.itemsInCart = [];
    return this.itemsInCart;
  }

  getItems(): Product[] {
    return this.itemsInCart;
  }

  getShippingOptions() {
    return this.http.get<ShippingOption[]>("/assets/shipping.json");
  }
  /** MY CUSTOM OBSERVABLE ============================= */
  getCustomObservable(): Observable<any> {
    // SUBSCRIBER FN TAKES OBSERVER WITH CALLBACKS
    // subscriber fn parameters may be either:
    // {next, error?, complete?}  or fn,fn?,fn?
    let onSubscribe = (observer) => {
      setInterval(function () {
        let num = Math.random();
        if (num > 0.2) {
          observer.next(num);
        } else {
          observer.error("error");
        }
      }, 2000);
      // AND RETURNS UNSUBSCRIBE MECHANISM
      // this was invoked right away before I had an interval
      // and upon invocation of observer.error callback
      return {
        unsubscribe() {
          console.log("stop all events");
        },
      };
    };

    return new Observable(onSubscribe);
  }

  /** =======================
   * JSON SERVER METHODS
   ========================== */
} // END OF SERVICE ========================================= //

export interface ShippingOption {
  type: string;
  price: number;
}
