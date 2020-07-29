const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

exports.upload = function (req, res, next) {
    if (!req.file) {
        console.log("Multer failure");
        return res.sendStatus(500);
        // send error message to user too?
    }
    const { filename, mimetype, size, path } = req.file;

    s3.putObject({
        Bucket: "socialnetwork", // gotta make a new bucket
        ACL: "public-read",
        //key is the name for bucket files, multer supplies this via filename
        Key: filename,
        Body: fs.createReadStream(path),
        ContentType: mimetype,
        ContentLength: size,
    })
        .promise()
        .then(() => {
            next();
            fs.unlink(path, () => {});
            // fs deletes the uploaded file
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
};
