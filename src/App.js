import React, { Component } from 'react';
import Signin from './Signin.js';
import EditContact from './EditContact.js';
import ListContacts from './ListContacts.js';
import {
  UserSession,
  AppConfig,
  makeAuthRequest
} from 'blockstack';
import {
  Contact
} from 'blockstack-collection-schemas'
import {
  Switch,
  Route
} from 'react-router-dom'

const appConfig = new AppConfig()
const userSession = new UserSession({ appConfig: appConfig })

export default class App extends Component {


  handleSignIn(e) {
    e.preventDefault();
    // userSession.redirectToSignIn();

    const scopes = ['store_write', 'email', 'publish_data', Contact.scope]
    const appConfig = new AppConfig(scopes)

    // Solicit gaia sign in redirect
    const userSession = new UserSession({appConfig: appConfig})
    const authRequest = makeAuthRequest(undefined, undefined, undefined, scopes, undefined, undefined, {
      solicitGaiaHubUrl: true,
      recommendedGaiaHubUrl: 'https://develop-hub.blockstack.org'
    })

    userSession.redirectToSignInWithAuthRequest(authRequest)
  }

  handleSignOut(e) {
    e.preventDefault();
    userSession.signUserOut(window.location.origin);
  }

  render() {
    return (
      <div className="site-wrapper">
        <div className="site-wrapper-inner">
          { !userSession.isUserSignedIn() ?
            <Signin userSession={userSession} handleSignIn={ this.handleSignIn } />
            : <Switch>
                <Route exact path='/' render={() => <ListContacts handleSignOut={this.handleSignOut} />} />
                <Route path='/edit' component={EditContact} />
                <Route path='/new' render={() => <EditContact new />} />
              </Switch>
          }
        </div>
      </div>
    );
  }

  componentDidMount() {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        window.history.replaceState({}, document.title, "/")
        this.setState({ userData: userData})
      });
    }
  }
}
