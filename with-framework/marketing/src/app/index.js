import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {createMemoryHistory} from 'history';

const mount = (el, {onNavigate, defaultHistory, initialPath}) => {
    const history = defaultHistory || createMemoryHistory({
        initialEntries: [initialPath]
    });

    history.listen(onNavigate);

    ReactDOM.render(
        <App history={history}/>,
        el
    );

    return {
        onParentNavigate({ pathname: nextPathName }) {
            if (history.location.pathname !== nextPathName) {
                history.push(nextPathName);
            }
        }
    }
};

export {mount};