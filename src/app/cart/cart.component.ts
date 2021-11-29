import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { Product } from "../products";
import { CartService, ShippingOption } from "../cart.service";
import { FormBuilder } from "@angular/forms";
import { interval, Observable, of, timer } from "rxjs";
import { catchError, debounce, filter, map, tap } from "rxjs/operators";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.css"],
})
export class CartComponent implements OnInit {
  items: Array<Product> = [];
  shippingOptions: ShippingOption[] = [];
  selectedShippingOption: ShippingOption;
  totalPrice: number = 0;
  checkoutForm = this.formBuilder.group({
    name: "",
    address: "",
  });
  mySub;
  timeLeft: number = 30;

  constructor(
    private cartService: CartService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.addCheckoutTimeLimit();
    this.items = this.cartService.getItems();
    this.searchSometimes();

    const data = this.cartService.getShippingOptions().pipe(
      tap(
        (data) => {
          this.shippingOptions = data;
          this.selectedShippingOption = data[0];
          this.setTotalPrice();
        },
        // log err, return Observable<[]>. why
        catchError((err) => {
          console.log(err);
          return of([]);
        })
      )
    );
    data.subscribe();
  }

  searchSometimes() {
    const nameControl = this.checkoutForm.get("name");
    nameControl?.valueChanges
      .pipe(
        debounce(() => timer(1000)),
        filter((val) => val.length > 3),
        tap((val: string) => {
          console.log(val);
        })
      )
      .subscribe();
  }

  //   addCheckoutTimeLimit() {
  //     interval(1000).subscribe((count) => {
  //       this.timeLeft = Math.abs(count - 120);
  //       if (this.timeLeft <= 0) {
  //         alert("Checkout Expired");
  //         this.router.navigate(["/"]);
  //       }
  //     });
  //   }

  subscribeCObs() {
    let myObs$ = this.cartService.getCustomObservable();
    this.mySub = myObs$.subscribe({
      next: (num) => console.log("number is", num),
      error: (err) => console.log("error is", err),
    });
  }

  unsubscribe() {
    this.mySub.unsubscribe();
  }

  setTotalPrice() {
    let total = this.selectedShippingOption.price;
    this.items.forEach((item) => (total += item.price));
    this.totalPrice = total;
  }

  onShippingOptionSelected(option: ShippingOption) {
    console.log(option);
    this.selectedShippingOption = option;
    this.setTotalPrice();
  }

  onSubmit(): void {
    this.items = this.cartService.clearCart();
    console.log("order submittted", this.checkoutForm.value);
    this.checkoutForm.reset(); // clear input values
  }
}
