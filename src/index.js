import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import {createStore, applyMiddleware} from 'redux';
import reducer from './reducers';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import 'bootstrap/dist/css/bootstrap.css';

const logger = store => next => action => { 
            console.group(action.type);
            console.info('despachando', action);
            let resultado = next(action);
            console.log('proximo', store.getState());
            console.groupEnd(action.type);
            return resultado;
        };

const store = createStore(reducer, applyMiddleware(thunk));

ReactDOM.render(
        <Provider store={store}>
                <App />
        </Provider>
        , document.getElementById('root'));

registerServiceWorker();
