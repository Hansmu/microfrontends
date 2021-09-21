import {mountContent as mountProducts} from 'products/AliasForExposedIndexFileFromProducts';
import {mountContent as mountCart} from 'cart/CartShow';

mountProducts(document.querySelector('#products-container'));
mountCart(document.querySelector('#cart-container'));

console.log('container');