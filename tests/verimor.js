const fs = require('fs')
const assert = require('assert')
const madmiral = require('../lib')
const credentials = JSON.parse(fs.readFileSync('./credentials/credentials.json', 'utf8'))

async function testVerimor() {
  delete credentials.messagebird

  madmiral.configure(credentials)

  const msg = madmiral.createSMSMessage({
    recipients: credentials.sampleSMSRecipients,
    message: 'Hi. This is a test sms.'
  })

  const result = await madmiral.send(msg)

  if (result.errors) {
    console.log(result.errors)
  }

  assert.deepStrictEqual(result.success, true)

  return result
}

testVerimor()
