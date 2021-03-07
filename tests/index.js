const fs = require('fs')
const assert = require('assert')
const madmiral = require('../lib')
const credentials = JSON.parse(fs.readFileSync('./credentials/credentials.json', 'utf8'))

assert.deepStrictEqual(typeof madmiral.send, 'function')

process.env['GCLOUD_PROJECT'] = credentials.gmail.gcloudProject
process.env['GOOGLE_APPLICATION_CREDENTIALS'] = credentials.gmail.applicationCredentials
process.env['AWS_ACCESS_KEY_ID'] = credentials.aws.accessKeyID
process.env['AWS_SECRET_ACCESS_KEY'] = credentials.aws.secretAccessKey

const config1 = {
  gmail: {
    subject: credentials.gmail.subject
  },
  awsses: {
    region: 'eu-west-1'
  }
}
madmiral.configure(config1)

const msg = madmiral.createEmailMessage({
  sender: config1.gmail.subject,
  recipients: credentials.sampleEmailRecipients,
  subject: 'Test',
  message: 'Hi, this is a test email.'
})

madmiral.send(msg).then(function(r) {
  console.log('result:', r)
}).catch(function(err) {
  console.log('err:', err)
})

config1.messagebird = credentials.messagebird
config1.verimor = credentials.verimor
madmiral.configure(config1)

const smsmsg = madmiral.createSMSMessage({
  recipients: credentials.sampleSMSRecipients,
  message: 'Hi. This is a test sms.'
})
madmiral.send(smsmsg).then(function(r) {
  console.log('result:', r)
})
