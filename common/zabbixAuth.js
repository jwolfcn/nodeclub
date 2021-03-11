var request = require('request')
let authKey = null
const headers = {
  //设置请求头
  'content-type': 'application/json-rpc',
}
const url = 'http://localhost/api_jsonrpc.php'

function auth() {
  let payload = {
    jsonrpc: '2.0',
    method: 'user.login',
    params: {
      user: 'Admin',
      password: 'zabbix',
    },
    id: 1,
    auth: null,
  }
  request(
    {
      url: url, //请求路径
      method: 'POST', //请求方式，默认为get
      headers,
      body: JSON.stringify(payload), //post参数字符串
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        authKey = JSON.parse(body).result
        getHost()
        console.log(body)
      }
    }
  )
}

function getHost() {
  let payload = {
    jsonrpc: '2.0',
    method: 'host.get',
    params: {
      output: ['hostid', 'name'],
      selectInterfaces: ["interfaces", "ip"]
    },
    auth: authKey,
    id: 1,
  }
  request(
    {
      url: url, //请求路径
      method: 'POST', //请求方式，默认为get
      headers,
      body: JSON.stringify(payload), //post参数字符串
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body)
      }
    }
  )
}
auth()
