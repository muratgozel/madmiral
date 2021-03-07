const createMessagebirdClient = require('messagebird')
const {objectkit} = require('basekits')

function MadmiralClientMessagebird() {
  let messagebird = null

  function send(message, config, params) {
    return new Promise(function(resolve, reject) {
      if (!messagebird) {
        messagebird = createMessagebirdClient(objectkit.getProp(
          config.messagebird, 'accessKey', process.env.MESSAGEBIRD_ACCESS_KEY))
      }

      const origin = config.messagebird.origin
      const recipients = message.getRecipients().map(function(number) {
        return number.indexOf('+') !== -1 ? number.slice(1) : number
      })
      const payload = {
        originator: origin,
        recipients: recipients,
        body: message.getMessage()
      }
      messagebird.messages.create(payload, function(err, resp) {
        return resolve(err ? err : resp)
      })
    })
  }

  return {
    id: 'messagebird',
    channel: 'sms',
    priority: 1,
    send: send
  }
}

module.exports = MadmiralClientMessagebird
