const aws = require("aws-sdk");
const { text } = require("express");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: "eu-central-1",
});
exports.sendEmail = (to, text, subj) => {
    console.log("to,text,subject", to, text, subj);
    return ses
        .sendEmail({
            Source: "dennis_j_murphy@mac.com",
            Destination: {
                ToAddresses: [to],
            },
            Message: {
                Body: {
                    Text: {
                        Data: text,
                    },
                },
                Subject: {
                    Data: subj,
                },
            },
        })
        .promise()
        .then(() => console.log("the email appears to have been sent"))
        .catch((err) => console.log("I don't want to see this error", err));
};
// };
// exports.sendEmail = (to, text, subj) => {
//     return ses.sendEmail({
//         Source: 'dennis_j_murphy@mac.com',
//         Destination: {
//             ToAddresses: [to]
//         },
//         Message: {
//             Body: {
//                 Text: {
//                     Data: text
//                 }
//             },
//             Subject: {
//                 Data: subj
//             }
//         }
//     }).promise().then(
//         () => console.log('it worked!')
//     ).catch(
//         err => console.log(err);
//
