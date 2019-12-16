const AWS = require('aws-sdk')

function AWSSES() {
  this.id = 'awsses'
  this.channel = 'email'
  this.priority = 1
  this.ses = null
}

AWSSES.prototype.init = function init(config) {
  this.ses = new AWS.SES({region: config.region})

  return Promise.resolve()
}

AWSSES.prototype.send = function send(message) {
  const self = this

  return new Promise(function(resolve, reject) {
    const params = {
      Destinations: message.getRecipients().map(r => r.addr),
      RawMessage: {
        Data: message.asRaw()
      },
      Source: message.getSenders()[0].addr
    }

    self.ses.sendRawEmail(params, function(err, result) {
      if (err) {
        return reject(err)
      }

      return resolve({id: result.MessageId})
    })
  })
}

module.exports = new AWSSES()
