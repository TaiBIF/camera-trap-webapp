const clientId = process.env.VUE_APP_AWS_COGNITO_APP_ID;
const appWebDomain = 'camera-trap.auth.ap-northeast-1.amazoncognito.com';
const redirUri = process.env.VUE_APP_BASE_URL;
const loginUri = `${process.env.VUE_APP_BASE_URL}/login.html`;
const userPoolId = 'ap-northeast-1_R2iDn5W3B';
const idpDomain = `cognito-idp.ap-northeast-1.amazonaws.com/${userPoolId}`;
const identityPoolId = 'ap-northeast-1:3d5edbfb-834c-4284-85f5-a4ec29d38ef0';

export {
  clientId,
  appWebDomain,
  redirUri,
  loginUri,
  userPoolId,
  idpDomain,
  identityPoolId,
};
