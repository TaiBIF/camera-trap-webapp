'use strict';

let AWS = require('aws-sdk');
let s3 = new AWS.S3();
let PassThrough = require('stream').PassThrough;
let unzip = require('unzip-stream');

exports.handler = (event, context, callback) => {
    
    // console.log(event.Records[0].s3.object);
    // console.log(event.Records[0].s3);

    let bucket = event.Records[0].s3.bucket.name;

    let file_key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    let params = { Bucket: bucket, Key: file_key };

    s3.getObject(params).createReadStream()
        .pipe(unzip.Parse())
        .on('entry', function (entry) {
            let fileName = entry.path;
            // let type = entry.type; // 'Directory' or 'File'
            // let size = entry.size;
            // console.log("File: " + fileName + ", Type: " + type + ", Size: " + size);

            let passthrough = new PassThrough();            
            entry.pipe(passthrough);
            
            s3.upload({Bucket: bucket, Key: 'tmp_zip/' + fileName, Body: passthrough}, {},
                function(err, data) {
                    if (err) 
                        console.log('ERROR!');
                    else
                        console.log('OK');
                });
            /*
            if (fileName === "this IS the file I'm looking for") {
                entry.pipe(fs.createWriteStream('output/path'));
            }
            else {
                entry.autodrain();
            }
            //*/
        });

}
