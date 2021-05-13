const {objectkit} = require('basekits')
const {google} = require('googleapis')

function MadmiralClientGmail() {
  let client = null, gmail = null
  const scopes = ['https://www.googleapis.com/auth/gmail.send']

  async function init(config) {
    client = await google.auth.getClient({scopes: scopes})
    client.subject = objectkit.getProp(config, 'sender', config.subject)

    gmail = google.gmail({ version: 'v1', auth: client })

    return [client, gmail];
  }

  async function send(message, config, params) {
    if (!config.gmail) {
      return new Error('Not configured.')
    }

    if (!client) {
      try {
        await init(config.gmail)
      } catch (e) {
        return e
      }
    }

    if (config.gmail.subject || config.gmail.sender) {
      message.setSender(config.gmail.sender)
    }

    try {
      const resp = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: message.asEncoded()
        }
      })

      if (!objectkit.getProp(resp, ['data', 'id'])) {
        return new Error('Message id not found')
      }

      return resp.data
    }
    catch (e) {
      return e
    }
  }

  return {
    id: 'gmail',
    channel: 'email',
    priority: 1,
    send: send
  }
}

module.exports = MadmiralClientGmail
