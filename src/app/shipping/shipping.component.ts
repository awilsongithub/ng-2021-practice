import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { CartService, ShippingOption } from "../cart.service";

@Component({
  selector: "app-shipping",
  templateUrl: "./shipping.component.html",
  styleUrls: ["./shipping.component.css"],
})
export class ShippingComponent implements OnInit {
  // activeShippingOption: ShippingOption;
  // @Output() optionSelected: EventEmitter<any> = new EventEmitter();
  @Input() shippingOptions: ShippingOption[] | undefined;
  @Input() selectedShippingOption;
  @Output() shippingOptionSelected = new EventEmitter<ShippingOption>();

  // this.activeShippingOption = shippingOptions ? shippingOptions[0] : null;

  constructor(/* private cartService: CartService */) {}

  ngOnInit(): void {
    // this.cartService.getShippingPrices().subscribe((data: ShippingOption[]) => {
    //   this.shippingOptions = [...data];
    //   this.optionSelected.emit(this.shippingOptions[0]);
    // });
  }

  onOptionClick(option) {
    this.shippingOptionSelected.emit(option);
  }

  /**
   * click option makes it active one
   * initial default option is first one
   * active option is highlighted
   */
}
