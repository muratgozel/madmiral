const createMessagebirdClient = require('messagebird')
const {objectkit} = require('basekits')

function Messagebird() {
  this.id = 'messagebird'
  this.channel = 'sms'
  this.priority = 1
  this.messagebird = null
  this.origin = null
}

Messagebird.prototype.init = function init(config) {
  const accessKey = objectkit.getProp(
    config, 'accessKey', process.env.MESSAGEBIRD_ACCESS_KEY
  )
  this.messagebird = createMessagebirdClient(accessKey)
  this.origin = config.origin

  return Promise.resolve()
}

Messagebird.prototype.send = function send(message) {
  const self = this

  return new Promise(function(resolve, reject) {
    const recipients = message.getRecipients().map(function(number) {
      if (number.indexOf('+') !== -1) return number.slice(1)
      else return number
    })

    const payload = {
      originator: self.origin,
      recipients: recipients,
      body: message.getMessage()
    }

    self.messagebird.messages.create(payload, function(err, resp) {
      if (err) {
        return reject(err)
      }

      return resolve({id: resp.id})
    })
  })
}

module.exports = new Messagebird()
