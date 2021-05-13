const fs = require('fs')
const assert = require('assert')
const madmiral = require('../lib')
const credentials = JSON.parse(fs.readFileSync('./credentials/credentials.json', 'utf8'))

async function testSmtp() {
  delete credentials.gmail
  delete credentials.awsses

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

testSmtp()
