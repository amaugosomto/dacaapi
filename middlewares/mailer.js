const nodemailer = require("nodemailer");
require("dotenv").config();
const { google } = require('googleapis');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const USER = process.env.USER;

const getMailBody = require("./mailer.html");

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN
});

async function sendMail(id, token) {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: USER,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken
            }
        });

        let mailBody = getMailBody(id, token);

        const mailOptions = {
            from: `DACA-NG <${USER}>`,
            to: 'amaugosomto@gmail.com',
            subject: 'ACCOUNT ACTIVATION',
            html: mailBody
        };

        const result = transport.sendMail(mailOptions);
        return result;

    } catch (error) {
        return error;
    }
}

// const sendMail = async (receiver, subject, id, token) => {
//     var transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             type: "OAuth2",
//             user: config.user,
//             clientId: config.client_id,
//             clientSecret: config.client_secret,
//             refreshToken: config.refresh_token
//         }
//     });

//     let mailBody = getMailBody(id, token);
    
//     var mailOptions = {
//         from: config.user,
//         to: receiver,
//         subject,
//         html: mailBody
//     }

//     transporter.sendMail(mailOptions, function(err, res) {
//         err? console.log(err) : console.log(res)
//     })
// }

module.exports = {
    sendMail
};
