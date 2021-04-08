import React, { Component } from 'react';
import { render }           from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk        from 'redux-thunk';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { syncHistory, routeReducer }     from 'react-router-redux';
import { createHistory } from 'history';
import reducer from './reducers';
import App     from './components/App';
import Login   from './components/Login';
import Session from './components/Session';
import Waiting from './components/Waiting';
import ConfigSetlist from './components/ConfigSetlist';
import PlaySetlist from './components/PlaySetlist';
import Error   from './components/Error';
import LoadingScreen from './components/LoadingScreen';
import QRScanner from './components/QRScanner';
import Settings from './components/Settings';


// load our css. there probably is a better way to do this
// but for now this is our move
require('./style.less');


// Sync dispatched route actions to the history
const reduxRouterMiddleware = syncHistory(hashHistory)
const createStoreWithMiddleware = applyMiddleware(
  thunk,
  reduxRouterMiddleware
)(createStore)
const store = createStoreWithMiddleware(reducer)

class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={hashHistory}>
          <Route path="/" component={App}>
            <IndexRoute component={Login} />
            <Route path="/:hostInfo/:sessionIdInfo" component={App} />
            <Route path="/session" component={Session} />
            <Route path="/waiting" component={Waiting} />
            <Route path="/config-setlist/:host/:sessionId/:uid" component={ConfigSetlist} />
            <Route path="/play-setlist/:userInfo_Id/:playlistId/:uid" component={PlaySetlist} />
            <Route path="/loading" component={LoadingScreen} />
            <Route path="/qr-scanner" component={QRScanner} />
            <Route path="/settings" component={Settings} />
            <Route path="/error/:errorMsg" component={Error} />
          </Route>
        </Router>
      </Provider>
    );
  }
}

// render route
const rootElement = document.getElementById('root');
render(<Root />, rootElement);
