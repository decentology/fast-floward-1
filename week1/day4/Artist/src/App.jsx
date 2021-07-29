import {useContext} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';

import FlowContext, {Provider as FlowContextProvider} from './context/Flow.jsx';

import Authenticate from './pages/Authenticate';
import Home from './pages/Home';
import Draw from './pages/Draw';
import Trade from './pages/Trade';
import Account from './pages/Account';

import Header from './components/Header';
import Body from './components/Body';
import Footer from './components/Footer';
import Navigation from './components/Navigation.jsx';

import './App.css';

function PrivateRoute(props) {
  const flow = useContext(FlowContext);
  
  if (!flow.isReady) {
    if (flow.state.user && !flow.state.user.loggedIn) {
      return (
        <Redirect to="/authenticate" />
      );
    } else {
      return (
        <div className="notification">
          Loading...
        </div>
      );
    }
  } else if (flow.state.user.loggedIn) {
    return (
      <Route {...props} />
    );
  } else {
    return (
      <Redirect to="/authenticate" />
    );
  }
};

function App() {
  return (
    <div id="App">
      <Header />
      <Switch>
        <Route path="/public">
          <Redirect to="/" />
        </Route>
        <Route path="/account/:address">
          <Body>
            <Account />
          </Body>
        </Route>
        <Route path="/*">
          <Navigation />
          <Body>
            <Switch>
              <PrivateRoute path="/" exact>
                <Home />
              </PrivateRoute>
              <PrivateRoute path="/draw">
                <Draw />
              </PrivateRoute>
              <PrivateRoute path="/trade">
                <Trade />
              </PrivateRoute>
              <Route path="/authenticate">
                <Authenticate />
              </Route>
            </Switch>
          </Body>
        </Route>
      </Switch>
      <Footer />
    </div>
  );
}

function WrappedApp() {
  return (
    <FlowContextProvider>
      <Router>
        <App />
      </Router>
    </FlowContextProvider>
  );
}

export default WrappedApp;