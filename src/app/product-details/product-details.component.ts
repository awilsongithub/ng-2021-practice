import { Component, OnInit } from '@angular/core';
import { Product, products } from '../products';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  product!: Product | undefined;

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const id = Number(routeParams.get('productId'));
    console.log('products in init in details component', products);
    this.product = products.find((p) => p.id === id);
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    window.alert('Item added to Cart');
  }
}
