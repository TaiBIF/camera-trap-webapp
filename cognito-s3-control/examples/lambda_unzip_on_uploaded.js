'use strict';

let AWS = require('aws-sdk');
let s3 = new AWS.S3();
let PassThrough = require('stream').PassThrough;
let Writable = require('stream').Writable;
let unzip = require('unzip-stream');
let streamBuffers = require('stream-buffers');
let ExifImage = require('exif').ExifImage;

exports.handler = (event, context, callback) => {
	
	console.log(event.Records[0].s3.object);
	console.log(event.Records[0].s3);

	let bucket = event.Records[0].s3.bucket.name;

	let file_key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
	let params = { Bucket: bucket, Key: file_key };

	s3.getObjectTagging(params, function(err, data) {
		if (err) console.log(err, err.stack); // an error occurred
		else     console.log(data);

		s3.getObject(params).createReadStream()
			.pipe(unzip.Parse())
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
							else
								console.log(exifData); // Do something with your data!
						});
						//*/

						console.log("Remain size: " + fileWritableStreamBuffer.size() / 1024 + "kb");

						// TODO: 再用EXIF做為重新命名的依據
						if (file_size)
						s3.upload({Bucket: bucket, Key: 'tmp_zip/' + fileName, Body: file_buf}, {},
							function(err, data) {
								if (err) 
									console.log('ERROR!');
								else
									console.log('OK');
							});
		
					});
				}
			});
	});

}
