const FormatDate = (today) => {
  var now = new Date()
  var additionalHours = 0
  now.setTime(today + (additionalHours * 60 * 60 * 1000))
  var y = now.getFullYear()
  var m = now.getMonth() + 1
  var d = now.getDate()
  var hh = now.getHours()
  var mm = now.getMinutes()
  var ss = now.getSeconds()
  var dateFormatted = '' + y + (m < 10 ? '0' : '') + m + (d < 10 ? '0' : '') + d + (hh < 10 ? '0' : '') + hh + (mm < 10 ? '0' : '') + mm + (ss < 10 ? '0' : '') + ss
  return dateFormatted
}

export default FormatDate