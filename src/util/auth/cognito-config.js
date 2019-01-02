import { CognitoAuth } from 'amazon-cognito-auth-js';
import 'amazon-cognito-auth-js/dist/aws-cognito-sdk';
import AWS from 'aws-sdk';
import store from '../../stores';

import {
  clientId,
  appWebDomain,
  redirUri,
  userPoolId,
  idpDomain,
  identityPoolId,
} from '../awsDefine';

AWS.config.update({ region: 'ap-northeast-1' });

// onload
const auth = initCognitoSDK();
let refreshIntervalId;

function initCognitoSDK() {
  const result = new CognitoAuth({
    ClientId: clientId, // Your client id here
    AppWebDomain: appWebDomain, // Exclude the "https://" part.
    TokenScopesArray: [
      'openid',
      'email',
      'profile',
      'aws.cognito.signin.user.admin',
    ], // like ['openid','email','phone']...
    RedirectUriSignIn: redirUri,
    RedirectUriSignOut: redirUri,
    IdentityProvider: 'OrcID',
    UserPoolId: userPoolId,
    AdvancedSecurityDataCollectionFlag: 0,
  });
  result.setState('taibif');
  result.userhandler = {
    onSuccess(awsCognitoSession) {
      const logins = {};
      logins[idpDomain] = awsCognitoSession.getIdToken().getJwtToken();
      result.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: identityPoolId,
        Logins: logins,
      });
      if (!window.currentUser) {
        // We need bypass the call back of the success of refresh token.
        const form = document.createElement('form');
        const inputIdToken = document.createElement('input');
        const inputRedirect = document.createElement('input');
        form.method = 'POST';
        form.action = `${process.env.VUE_APP_API_URL}/ctp-user/sign-in`;
        inputIdToken.name = 'idToken';
        inputIdToken.type = 'hidden';
        inputIdToken.value = awsCognitoSession.getIdToken().getJwtToken();
        form.appendChild(inputIdToken);
        inputRedirect.name = 'redirect';
        inputRedirect.type = 'hidden';
        inputRedirect.value = location.origin;
        form.appendChild(inputRedirect);
        document.body.appendChild(form);
        form.submit();
      }
    },
    onFailure(error) {
      console.error(error);
    },
  };
  // The default response_type is "token", uncomment the next line will make it be "code".
  result.useCodeGrantFlow();
  return result;
}

const authentication = () => {
  /*
  Authentication.
  @returns {Promise<CtpUser|null>}
   */
  if (location.pathname === '/' && location.search.indexOf('code=') >= 0) {
    // oauth continue
    auth.parseCognitoWebResponse(location.href);
    return new Promise(() => {});
  }

  return store
    .dispatch('auth/loadProfile')
    .then(() => {
      const loginUser = store.getters['auth/loginUser'];
      if (!loginUser || !Object.keys(loginUser).length) {
        return null;
      }
      return loginUser;
    })
    .then(user => {
      if (auth.isUserSignedIn()) {
        // The user is login.
        window.currentUser = user;
        auth.refreshSession(auth.signInUserSession.refreshToken.refreshToken);
        if (refreshIntervalId) {
          clearInterval(refreshIntervalId);
        }
        refreshIntervalId = setInterval(() => {
          auth.refreshSession(auth.signInUserSession.refreshToken.refreshToken);
        }, 1200 * 1000);
        return user;
      }

      // The user didn't login.
      if (!location.pathname.match(/^\/intro.html|^\/article.html/)) {
        // redirect to login.html
        window.location.replace('/intro.html');
        return new Promise(() => {});
      }
      return null;
    });
};

export { auth, authentication };
