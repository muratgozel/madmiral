const {stringkit, arraykit} = require('basekits')
const MIMEMessage = require('mimetext')
const SMSMessage = require('./SMSMessage')

function createEmailMessage(params) {
  const msg = new MIMEMessage()

  if (params.sender) {
    msg.setSender(params.sender)
  }
  msg.setRecipient(params.recipients)
  msg.setSubject(params.subject)
  if (params.attachments) {
    msg.setAttachments(params.attachments)
  }
  msg.setMessage(params.message)

  return msg
}

function createSMSMessage(params) {
  const msg = new SMSMessage()

  msg.setRecipient(params.recipients)
  msg.setMessage(params.message)

  return msg
}

function madmiral() {
  let config = {}
  const templates = {}
  const services = {
    awsses: require('./clients/awsses')(),
    gmail: require('./clients/gmail')(),
    messagebird: require('./clients/messagebird')(),
    verimor: require('./clients/verimor')()
  }
  const serviceFunctions = Object.values(services)
  const servicesEmail = serviceFunctions.filter(s => s.channel == 'email')
  const servicesEmailSorted = arraykit.sortItemsBy(servicesEmail, 'priority', 'desc')
  const servicesSMS = serviceFunctions.filter(s => s.channel == 'sms')
  const servicesSMSSorted = arraykit.sortItemsBy(servicesSMS, 'priority', 'desc')

  function addTemplate(id, data) {
    templates[id] = data
  }

  function getTemplate(id) {
    return templates[id]
  }

  function parseTemplate(id, params) {
    const template = templates[id]
    return stringkit.template(template, params)
  }

  function configure(_config) {
    config = _config
  }

  function send(message, params={}) {
    return new Promise(async function(resolve, reject) {
      const defaultResponse = {success: false, errors: [], responses: []}
      if (message instanceof MIMEMessage) {
        const servicesCopy = [].concat(servicesEmailSorted)
        _send(servicesCopy, message, config, params, defaultResponse, function(result) {
          return resolve(result)
        })
      }
      else if (message instanceof SMSMessage) {
        const servicesCopy = [].concat(servicesSMSSorted)
        _send(servicesCopy, message, config, params, defaultResponse, function(result) {
          return resolve(result)
        })
      }
      else {
        defaultResponse.errors.push(new Error('Invalid message.'))
        return resolve(defaultResponse)
      }
    })
  }

  function _send(arr, message, config, params, result, cb) {
    if (arr.length === 0) {
      if (result.success === false) result.errors.push(new Error('No service is working.'))
      return cb(result)
    }

    arr[0]
      .send(message, config, params)
      .then(function(resp) {
        if (resp instanceof Error) {
          arr.shift()
          result.errors.push(resp)
          return _send(arr, message, config, params, result, cb)
        }
        else {
          result.success = true
          result.successResponse = result
          result.responses.push(result)
          return cb(result)
        }
      })
      .catch(function(err) {
        arr.shift()
        result.errors.push(err)
        _send(arr, message, config, params, result, cb)
      })
  }

  return {
    configure: configure,
    createSMSMessage: createSMSMessage,
    createEmailMessage: createEmailMessage,
    addTemplate: addTemplate,
    getTemplate: getTemplate,
    parseTemplate: parseTemplate,
    send: send
  }
}

module.exports = madmiral()
