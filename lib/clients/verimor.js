const sdk = require('verimor-node-sdk')

function MadmiralClientVerimor() {
  let client = null

  async function send(message, config, params) {
    if (!config.verimor) {
      return new Error('Not configured.')
    }

    if (!client) {
      client = sdk.createClient({
        username: config.verimor.username,
        password: config.verimor.password
      })
    }

    const origin = config.verimor.origin
    const recipients = message.getRecipients().map(function(number) {
      return number.indexOf('+') !== -1 ? number.slice(1) : number
    })
    const payload = {
      source_addr: origin,
      messages: [
        {
          msg: message.getMessage(),
          dest: recipients
        }
      ]
    }
    if (params.campaignID) payload.custom_id = params.campaignID
    const resp = await client.send(payload)
    if (resp.error) {
      return new Error(resp.error)
    }
    else {
      return resp
    }
  }

  return {
    id: 'verimor',
    channel: 'sms',
    priority: 2,
    send: send
  }
}

module.exports = MadmiralClientVerimor
