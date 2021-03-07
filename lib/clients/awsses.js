const AWS = require('aws-sdk')

function MadmiralClientAWSSes() {
  let client = null

  function send(message, config, params) {
    if (!client) {
      client = new AWS.SES({region: config.awsses.region})
    }

    return new Promise(function(resolve, reject) {
      const payload = {
        Destinations: message.getRecipients().map(r => r.addr),
        RawMessage: {
          Data: message.asRaw()
        },
        Source: message.getSenders()[0].addr
      }

      client.sendRawEmail(payload, function(err, result) {
        // result has MessageId
        return resolve(err ? err : result)
      })
    })
  }

  return {
    id: 'awsses',
    channel: 'email',
    priority: 2,
    send: send
  }
}

module.exports = MadmiralClientAWSSes
