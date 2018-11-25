import AWS from 'aws-sdk';

import { idpDomain, identityPoolId } from './awsDefine';

export default file => {
  const upload = new AWS.S3.ManagedUpload(
    {
      params: {
        Bucket: 'camera-trap',
        Key: 'upload/sessid/text/a.txt',
        Body: file,
      },
      Tagging: [
        { Key: 'projectTitle', Value: '$project' },
        { Key: 'site', Value: '$site' },
        { Key: 'subSite', Value: '$subSite' },
        { Key: 'cameraLocation', Value: '$cameraLocation' },
        { Key: 'user_id', Value: '$user_id' },
      ],
    },
    (err, data) => {
      console.log({ err, data });
    },
  );
  upload.send();
};

const init = () => {
  AWS.config.update({ region: 'ap-northeast-1' });

  const logins = {};
  logins[idpDomain] = localStorage.getItem('awsIdToken');

  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: identityPoolId,
    Logins: logins,
  });

  AWS.config.credentials.get(err => {
    if (err) return console.log('Error', err);
    // 成功透過 OrcID 登入 AWS Cognito，取得 credentials
    // e.g.
    // var identity_id = AWS.config.credentials.identityId;
    // localStorage.setItem(
    //   'credentials_id',
    //   AWS.config.credentials.identityId,
    // );
    console.log('init');
  });
};

init();
