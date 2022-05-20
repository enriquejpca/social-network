const aws = require("aws-sdk");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: "eu-central-1", // Make sure this corresponds to the region in which you have verified your email address (or 'eu-west-1' if you are using the Spiced credentials)
});

//in server.js, you´re going to want to call this function in your server ins a POST route(whenever the user wants to reset the password)
exports.sendEmail = function (message) {
    return ses
        .sendEmail({
            Source: "<enriquejpca@gmail.com>",
            Destination: {
                ToAddresses: ["enriquejpca@gmail.com"],
            },
            Message: {
                Body: {
                    Text: {
                        Data: message,
                    },
                },
                Subject: {
                    Data: "Reset code",
                },
            },
        })
        .promise();
};
