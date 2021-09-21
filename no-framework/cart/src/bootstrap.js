import {mountContent} from "./content/cartMessage";

if (process.env.NODE_ENV === 'development') {
    mountContent(document.querySelector('#dev-cart'));
}