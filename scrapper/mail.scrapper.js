require('dotenv-defaults');
const nodemailer = require("nodemailer");


Feature('mails').tag('@mail');

Scenario('try to send email', async ({ I, soccerStatsPage, clientPage}) => {

    let transporter = nodemailer.createTransport({
        host: process.env.HOST,
        port:process.env.SECURE,
        secure:process.env.SECURE,
        auth: {
            user:process.env.USERMAIL,
            pass:process.env.PASSMAIL,
        },
    });

    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <'+  process.env.FROM_MAIL + '>',
        to: process.env.TO_MAILS,
        bcc: process.env.BCC_MAILS,
        subject: "Hello ✔",
        text: "Hello world?",
        html: "<b>Hello world?</b>",
        attachments: [
            {
                filename: 'prediction_for_2022_7_7.csv',
                path: './predictionMatches/prediction_for_2022_7_7.csv',
            },

        ]
    });

    console.log("Message sent: %s", info.messageId);

})
