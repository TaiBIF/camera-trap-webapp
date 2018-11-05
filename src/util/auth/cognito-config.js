import axios from 'axios'
import Cookies from 'js-cookie'

import { CognitoAuth } from 'amazon-cognito-auth-js'
import 'amazon-cognito-auth-js/dist/aws-cognito-sdk'

const { AWSCognito, localStorage } = window

const clientId = '1icuqes99so6oi86l3u8506pqd'
const appWebDomain = 'camera-trap.auth.ap-northeast-1.amazoncognito.com'
const redirUri = 'http://localhost:8888'
const loginUri = 'http://localhost:8888/login.html'
const userPoolId = 'ap-northeast-1_R2iDn5W3B'
const idpDomain = 'cognito-idp.ap-northeast-1.amazonaws.com/' + userPoolId
const identityPoolId = 'ap-northeast-1:3d5edbfb-834c-4284-85f5-a4ec29d38ef0'

function initCognitoSDK () {
  var authData = {
    ClientId: clientId, // Your client id here
    AppWebDomain: appWebDomain, // Exclude the "https://" part.
    TokenScopesArray: [
      'openid',
      'email',
      'profile',
      'aws.cognito.signin.user.admin'
    ], // like ['openid','email','phone']...
    RedirectUriSignIn: redirUri,
    RedirectUriSignOut: loginUri,
    IdentityProvider: 'OrcID',
    UserPoolId: userPoolId,
    AdvancedSecurityDataCollectionFlag: 0
  }
  var auth = new CognitoAuth(authData)
  // You can also set state parameter
  // 後端隨機產生 state
  auth.setState(Cookies.get('AWSELB'))
  auth.userhandler = {
    onSuccess: function (awsCognitoSession) {
      AWSCognito.config.update({ region: 'ap-northeast-1' })

      localStorage.setItem(
        'awsIdToken',
        awsCognitoSession.getIdToken().getJwtToken()
      )

      // 前端取得登入使用者的 credentials 法
      var logins = {}
      logins[idpDomain] = awsCognitoSession.getIdToken().getJwtToken()

      AWSCognito.config.credentials = new AWSCognito.CognitoIdentityCredentials(
        {
          IdentityPoolId: identityPoolId,
          Logins: logins
        }
      )

      // AWSCognito.config.credentials.get(function (err) {
      //   if (err) return console.log('Error', err)
      //   // 成功透過 OrcID 登入 AWS Cognito，取得 credentials
      //   // e.g.
      //   // var identity_id = AWSCognito.config.credentials.identityId;
      //   // console.log("Cognito Identity Id", AWSCognito.config.credentials.identityId);
      // })

      console.log('Sign in success')

      fetch(`https://camera-trap.tw/api/ctp-user/sign-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
          idToken: awsCognitoSession.getIdToken().getJwtToken()
        })
      })
        .then(res => res.json())
        .then(response => {
          console.log(`sign-in: ${JSON.stringify(response)}`)
          window.location.replace('/')
        })
    },
    onFailure: function (err) {
      // put some error message test here
      console.log('Error!' + err)
    }
  }
  // The default response_type is "token", uncomment the next line will make it be "code".
  auth.useCodeGrantFlow()
  return auth
}

// ---------------------------

const checkIsLogin = () => {
  const session = auth.signInUserSession
  const dateNow = Date.now() / 1000
  if (!!session.idToken.jwtToken && session.idToken.payload.exp > dateNow) {
    // signed-in
    console.log('signed-in')
    return true
  } else if (
    !!session.idToken.jwtToken &&
    session.idToken.payload.exp <= dateNow
  ) {
    console.log('to sign in or refresh id token')
    auth.getSession()
    return true
  } else {
    console.log('解讀 oauth returned error status')
    let curUrl = window.location.href
    // special case
    curUrl = curUrl.replace('#', '')
    auth.parseCognitoWebResponse(curUrl)
    return false
  }
}

// onload
const auth = initCognitoSDK()
checkIsLogin()

// beforeEach
const RouteGuards = (to, from, next) => {
  checkIsLogin()
  if (checkIsLogin()) {
    next()
  } else {
    window.location.replace('/login.html')
  }
}

export { auth, RouteGuards }
