import {mountContent} from "./fileNameToExposeInProducts";

if (process.env.NODE_ENV === 'development') {
    mountContent(document.querySelector('#dev-products'));
}
