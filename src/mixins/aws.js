const loginUri = 'http://localhost:8888/dummy.html';

function initCognitoSDK() {
  var authData = {
    ClientId: '2a630eoreacbi4c3tqbjjdtjkk', // Your client id here
    AppWebDomain: 'tagphoto.auth.ap-northeast-1.amazoncognito.com', // Exclude the "https://" part.
    TokenScopesArray: [
      'openid',
      'email',
      'profile',
      'aws.cognito.signin.user.admin',
    ], // like ['openid','email','phone']...
    RedirectUriSignIn: loginUri,
    RedirectUriSignOut: loginUri,
    IdentityProvider: 'OrcID',
    UserPoolId: 'ap-northeast-1_JACElFd4C',
    AdvancedSecurityDataCollectionFlag: 0,
  };

  var auth = new window.AmazonCognitoIdentity.CognitoAuth(authData);

  auth.setState('someRandomState');
  auth.userhandler = {
    onSuccess: function(result) {
      window.AWSCognito.config.update({ region: 'ap-northeast-1' });

      window.AWSCognito.config.credentials = new window.AWSCognito.CognitoIdentityCredentials(
        {
          IdentityPoolId: 'ap-northeast-1:83570204-11bb-4601-8094-2dc2ccfbc88a',
          Logins: {
            'cognito-idp.ap-northeast-1.amazonaws.com/ap-northeast-1_JACElFd4C': result
              .getIdToken()
              .getJwtToken(),
          },
        },
      );

      window.AWSCognito.config.credentials.get(function(err) {
        if (err) return console.log('Error', err);

        localStorage.setItem('awsIdToken', result.getIdToken().getJwtToken());

        var identityId = window.AWSCognito.config.credentials.identityId;
        console.log('Cognito Identity Id', identityId);
      });

      console.log('Sign in success');
      // showSignedIn(result)
      window.open(
        'http://localhost:8888/upload.html#/',
        'camera_trap_photo_upload',
      );
    },
    onFailure: function(err) {
      const allowedProviders = ['Facebook', 'Google', 'OrcID'];
      console.log('Error!' + err);

      const err_ = decodeURIComponent(err).replace(/\+/g, ' ');
      const providerRegexp = new RegExp(
        ' ((' + allowedProviders.join('|') + ')_\\d+) ',
      );

      const providerUserId = providerRegexp.exec(err_);
      if (!providerUserId === false) {
        const provider = providerRegexp.exec(err_)[2];
        authData.IdentityProvider = provider;
        // let reAuth = new window.AmazonCognitoIdentity.CognitoAuth(authData)
      } else {
        console.log('Signin failed due to Unknown reason.');
      }
    },
  };

  return auth;
}

export const awsMixins = {
  data() {
    return {
      files: [
        '/vendor/aws/amazon-cognito-auth.min.js',
        '/vendor/aws/aws-cognito-sdk.min.js',
      ],
      authData: {
        ClientId: '2a630eoreacbi4c3tqbjjdtjkk', // Your client id here
        AppWebDomain: 'tagphoto.auth.ap-northeast-1.amazoncognito.com', // Exclude the "https://" part.
        TokenScopesArray: [
          'openid',
          'email',
          'profile',
          'aws.cognito.signin.user.admin',
        ], // like ['openid','email','phone']...
        RedirectUriSignIn: loginUri,
        RedirectUriSignOut: loginUri,
        IdentityProvider: 'OrcID',
        UserPoolId: 'ap-northeast-1_JACElFd4C',
        AdvancedSecurityDataCollectionFlag: 0,
      },
      curUrl: window.location.href,
      auth: null,
    };
  },
  methods: {
    loadFile(idx) {
      this.$loadScript(this.files[idx])
        .then(() => {
          if (!this.files[idx + 1]) {
            this.setFileReady(true);
            this.auth = initCognitoSDK();
            this.auth.getSession();
            this.auth.parseCognitoWebResponse(this.curUrl);
          } else {
            this.loadFile(idx + 1);
          }
        })
        .catch(() => {});
    },
  },
  mounted() {
    // this.loadFile(0)
  },
};
