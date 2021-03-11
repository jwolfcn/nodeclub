var Topo = require('../models').Topo
var Device = require('../models').Device
var eventproxy = require('eventproxy')
const request = require('request')
const key = 'uniquetopo'
const url = 'http://localhost/api_jsonrpc.php'
const headers = {
  //设置请求头
  'content-type': 'application/json-rpc',
}
var authKey = null

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
  return new Promise((res, rej) => {
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
          res(authKey)
        }
      }
    )
  })
}
exports.saveTopo = function (req, res, next) {
  Topo.findOne({ key }, (e, d) => {
    if (!e && d) {
      d.content = req.body.topologyJSON
      d.save()
      return res.send({
        errorInfo: 'ok',
        topologyJson: d.content,
      })
    } else if (!e) {
      let t = new Topo()
      t.key = key
      t.content = req.body.topologyJSON
      t.save()
      res.send({
        errorInfo: 'ok',
      })
    } else {
      return res.send({
        errorInfo: 'error',
      })
    }
  })
}

exports.getTopo = function (req, res, next) {
  Topo.findOne({ key }, (e, d) => {
    if (!e && d) {
      return res.send({
        errorInfo: 'ok',
        topologyJson: d.content,
      })
    } else {
      return res.send({
        errorInfo: 'error',
      })
    }
  })
}

exports.bindDevice = async function (req, res, next) {
  let chart_key = req.body.chartKey
  let host_id = req.body.hostId
  let name = req.body.name
  let ip = req.body.ip
  Device.findOne({ chart_key }, (e, d) => {
    if (!e && d) {
      d.host_id = host_id
      d.name = name
      d.ip = ip
      d.save()
      return res.send({
        errorInfo: 'ok',
      })
    } else {
      let d = new Device()
      d.host_id = host_id
      d.chart_key = chart_key
      d.name = name
      d.ip = ip
      d.save()
      return res.send({
        errorInfo: 'ok',
      })
    }
  })
}
exports.getDeviceIdByKey = async function (req, res, next) {
  let chart_key = req.body.chartKey
  Device.findOne({ chart_key }, (e, d) => {
    if (!e && d) {
      return res.send({
        errorInfo: 'ok',
        data: d.host_id,
      })
    } else {
      return res.send({
        errorInfo: 'ok',
        data: '',
      })
    }
  })
}

exports.getDeviceIdByKeyMiddleWare = async function (req, res, next) {
  let chart_key = req.body.chartKey
  Device.findOne({ chart_key }, (e, d) => {
    if (!e && d) {
      req.body.hostids = d.host_id
      next()
    } else {
      return res.send({
        errorInfo: 'ok',
        data: '',
      })
    }
  })
}
exports.getDevices = async function (req, res, next) {
  if (!authKey) {
    authKey = await auth()
  }
  function getHost() {
    let payload = {
      jsonrpc: '2.0',
      method: 'host.get',
      params: {
        output: ['hostid', 'name'],
        selectInterfaces: ['interfaces', 'ip'],
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
          res.send({
            errorInfo: 'ok',
            data: JSON.parse(body),
          })
        }
      }
    )
  }
  getHost()
}

exports.getDeviceInfoByDevcieId = async function (req, res, next) {
  let hostids = req.body.hostids
  if (!authKey) {
    authKey = await auth()
  }
  let payload = {
    jsonrpc: '2.0',
    method: 'item.get',
    params: {
      output: 'extend',
      hostids: hostids,
      search: { key_: 'system' },
      sortfield: 'name',
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
        let data = JSON.parse(body)
        data = data.result.filter((item) => {
          return item.error.length === 0
        })
        res.send({
          errorInfo: 'ok',
          data: data,
        })
      }
    }
  )
}

exports.getHomePageInfo = async function (req, res, next) {
  if (!authKey) {
    authKey = await auth()
  }
  let payload = {
    jsonrpc: '2.0',
    method: 'trigger.get',
    params: {
      output: [ "triggerid",
      "description",
      "status",
      "value",
      "priority",
      "lastchange",
      "recovery_mode",
      "state"],
      "selectHosts": "hosts",
      // filter: {
      //   value: 1,
      // },
      // expandData:"hostname",
      sortfield: 'priority',
      sortorder: 'DESC',
      min_severity: 1,
      skipDependent: 1,
      monitored: 1,
      // active: 1,
      // expandDescription: 1,
      // only_true: 1,
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
        let data = JSON.parse(body)
        res.send({
          errorInfo: 'ok',
          data: data,
        })
      }
    }
  )
}
