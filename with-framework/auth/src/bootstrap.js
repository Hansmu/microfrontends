import {mount} from "./app";
import { createBrowserHistory } from 'history';

if (process.env.NODE_ENV === 'development') {
    const history = createBrowserHistory();
    mount(document.querySelector('#root'), {onNavigate: () => {}, defaultHistory: history});
}