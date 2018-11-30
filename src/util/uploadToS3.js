import AWS from 'aws-sdk';

import { idpDomain, identityPoolId } from './awsDefine';
import { updateUploadStatus } from '../service/modules/uploadSession';

function uuid_v4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16),
  );
}

export default ({
  file,
  projectId,
  projectTitle,
  site,
  subSite,
  cameraLocation,
  fullCameraLocationMd5,
  userId,
  onProgress,
}) =>
  new Promise((resolve, reject) => {
    let Key = '';
    const sessid = uuid_v4();

    const genStatusBody = status => [
      {
        _id: sessid,
        projectId: projectId,
        $set: {
          status: status,
        },
        $setOnInsert: {
          upload_session_id: sessid,
          fullCameraLocationMd5: fullCameraLocationMd5,
          projectId: projectId,
          projectTitle: projectTitle,
          site: site,
          subSite: subSite,
          cameraLocation: cameraLocation,
          by: userId,
          file: Key,
        },
        $upsert: true,
      },
    ];

    switch (file.type) {
      case 'text/csv':
        Key = `upload/${sessid}/csv/${file.name}`;
        break;
      case 'application/zip':
        Key = `upload/${sessid}/zip/${file.name}`;
        break;
      case 'image/jpeg':
        Key = `upload/${sessid}/image/${file.name}`;
        break;
      case 'video/mp4':
        Key = `upload/${sessid}/video/${file.name}`;
        break;
    }

    if (Key.length > 0) {
      new AWS.S3({
        params: {
          Bucket: 'camera-trap',
          Key,
          Body: file,
          ACL: 'public-read',
        },
        Tagging: [
          { Key: 'projectId', Value: projectId },
          { Key: 'projectTitle', Value: projectTitle },
          { Key: 'site', Value: site },
          { Key: 'subSite', Value: subSite },
          { Key: 'cameraLocation', Value: cameraLocation },
          { Key: 'userId', Value: userId },
        ],
      })
        .upload()
        .on('httpUploadProgress', function(evt) {
          console.log(evt);
          console.log(
            'Uploaded :: ' + parseInt((evt.loaded * 100) / evt.total) + '%',
          );
          onProgress(evt);
        })
        .send(function(err, data) {
          if (!err) {
            updateUploadStatus(genStatusBody('SUCCESS'));
            resolve(data);
          } else {
            updateUploadStatus(genStatusBody('FAILED'));
            reject(err);
          }
        });
      updateUploadStatus(genStatusBody('WAITING'));
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
