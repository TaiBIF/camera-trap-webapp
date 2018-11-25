import Cookies from 'js-cookie';

import { CognitoAuth } from 'amazon-cognito-auth-js';
import 'amazon-cognito-auth-js/dist/aws-cognito-sdk';
import AWS from 'aws-sdk';

const { localStorage } = window;

const clientId = '1icuqes99so6oi86l3u8506pqd';
const appWebDomain = 'camera-trap.auth.ap-northeast-1.amazoncognito.com';
const redirUri = process.env.VUE_APP_BASE_URL;
const loginUri = `${process.env.VUE_APP_BASE_URL}/login.html`;
const userPoolId = 'ap-northeast-1_R2iDn5W3B';
const idpDomain = `cognito-idp.ap-northeast-1.amazonaws.com/${userPoolId}`;
const identityPoolId = 'ap-northeast-1:3d5edbfb-834c-4284-85f5-a4ec29d38ef0';

function initCognitoSDK() {
  const authData = {
    ClientId: clientId, // Your client id here
    AppWebDomain: appWebDomain, // Exclude the "https://" part.
    TokenScopesArray: [
      'openid',
      'email',
      'profile',
      'aws.cognito.signin.user.admin',
    ], // like ['openid','email','phone']...
    RedirectUriSignIn: redirUri,
    RedirectUriSignOut: loginUri,
    IdentityProvider: 'OrcID',
    UserPoolId: userPoolId,
    AdvancedSecurityDataCollectionFlag: 0,
  };
  const auth = new CognitoAuth(authData);
  // You can also set state parameter
  // 後端隨機產生 state
  auth.setState(Cookies.get('AWSELB'));
  auth.userhandler = {
    onSuccess(awsCognitoSession) {
      fetch(`${process.env.VUE_APP_API_URL}/ctp-user/sign-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          idToken: awsCognitoSession.getIdToken().getJwtToken(),
        }),
      })
        .then(res => res.json())
        .then(response => {
          console.log(`sign-in: ${JSON.stringify(response)}`);

          localStorage.setItem('user_id', response.ret);
          localStorage.setItem(
            'awsIdToken',
            awsCognitoSession.getIdToken().getJwtToken(),
          );
          window.location.replace('/');
        });

      AWS.config.update({ region: 'ap-northeast-1' });

      // 前端取得登入使用者的 credentials 法
      const logins = {};
      logins[idpDomain] = awsCognitoSession.getIdToken().getJwtToken();

      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: identityPoolId,
        Logins: logins,
      });

      AWS.config.credentials.get(err => {
        if (err) return console.log('Error', err);
        // 成功透過 OrcID 登入 AWS Cognito，取得 credentials
        // e.g.
        // var identity_id = AWS.config.credentials.identityId;
        // console.log("Cognito Identity Id", AWS.config.credentials.identityId);
      });

      console.log('Sign in success');
    },
    onFailure(err) {
      // put some error message test here
      console.log(`Error!${err}`);
    },
  };
  // The default response_type is "token", uncomment the next line will make it be "code".
  auth.useCodeGrantFlow();
  return auth;
}

// ---------------------------

// onload
const auth = initCognitoSDK();

const checkIsLogin = () => {
  const session = auth.signInUserSession;
  const dateNow = Date.now() / 1000;
  if (!!session.idToken.jwtToken && session.idToken.payload.exp > dateNow) {
    // signed-in
    console.log('signed-in');
    return true;
  }
  if (!!session.idToken.jwtToken && session.idToken.payload.exp <= dateNow) {
    console.log('to sign in or refresh id token');
    auth.getSession();
  } else {
    console.log('解讀 oauth returned error status');
    const curUrl = window.location.href;
    // special case
    const xcurUrl = curUrl.replace('#', '');
    console.log(curUrl);

    const queryString = xcurUrl
      .split('?')
      .slice(1)
      .join('?');

    let urlParams;
    (window.onpopstate = function() {
      let match;
      const pl = /\+/g;
      // Regex for replacing addition symbol with a space

      const search = /([^&=]+)=?([^&]*)/g;
      const decode = function(s) {
        return decodeURIComponent(s.replace(pl, ' '));
      };
      const query = queryString;

      urlParams = {};
      while ((match = search.exec(query)))
        urlParams[decode(match[1])] = decode(match[2]);
    })();

    if (urlParams.code) {
      auth.parseCognitoWebResponse(curUrl);
      // window.location.replace('/');
    } else if (!window.location.pathname.match(/^\/login.html/)) {
      window.location.replace('/login.html');
    }
  }
};

// checkIsLogin()

// beforeEach
const RouteGuards = (to, from, next) => {
  // checkIsLogin()
  if (checkIsLogin()) {
    next();
  }
};

export { auth, RouteGuards };
