const message = '信息';
const handleMessage = (v) => {
  return v + '（tag）'
}
module.exports = {
  message,
  addTag: handleMessage
}