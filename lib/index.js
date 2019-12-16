const EventEmitter = require('event-emitter-object/source')
const utility = require('my-little-lodash/dist/node')
const MIMEMessage = require('mimetext')
const SMSMessage = require('./SMSMessage')

function Notifly(initialEvents) {
  EventEmitter.call(this, initialEvents)

  this.services = {
    awsses: require('./clients/awsses'),
    gmail: require('./clients/gmail'),
    messagebird: require('./clients/messagebird')
  }
  this.templates = {}
}

Notifly.prototype = Object.create(EventEmitter.prototype)
Notifly.prototype.constructor = Notifly

Notifly.prototype.utility = utility

Notifly.prototype.init = function init(config) {
  const self = this

  const names = Object.keys(config).filter(s => self.services.hasOwnProperty(s))
  return Promise.all(names.map(function(name) {
    return self.services[name].init(config[name])
  }))
}

Notifly.prototype.sendEmail = function sendEmail(params, cb) {
  const msg = new MIMEMessage()

  msg.setSender(params.sender)

  msg.setRecipient(params.recipients)

  msg.setSubject(params.subject)

  msg.setAttachments(this.utility.getProp(params, 'attachments'))

  msg.setMessage(params.message)

  this.runServices('email', msg, cb)
}

Notifly.prototype.sendSMS = function sendSMS(params, cb) {
  const msg = new SMSMessage()

  msg.setRecipient(params.recipients)

  msg.setMessage(params.message)

  this.runServices('sms', msg, cb)
}

Notifly.prototype.runServices = function runServices(channel, msg, cb) {
  const services = Object.values(this.services).filter(s => s.channel == channel)
  const sorted = this.utility.sortItemsBy(services, 'priority', 'asc')
  const errors = []

  if (sorted.length === 0) {
    errors.push({service: null, error: new Error('noServiceFound')})
  }

  function _send() {
    if (sorted.length === 0) {
      return cb(errors, {})
    }

    sorted[0].send(msg)
      .then(function(result) {
        return cb(errors.length === 0 ? null : errors, result)
      })
      .catch(function(err) {
        errors.push({service: sorted[0].id, error: err})
        sorted.shift()
        _send()
      })
  }

  return _send()
}

Notifly.prototype.addTemplate = function addTemplate(id, data) {
  this.templates[id] = data
}

Notifly.prototype.parseTemplate = function parseTemplate(id, params) {
  const template = this.templates[id]
  return this.utility.template(template, params)
}

Notifly.prototype.addService = function addService(name, object) {
  this.services[name] = object
}

module.exports = Notifly
