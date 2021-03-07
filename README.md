# Madmiral
Madmiral is a node.js library for sending email and SMS through multiple SDK clients with templates support.

## Install
```sh
npm i madmiral
```

## Configuration & Supported Clients
Supported clients are

1. [AWS-SES][13e5593a] (Email),
2. [Google Gmail][fb6f016b] (Email)
3. [Messagebird][46697165] (SMS)
4. [Verimor](47697165) (SMS)
5. Write one more and make a pull request?

  [13e5593a]: https://aws.amazon.com/ses/ "AWS Simple Email Service"
  [fb6f016b]: https://developers.google.com/gmail/api "Google Gmail API"
  [46697165]: https://messagebird.com/ "Messagebird SMS"
  [47697165]: https://verimor.com.tr "Verimor SMS"

Create a configuration with the clients you would like to use:

```js
const config = {
  awsses: {
    /*
    * Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables
    * with appropriate values.
    */

    // The region of the AWS-SES service. 'eu-west-1' for example.
    region: 'REGION_NAME'
  },
  gmail: {
    /*
    * Set GCLOUD_PROJECT and GOOGLE_APPLICATION_CREDENTIALS environment variables
    * with appropriate values.
    */

    // The sender. The email address which actually exist in your domain.
    subject: 'EMAIL_ADDRESS'
  },
  messagebird: {
    accessKey: 'ACCESS_KEY' // or set env var MESSAGEBIRD_ACCESS_KEY

    // Get the origin that you are authorized to use from messagebird.
    origin: 'SMS_SENDER_NAME'
  },
  verimor: {
    username: "",
    password: "",
    origin: ""
  }
}
```

## Usage
Send a simple email and sms. Multiple services may be configured. Madmiral will try the other one if one fails.
```js
const madmiral = require('madmiral')

madmiral.configure(config)

// lets create an email message
const msg = madmiral.createEmailMessage({
  sender: config.gmail.subject,
  recipients: credentials.sampleEmailRecipients,
  subject: 'Test',
  message: 'Hi, this is a test email.'
})

// and create one sms message
const smsmsg = madmiral.createSMSMessage({
  recipients: credentials.sampleSMSRecipients,
  message: 'Hi. This is a test sms.'
})

// send the email message
madmiral.send(msg).then(function(result) {
  // result.success === true
})

// send the sms
madmiral.send(smsmsg).then(function(result) {
  // result.success === true
})
```

### Creating Messages
Multiple attachments and recipients are supported in email messages thanks to [mimetext](https://github.com/muratgozel/MIMEText) library.
```js
const personA = 'test@test.com'
const personB = {name: 'Fullname', addr: 'test@test.com'}
const personList = [personA, personB]

const subject = 'Hello 🖐'

const messageA = 'Sample plain text message.'
const messageB = 'Sample <b>HTML</b> message.'

const attachmentA = {
  type: 'image/jpeg',
  base64Data: fs.readFileSync('./somelogo.jpg').toString('base64'),
  filename: 'somelogo.jpg'
}
const attachmentList = [attachmentA]
```
**Email message parameters reference:**

Parameter  |  Description  |  Possible Values
--|--|--
sender  |  Sender of the email.  |  `personA` or `personB`
recipients  |  Recipients of the email.  |  `personA` or `personB` or `personList`
subject  |  Subject of the email.  |  `subject`
message  |  Content of the email.  |  `messageA` or `messageB`
attachments  |  Files will be attached to email.  |  `attachmentA` or `attachmentList`

**SMS message parameters reference:**

Parameter  |  Description  |  Possible Values
--|--|--
message  |  Sender of the email.  |  `Hey!`
recipients  |  Recipients of the sms.  |  `+901234567890` or Array of `+901234567890`.

## Tests
Tests are written in tests folder and can be run with `npm test`. You need to create your own credentials file in `credentials/credentials.json`

---

Thanks for watching 🐬

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/F1F1RFO7)
