const {SMTPClient} = require('smtp-client')

function MadmiralClientSmtp() {
  async function send(message, config, params) {
    if (!config.smtp) {
      return new Error('Not configured.')
    }

    const client = new SMTPClient({
      host: config.smtp.host,
      port: config.smtp.port
    })

    message.setSender(config.smtp.username)

    try {
      await client.connect(5000)
      await client.greet({hostname: config.smtp.host})
      await client.authPlain({username: config.smtp.username, password: config.smtp.password})
      await client.mail({from: config.smtp.username})
      const recipients = message.getRecipients()
      for (var i = 0; i < recipients.length; i++) {
        await client.rcpt({to: recipients[i].addr})
      }
      await client.data(message.asRaw())
      await client.quit()

      return true
    } catch (e) {
      return e
    }
  }

  return {
    id: 'smtp',
    channel: 'email',
    priority: 1,
    send: send
  }
}

module.exports = MadmiralClientSmtp
