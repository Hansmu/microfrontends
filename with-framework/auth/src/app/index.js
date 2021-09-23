import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {createMemoryHistory} from 'history';

const mount = (el, {onNavigate, defaultHistory, initialPath, onSignIn}) => {
    const history = defaultHistory || createMemoryHistory({
        initialEntries: [initialPath]
    });

    history.listen(onNavigate);

    ReactDOM.render(
        <App history={history} onSignIn={onSignIn}/>,
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