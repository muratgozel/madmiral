const fs = require('fs')
const assert = require('assert')
const madmiral = require('../lib')
const credentials = JSON.parse(fs.readFileSync('./credentials/credentials.json', 'utf8'))

async function testGmail() {
  delete credentials.awsses
  delete credentials.smtp

  process.env['GCLOUD_PROJECT'] = credentials.gmail.gcloudProject
  process.env['GOOGLE_APPLICATION_CREDENTIALS'] = credentials.gmail.applicationCredentials

  madmiral.configure(credentials)

  const msg = madmiral.createEmailMessage({
    recipients: credentials.sampleEmailRecipients,
    subject: 'Test',
    message: 'Hi, this is a test email.'
  })

  const result = await madmiral.send(msg)

  if (result.errors) {
    console.log(result.errors)
  }

  assert.deepStrictEqual(result.success, true)

  return result
}

testGmail()
