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
  return new Promise((resolve, reject) => {
    if (auth.isUserSignedIn()) {
      const logins = {};
      logins[idpDomain] = auth.signInUserSession.idToken.jwtToken;
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: identityPoolId,
        Logins: logins,
      });
      store
        .dispatch('auth/loadProfile')
        .then(() => {
          const loginUser = store.getters['auth/loginUser'];
          if (!loginUser || !Object.keys(loginUser).length) {
            return resolve(null);
          }
          resolve(loginUser);
        })
        .catch(error => {
          reject(error);
        });
    } else {
      resolve(null);
    }
  }).then(user => {
    if (user) {
      // the user is login
      window.currentUser = user;
      return user;
    }
    if (location.pathname === '/' && location.search.indexOf('code=') >= 0) {
      // oauth continue
      auth.parseCognitoWebResponse(location.href);
      return new Promise();
    }
    if (!location.pathname.match(/^\/intro.html/)) {
      // redirect to login.html
      window.location.replace('/intro.html');
      return new Promise();
    }
  });
};

export { auth, authentication };
