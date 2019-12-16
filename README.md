# Madmiral
Your message will be sent, whatever it takes. Madmiral is a node.js library for sending email and sms with templates and multiple SDK clients support.

## Install
```
npm i madmiral
```

## Configuration & Supported Clients

Supported clients are [AWS-SES][13e5593a] (Email), [Google Gmail][fb6f016b] (Email) and [Messagebird][46697165] (SMS).

  [13e5593a]: https://aws.amazon.com/ses/ "AWS Simple Email Service"
  [fb6f016b]: https://developers.google.com/gmail/api "Google Gmail API"
  [46697165]: https://messagebird.com/ "Messagebird SMS"

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
    /*
    * Set MESSAGEBIRD_ACCESS_KEY environment variable
    * with appropriate value.
    */

    // Get the origin that you are authorized to use from messagebird.
    origin: 'SMS_SENDER_NAME'
  }
}
```

## Initiate Library
Initiation is the process of validating clients with the given configuration, therefore it returns a promise.

```js
const Madmiral = require('madmiral')

const madmiral = new Madmiral()

madmiral
  .init(config)
  .then(function() {
    // all clients ready.

    // send email or sms
  })
  .catch(function(err) {
    // one of the clients failed to init.
  })
```

## Send An Email
Simply:

```js
madmiral.sendEmail(sendEmailConfig, function(err, result) {
  if (result.id) {
    // your email sent!
  }

  if (err) {
    // err is an array of errors that clients raised
    // during trying to send your email.
  }
})
```

It will try another client in the case of an error. To understand whether your email has been sent or not, check the `id` of the `result` object.

Madmiral supports many options such as multiple attachments and recipients when sending an email.

Let's first define some example values:
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

Email send configuration reference:

Parameter  |  Description  |  Possible Values
--|--|--
sender  |  Sender of the email.  |  `personA` or `personB`
recipients  |  Recipients of the email.  |  `personA` or `personB` or `personList`
subject  |  Subject of the email.  |  `subject`
message  |  Content of the email.  |  `messageA` or `messageB`
attachments  |  Files will be attached to email.  |  `attachmentA` or `attachmentList`

## Send An SMS
Simply:

```js
madmiral.sendSMS(sendSMSConfig, function(err, result) {
  if (result.id) {
    // your sms sent!
  }

  if (err) {
    // err is an array of errors that clients raised
    // during trying to send your sms.
  }
})
```

It will try another client in the case of an error. To understand whether your sms has been sent or not, check the `id` of the `result` object.

SMS send configuration reference:

Parameter  |  Description  |  Possible Values
--|--|--
message  |  Sender of the email.  |  `Hey!`
recipients  |  Recipients of the sms.  |  `+901234567890` or Array of `+901234567890`.
