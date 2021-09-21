import {mount} from "./app";

if (process.env.NODE_ENV === 'development') {
    mount(document.querySelector('#root'));
}