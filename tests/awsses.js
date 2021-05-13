const fs = require('fs')
const assert = require('assert')
const madmiral = require('../lib')
const credentials = JSON.parse(fs.readFileSync('./credentials/credentials.json', 'utf8'))

async function testAwsSes() {
  delete credentials.gmail

  process.env['AWS_ACCESS_KEY_ID'] = credentials.awsses.accessKeyID
  process.env['AWS_SECRET_ACCESS_KEY'] = credentials.awsses.secretAccessKey

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

testAwsSes()
