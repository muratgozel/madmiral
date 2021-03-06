const {typekit, validationkit} = require('basekits')

function SMSMessage() {
  this.gsm7bitChars = "@£$¥èéùìòÇ\\nØø\\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !\\\"#¤%&'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà"
  this.maxMsgLength = null
  this.cutMsgIfNeccessary = true
  this.numberCleanerRe = /[^\d+]/g

  this.message = null
  this.recipients = []
}

SMSMessage.prototype.setRecipient = function setRecipient(inputs) {
  if (typekit.isString(inputs)) {
    const number = inputs.replace(this.numberCleanerRe, '')
    if (!validationkit.isEmpty(number)) {
      this.recipients.push(number)
    }
  }
  else if (typekit.isArray(inputs)) {
    for (let i = 0; i < inputs.length; i++) {
      const num = inputs[i].replace(this.numberCleanerRe, '')
      if (!validationkit.isEmpty(num)) {
        this.recipients.push(num)
      }
    }
  }
}

SMSMessage.prototype.setMessage = function setMessage(msg) {
  const re = new RegExp("^[" + this.gsm7bitChars + "]*$")
  this.maxMsgLength = re.test(msg) === true ? 160 : 70

  if (this.cutMsgIfNeccessary === false) {
    this.message = msg

    return this.message
  }

  this.message = msg
  if (this.message.length > this.maxMsgLength) {
    this.message = this.message.slice(0, this.maxMsgLength)
  }

  return this.message
}

SMSMessage.prototype.getMessage = function getMessage() {
  return this.message
}

SMSMessage.prototype.getRecipients = function getRecipients() {
  return this.recipients
}

module.exports = SMSMessage
