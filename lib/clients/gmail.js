const {google} = require('googleapis')

function Gmail() {
  this.id = 'gmail'
  this.channel = 'email'
  this.priority = 2
  this.client = null
  this.gmail = null
}

Gmail.prototype.scopes = ['https://www.googleapis.com/auth/gmail.send']

Gmail.prototype.init = function init(config) {
  const self = this

  return new Promise(function(resolve, reject) {
    google.auth
      .getClient({
        scopes: self.scopes
      })
      .then(function(client) {
        self.client = client
        self.client.subject = config.subject

        self.gmail = google.gmail({ version: 'v1', auth: self.client })

        return resolve()
      })
      .catch(function(err) {
        return reject(err)
      })
  })
}

Gmail.prototype.send = function send(message) {
  const self = this

  return new Promise(function(resolve, reject) {
    self.gmail.users.messages
      .send({
        userId: 'me',
        requestBody: {
          raw: message.asEncoded()
        }
      }).then(function(resp) {
        return resolve({id: resp.data.id})
      }).catch(function(err) {
        return reject(err)
      })
  })
}

module.exports = new Gmail()
