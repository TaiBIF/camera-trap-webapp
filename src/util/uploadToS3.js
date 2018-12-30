import AWS from 'aws-sdk';

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
  credentials,
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
          messages: [],
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
      AWS.config.credentials = credentials;
      new AWS.S3.ManagedUpload({
        params: {
          Bucket: 'camera-trap',
          Key,
          Body: file,
          ACL: 'public-read',
        },
        tags: [
          { Key: 'projectId', Value: projectId },
          { Key: 'projectTitle', Value: projectTitle },
          { Key: 'site', Value: site },
          { Key: 'subSite', Value: subSite },
          { Key: 'cameraLocation', Value: cameraLocation },
          { Key: 'userId', Value: userId },
        ],
      })
        .on('httpUploadProgress', function(evt) {
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

// https://github.com/TaiBIF/camera-trap-api/wiki/aws-folder-structure
export const uploadCoverImage = ({ file, projectId, credentials }) => {
  return new Promise((resolve, reject) => {
    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
      reject('不支援的檔案');
    } else {
      const ext = file.type.replace(/.*\//, '');
      const params = {
        Bucket: 'camera-trap',
        Key: `cover_images/${projectId}.${ext}`,
        Body: file,
        ACL: 'public-read',
      };
      AWS.config.credentials = credentials;
      new AWS.S3.ManagedUpload({
        params,
      })
        .on('httpUploadProgress', function(evt) {
          console.log(
            'Uploaded :: ' + parseInt((evt.loaded * 100) / evt.total) + '%',
          );
          // onProgress(evt);
        })
        .send(function(err, data) {
          if (!err) {
            resolve(data);
          } else {
            reject(err);
          }
        });
    }
  });
};

export const uploadContactUsAttach = ({ file, fileName, credentials }) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: 'camera-trap',
      Key: `user_report_images/${fileName}`,
      Body: file,
      ACL: 'public-read',
    };
    AWS.config.credentials = credentials;
    new AWS.S3.ManagedUpload({
      params,
    })
      .on('httpUploadProgress', function(evt) {
        console.log(
          'Uploaded :: ' + parseInt((evt.loaded * 100) / evt.total) + '%',
        );
      })
      .send(function(err, data) {
        if (!err) {
          resolve(data);
        } else {
          reject(err);
        }
      });
  });
};
