import AWS from 'aws-sdk';

import { idpDomain, identityPoolId } from './awsDefine';

function uuid_v4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16),
  );
}

export default file =>
  new Promise((resolve, reject) => {
    let Key = '';

    switch (file.name.split('.').pop()) {
      case 'csv':
        Key = `upload/${uuid_v4()}/csv/${file.name}`;
        break;
      case 'zip':
        Key = `upload/${uuid_v4()}/zip/${file.name}`;
        break;
      case 'jpg':
        Key = `upload/${uuid_v4()}/image/${file.name}`;
        break;
      case 'mp4':
        Key = `upload/${uuid_v4()}/video/${file.name}`;
        break;
    }

    if (Key.length > 0) {
      const upload = new AWS.S3.ManagedUpload({
        params: {
          Bucket: 'camera-trap',
          Key,
          Body: file,
          ACL: 'public-read',
        },
        Tagging: [
          { Key: 'projectTitle', Value: '$project' },
          { Key: 'site', Value: '$site' },
          { Key: 'subSite', Value: '$subSite' },
          { Key: 'cameraLocation', Value: '$cameraLocation' },
          { Key: 'user_id', Value: '$user_id' },
        ],
      });
      upload.on('httpUploadProgress', progressHandle);
      upload.send(errorHandle);

      const progressHandle = progress => {
        console.log(progress);
      };

      const errorHandle = (err, data) => {
        console.log({ err, data });
      };

      console.log(`https://s3-ap-northeast-1.amazonaws.com/camera-trap/${Key}`);
    } else {
      reject('不支援的檔案');
    }
  });

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
