const fs = require("fs");
const aws = require("aws-sdk");

let secrets = require("./secrets.json");
// if (process.env.NODE_ENV == "production") {
//     secrets = process.env; // in prod the secrets are environment variables
// } else {
//     secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
// }

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

exports.upload = (req, res, next) => {
    console.log("IN S3 FILE");
    //if there is no file, send an error message!
    if (!req.file) {
        return res.sendStatus(500);
    }
    // we only want to talk to s3 if we have a file.
    console.log("file: ", req.file); // Always to console.log!!
    const { filename, mimetype, size, path } = req.file;

    const promise = s3
        .putObject({
            Bucket: "buckerybucket",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();

    promise
        .then(() => {
            // it worked!!!
            console.log("aws upload complete!");
            //OPTIONAL This will delete the image we just uploaded from the uploaded folder.
            //fs.unlink(path, () => {});
            next();
        })
        .catch((err) => {
            // uh oh
            console.log("err in s3 upload; ", err);
            res.sendStatus(404);
        });
};
