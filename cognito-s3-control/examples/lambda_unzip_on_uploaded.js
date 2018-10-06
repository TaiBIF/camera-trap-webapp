'use strict';

let AWS = require('aws-sdk');
let s3 = new AWS.S3();
// let PassThrough = require('stream').PassThrough;
// let Writable = require('stream').Writable;
let unzip = require('unzip-stream');
let md5 = require('md5');
let streamBuffers = require('stream-buffers');
let ExifImage = require('exif').ExifImage;
let iconvLite = require('iconv-lite');
const sharp = require('sharp');

exports.handler = (event, context, callback) => {
  
  console.log(event.Records[0].s3.object);
  console.log(event.Records[0].s3);

  let bucket = event.Records[0].s3.bucket.name;

  let file_key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
  let params = { Bucket: bucket, Key: file_key };

  s3.getObjectTagging(params, function(err, tags) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(tags);

    let data = {};
    tags.TagSet.forEach(function(d){
      data[d.Key] = d.Value;
    });

    let parser = unzip.Parse({ decodeString: (buffer) => { return iconvLite.decode(buffer, 'utf8'); } });

    s3.getObject(params).createReadStream()
      .pipe(parser)
      .on('entry', function (entry) {
        let fileName = entry.path;
        // let type = entry.type; // 'Directory' or 'File'
        // let size = entry.size;
        
        if (!fileName.match(/\.jpg$|\.jpeg$/i)) {
          entry.autodrain();
        }
        else {
          // console.log(entry);
          // console.log("File: " + fileName + ", Type: " + type + ", Size: " + size);
          let fileWritableStreamBuffer = new streamBuffers.WritableStreamBuffer({
              initialSize: (100 * 1024),   // start at 100 kilobytes.
              incrementAmount: (100 * 1024) // grow by 10 kilobytes each time buffer overflows.
          });
    
          entry.pipe(fileWritableStreamBuffer).on('finish', function() {

            console.log("get head of " + fileName + ":");
            let file_size = fileWritableStreamBuffer.size();
            console.log(file_size / 1024 + "kb");

            // 理想狀況這時應該拿得到 EXIF
            //*
            let file_buf = fileWritableStreamBuffer.getContents();
            new ExifImage(file_buf, function (error, exifData) {
              if (error)
                console.log('Error: '+error.message);
              else {
                console.log(exifData); // Do something with your data!

                let dateTimeComponents = exifData.exif.DateTimeOriginal.match(/\d+/g);
                let dateTimeString = dateTimeComponents[0] + "-" + dateTimeComponents[1] + "-" + dateTimeComponents[2] + " " + dateTimeComponents[3] + ":" + dateTimeComponents[4] + ":" + dateTimeComponents[5];
                let timestamp = new Date(dateTimeString).getTime() / 1000;
                let baseFileName = fileName.split("/").pop();
                let baseFileNameParts = baseFileName.split(".");
                if (baseFileNameParts.length > 1)
                  baseFileNameParts.pop();
                baseFileName = baseFileNameParts.join(".") + "_" + timestamp;

                console.log("Remain size: " + fileWritableStreamBuffer.size() / 1024 + "kb");

                let relocate_path = data.project + "/" + data.site + "/" + data.sub_site + "/" + data.location;

                let _id = md5(relocate_path + '/' + baseFileName);

                let upsert_query = JSON.stringify({
                  _id: _id,
                  $set: {
                    url: relocate_path + '/' + baseFileName + ".jpg",
                    url_md5: _id,
                    date_time_original: exifData.exif.DateTimeOriginal,
                    date_time_original_timestamp: timestamp,
                    project: data.project,
                    site: data.site,
                    sub_site: data.sub_site,
                    location: data.location,
                    full_location_md5: md5(relocate_path),
                    timezone: "+8"
                  },
                  $addToSet: {related_upload_session: "upload_session_id"},
                  $setOnInsert: true
                });

                // original file upload
                if (file_size)
                s3.upload({Bucket: bucket, Key: relocate_path + '/' + baseFileName + ".jpg", Body: file_buf, ContentType: "image/jpeg"}, {},
                  function(err, data) {
                    if (err) 
                      console.log('ERROR!');
                    else
                      console.log('OK');
                  });
                s3.upload({Bucket: bucket, Key: relocate_path + '/' + baseFileName + ".json", Body: upsert_query, ContentType: "application/json"}, {},
                  function(err, data) {
                    if (err) 
                      console.log('ERROR!');
                    else
                      console.log('OK');
                  });
              }
            });
            //*/

            // diff resolutions and quality settings
            if (0) // turn off testing
            for (let res_idx = 4; res_idx <= 8; res_idx++) {
              for (let quality = 60; quality <= 80; quality = quality + 10) {
                let width = 128 * res_idx;
                let height = 3 * width / 4;

                sharp(file_buf)
                  .withMetadata()
                  .resize(width, height)
                  .webp({quality: quality})
                  // .jpeg({quality: 80})
                  // .webp({ lossless: true })
                  .toBuffer()
                  .then(function(resized_data){
                    // 再用EXIF做為重新命名的依據
                    if (file_size)
                    s3.upload({Bucket: bucket, Key: 'public_images/' + width + 'q' + quality + '/' + fileName + ".webp", Body: resized_data, ContentType: "image/webp"}, {},
                      function(err, data) {
                        if (err) 
                          console.log('ERROR!');
                        else
                          console.log('OK');
                      });

                  });
                }
            }
          });
        }
      });
  });

}


