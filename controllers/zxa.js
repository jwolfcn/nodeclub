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
const defalutData = {
  getDevices: {
    errorInfo: 'ok',
    data: {"jsonrpc":"2.0","result":[{"hostid":"10084","name":"Zabbix server","interfaces":[{"ip":"192.168.0.197"}]},{"hostid":"10318","name":"主机服务器A1","interfaces":[{"ip":"127.0.0.1"}]}],"id":1},
  },
  getDeviceInfoByDevcieId: {
    errorInfo: 'ok',
    data: [{"itemid":"30537","type":"0","snmp_community":"","snmp_oid":"","hostid":"10084","name":"/System/Volumes/Data: Free inodes in %","key_":"vfs.fs.inode[/System/Volumes/Data,pfree]","delay":"1m","history":"7d","trends":"365d","status":"0","value_type":"0","trapper_hosts":"","units":"%","snmpv3_securityname":"","snmpv3_securitylevel":"0","snmpv3_authpassphrase":"","snmpv3_privpassphrase":"","formula":"","logtimefmt":"","templateid":"0","valuemapid":"0","params":"","ipmi_sensor":"","authtype":"0","username":"","password":"","publickey":"","privatekey":"","flags":"4","interfaceid":"1","port":"","description":"","inventory_link":"0","lifetime":"30d","snmpv3_authprotocol":"0","snmpv3_privprotocol":"0","snmpv3_contextname":"","evaltype":"0","jmx_endpoint":"","master_itemid":"0","timeout":"3s","url":"","query_fields":[],"posts":"","status_codes":"200","follow_redirects":"1","post_type":"0","http_proxy":"","headers":[],"retrieve_mode":"0","request_method":"0","output_format":"0","ssl_cert_file":"","ssl_key_file":"","ssl_key_password":"","verify_peer":"0","verify_host":"0","allow_traps":"0","state":"0","error":"","lastclock":"0","lastns":"0","lastvalue":"0","prevvalue":"0"},{"itemid":"30534","type":"0","snmp_community":"","snmp_oid":"","hostid":"10084","name":"/System/Volumes/Data: Space utilization","key_":"vfs.fs.size[/System/Volumes/Data,pused]","delay":"1m","history":"7d","trends":"365d","status":"0","value_type":"0","trapper_hosts":"","units":"%","snmpv3_securityname":"","snmpv3_securitylevel":"0","snmpv3_authpassphrase":"","snmpv3_privpassphrase":"","formula":"","logtimefmt":"","templateid":"0","valuemapid":"0","params":"","ipmi_sensor":"","authtype":"0","username":"","password":"","publickey":"","privatekey":"","flags":"4","interfaceid":"1","port":"","description":"Space utilization in % for /System/Volumes/Data","inventory_link":"0","lifetime":"30d","snmpv3_authprotocol":"0","snmpv3_privprotocol":"0","snmpv3_contextname":"","evaltype":"0","jmx_endpoint":"","master_itemid":"0","timeout":"3s","url":"","query_fields":[],"posts":"","status_codes":"200","follow_redirects":"1","post_type":"0","http_proxy":"","headers":[],"retrieve_mode":"0","request_method":"0","output_format":"0","ssl_cert_file":"","ssl_key_file":"","ssl_key_password":"","verify_peer":"0","verify_host":"0","allow_traps":"0","state":"0","error":"","lastclock":"0","lastns":"0","lastvalue":"0","prevvalue":"0"},{"itemid":"30531","type":"0","snmp_community":"","snmp_oid":"","hostid":"10084","name":"/System/Volumes/Data: Total space","key_":"vfs.fs.size[/System/Volumes/Data,total]","delay":"1m","history":"7d","trends":"365d","status":"0","value_type":"3","trapper_hosts":"","units":"B","snmpv3_securityname":"","snmpv3_securitylevel":"0","snmpv3_authpassphrase":"","snmpv3_privpassphrase":"","formula":"","logtimefmt":"","templateid":"0","valuemapid":"0","params":"","ipmi_sensor":"","authtype":"0","username":"","password":"","publickey":"","privatekey":"","flags":"4","interfaceid":"1","port":"","description":"Total space in Bytes","inventory_link":"0","lifetime":"30d","snmpv3_authprotocol":"0","snmpv3_privprotocol":"0","snmpv3_contextname":"","evaltype":"0","jmx_endpoint":"","master_itemid":"0","timeout":"3s","url":"","query_fields":[],"posts":"","status_codes":"200","follow_redirects":"1","post_type":"0","http_proxy":"","headers":[],"retrieve_mode":"0","request_method":"0","output_format":"0","ssl_cert_file":"","ssl_key_file":"","ssl_key_password":"","verify_peer":"0","verify_host":"0","allow_traps":"0","state":"0","error":"","lastclock":"0","lastns":"0","lastvalue":"0","prevvalue":"0"},{"itemid":"30528","type":"0","snmp_community":"","snmp_oid":"","hostid":"10084","name":"/System/Volumes/Data: Used space","key_":"vfs.fs.size[/System/Volumes/Data,used]","delay":"1m","history":"7d","trends":"365d","status":"0","value_type":"3","trapper_hosts":"","units":"B","snmpv3_securityname":"","snmpv3_securitylevel":"0","snmpv3_authpassphrase":"","snmpv3_privpassphrase":"","formula":"","logtimefmt":"","templateid":"0","valuemapid":"0","params":"","ipmi_sensor":"","authtype":"0","username":"","password":"","publickey":"","privatekey":"","flags":"4","interfaceid":"1","port":"","description":"Used storage in Bytes","inventory_link":"0","lifetime":"30d","snmpv3_authprotocol":"0","snmpv3_privprotocol":"0","snmpv3_contextname":"","evaltype":"0","jmx_endpoint":"","master_itemid":"0","timeout":"3s","url":"","query_fields":[],"posts":"","status_codes":"200","follow_redirects":"1","post_type":"0","http_proxy":"","headers":[],"retrieve_mode":"0","request_method":"0","output_format":"0","ssl_cert_file":"","ssl_key_file":"","ssl_key_password":"","verify_peer":"0","verify_host":"0","allow_traps":"0","state":"0","error":"","lastclock":"0","lastns":"0","lastvalue":"0","prevvalue":"0"}]
  },
  getHomePageInfo: {
    errorInfo: 'ok',
    data: {"jsonrpc":"2.0","result":[{"triggerid":"13558","description":"Zabbix value cache working in low memory mode","status":"0","value":"0","priority":"4","lastchange":"0","recovery_mode":"0","state":"0","hosts":[{"hostid":"10084"}]},{"triggerid":"16755","description":"/Volumes/SunloginClient Installer: Running out of free inodes (free < {$VFS.FS.INODE.PFREE.MIN.CRIT:\"/Volumes/SunloginClient Installer\"}%)","status":"0","value":"0","priority":"3","lastchange":"0","recovery_mode":"0","state":"1","hosts":[{"hostid":"10084"}]},{"triggerid":"15856","description":"Zabbix LLD worker processes more than 75% busy","status":"0","value":"0","priority":"3","lastchange":"0","recovery_mode":"1","state":"0","hosts":[{"hostid":"10084"}]},{"triggerid":"15854","description":"Zabbix LLD manager processes more than 75% busy","status":"0","value":"0","priority":"3","lastchange":"0","recovery_mode":"1","state":"0","hosts":[{"hostid":"10084"}]},{"triggerid":"13571","description":"Zabbix preprocessing worker processes more than 75% busy","status":"0","value":"0","priority":"3","lastchange":"0","recovery_mode":"1","state":"0","hosts":[{"hostid":"10084"}]},{"triggerid":"13570","description":"Zabbix preprocessing manager processes more than 75% busy","status":"0","value":"0","priority":"3","lastchange":"0","recovery_mode":"1","state":"0","hosts":[{"hostid":"10084"}]},{"triggerid":"13567","description":"Zabbix alert manager processes more than 75% busy","status":"0","value":"0","priority":"3","lastchange":"0","recovery_mode":"1","state":"0","hosts":[{"hostid":"10084"}]},{"triggerid":"13563","description":"Zabbix ipmi manager processes more than 75% busy","status":"0","value":"0","priority":"3","lastchange":"0","recovery_mode":"1","state":"1","hosts":[{"hostid":"10084"}]},{"triggerid":"13560","description":"Zabbix task manager processes more than 75% busy","status":"0","value":"0","priority":"3","lastchange":"0","recovery_mode":"1","state":"0","hosts":[{"hostid":"10084"}]},{"triggerid":"13537","description":"More than 75% used in the vmware cache","status":"0","value":"0","priority":"3","lastchange":"0","recovery_mode":"0","state":"1","hosts":[{"hostid":"10084"}]},{"triggerid":"16048","description":"High memory utilization ( >{$MEMORY.UTIL.MAX}% for 5m)","status":"0","value":"0","priority":"3","lastchange":"0","recovery_mode":"0","state":"0","hosts":[{"hostid":"10084"}]},{"triggerid":"16050","description":"Lack of available memory ( < {$MEMORY.AVAILABLE.MIN} of {ITEM.VALUE2})","status":"0","value":"0","priority":"3","lastchange":"0","recovery_mode":"0","state":"0","hosts":[{"hostid":"10084"}]},{"triggerid":"16199","description":"Zabbix agent is not available (for {$AGENT.TIMEOUT})","status":"0","value":"1","priority":"3","lastchange":"1615530817","recovery_mode":"0","state":"0","hosts":[{"hostid":"10084"}]},{"triggerid":"16754","description":"/Volumes/SunloginClient Installer: Disk space is critically low (used > {$VFS.FS.PUSED.MAX.CRIT:\"/Volumes/SunloginClient Installer\"}%)","status":"0","value":"0","priority":"3","lastchange":"0","recovery_mode":"0","state":"1","hosts":[{"hostid":"10084"}]},{"triggerid":"16750","description":"/private/var/vm: Running out of free inodes (free < {$VFS.FS.INODE.PFREE.MIN.CRIT:\"/private/var/vm\"}%)","status":"0","value":"0","priority":"3","lastchange":"0","recovery_mode":"0","state":"0","hosts":[{"hostid":"10084"}]},{"triggerid":"16748","description":"/: Running out of free inodes (free < {$VFS.FS.INODE.PFREE.MIN.CRIT:\"/\"}%)","status":"0","value":"0","priority":"3","lastchange":"0","recovery_mode":"0","state":"0","hosts":[{"hostid":"10084"}]},{"triggerid":"16744","description":"/private/var/vm: Disk space is critically low (used > {$VFS.FS.PUSED.MAX.CRIT:\"/private/var/vm\"}%)","status":"0","value":"0","priority":"3","lastchange":"1615519975","recovery_mode":"0","state":"0","hosts":[{"hostid":"10084"}]},{"triggerid":"16743","description":"/System/Volumes/Data: Disk space is critically low (used > {$VFS.FS.PUSED.MAX.CRIT:\"/System/Volumes/Data\"}%)","status":"0","value":"0","priority":"3","lastchange":"1615520328","recovery_mode":"0","state":"0","hosts":[{"hostid":"10084"}]},{"triggerid":"16742","description":"/: Disk space is critically low (used > {$VFS.FS.PUSED.MAX.CRIT:\"/\"}%)","status":"0","value":"0","priority":"3","lastchange":"1615519973","recovery_mode":"0","state":"0","hosts":[{"hostid":"10084"}]},{"triggerid":"16749","description":"/System/Volumes/Data: Running out of free inodes (free < {$VFS.FS.INODE.PFREE.MIN.CRIT:\"/System/Volumes/Data\"}%)","status":"0","value":"0","priority":"3","lastchange":"0","recovery_mode":"0","state":"0","hosts":[{"hostid":"10084"}]},{"triggerid":"16565","description":"Load average is too high (per CPU load over {$LOAD_AVG_PER_CPU.MAX.WARN} for 5m)","status":"0","value":"0","priority":"3","lastchange":"0","recovery_mode":"0","state":"0","hosts":[{"hostid":"10084"}]},{"triggerid":"16274","description":"Zabbix alert syncer processes more than 75% busy","status":"0… than 75% busy","status":"0","value":"0","priority":"3","lastchange":"0","recovery_mode":"1","state":"0","hosts":[{"hostid":"10084"}]},{"triggerid":"13480","description":"Zabbix proxy poller processes more than 75% busy","status":"0","value":"0","priority":"3","lastchange":"1615263765","recovery_mode":"1","state":"0","hosts":[{"hostid":"10084"}]},{"triggerid":"13475","description":"Zabbix icmp pinger processes more than 75% busy","status":"0","value":"0","priority":"3","lastchange":"0","recovery_mode":"1","state":"0","hosts":[{"hostid":"10084"}]},{"triggerid":"16747","description":"/private/var/vm: Disk space is low (used > {$VFS.FS.PUSED.MAX.WARN:\"/private/var/vm\"}%)","status":"0","value":"0","priority":"2","lastchange":"1615520329","recovery_mode":"0","state":"0","hosts":[{"hostid":"10084"}]},{"triggerid":"16757","description":"/Volumes/SunloginClient Installer: Disk space is low (used > {$VFS.FS.PUSED.MAX.WARN:\"/Volumes/SunloginClient Installer\"}%)","status":"0","value":"0","priority":"2","lastchange":"0","recovery_mode":"0","state":"1","hosts":[{"hostid":"10084"}]},{"triggerid":"16751","description":"/: Running out of free inodes (free < {$VFS.FS.INODE.PFREE.MIN.WARN:\"/\"}%)","status":"0","value":"0","priority":"2","lastchange":"0","recovery_mode":"0","state":"0","hosts":[{"hostid":"10084"}]},{"triggerid":"16752","description":"/System/Volumes/Data: Running out of free inodes (free < {$VFS.FS.INODE.PFREE.MIN.WARN:\"/System/Volumes/Data\"}%)","status":"0","value":"0","priority":"2","lastchange":"0","recovery_mode":"0","state":"0","hosts":[{"hostid":"10084"}]},{"triggerid":"16753","description":"/private/var/vm: Running out of free inodes (free < {$VFS.FS.INODE.PFREE.MIN.WARN:\"/private/var/vm\"}%)","status":"0","value":"0","priority":"2","lastchange":"0","recovery_mode":"0","state":"0","hosts":[{"hostid":"10084"}]},{"triggerid":"16756","description":"/Volumes/SunloginClient Installer: Running out of free inodes (free < {$VFS.FS.INODE.PFREE.MIN.WARN:\"/Volumes/SunloginClient Installer\"}%)","status":"0","value":"0","priority":"2","lastchange":"0","recovery_mode":"0","state":"1","hosts":[{"hostid":"10084"}]},{"triggerid":"16746","description":"/System/Volumes/Data: Disk space is low (used > {$VFS.FS.PUSED.MAX.WARN:\"/System/Volumes/Data\"}%)","status":"0","value":"0","priority":"2","lastchange":"0","recovery_mode":"0","state":"0","hosts":[{"hostid":"10084"}]},{"triggerid":"16745","description":"/: Disk space is low (used > {$VFS.FS.PUSED.MAX.WARN:\"/\"}%)","status":"0","value":"0","priority":"2","lastchange":"1615520153","recovery_mode":"0","state":"0","hosts":[{"hostid":"10084"}]},{"triggerid":"13486","description":"More than 100 items having missing data for more than 10 minutes","status":"0","value":"0","priority":"2","lastchange":"0","recovery_mode":"0","state":"0","hosts":[{"hostid":"10084"}]},{"triggerid":"16056","description":"System time is out of sync (diff with Zabbix server > {$SYSTEM.FUZZYTIME.MAX}s)","status":"0","value":"0","priority":"2","lastchange":"1615474191","recovery_mode":"0","state":"0","hosts":[{"hostid":"10084"}]},{"triggerid":"16046","description":"High CPU utilization (over {$CPU.UTIL.CRIT}% for 5m)","status":"0","value":"0","priority":"2","lastchange":"0","recovery_mode":"0","state":"0","hosts":[{"hostid":"10084"}]},{"triggerid":"16064","description":"Getting closer to process limit (over 80% used)","status":"0","value":"0","priority":"2","lastchange":"0","recovery_mode":"0","state":"1","hosts":[{"hostid":"10084"}]},{"triggerid":"16052","description":"High swap space usage ( less than {$SWAP.PFREE.MIN.WARN}% free)","status":"0","value":"0","priority":"2","lastchange":"0","recovery_mode":"0","state":"1","hosts":[{"hostid":"10084"}]},{"triggerid":"16054","description":"{HOST.NAME} has been restarted (uptime < 10m)","status":"0","value":"0","priority":"2","lastchange":"0","recovery_mode":"0","state":"0","hosts":[{"hostid":"10084"}]},{"triggerid":"16060","description":"Configured max number of open filedescriptors is too low (< {$KERNEL.MAXFILES.MIN})","status":"0","value":"0","priority":"1","lastchange":"0","recovery_mode":"0","state":"0","hosts":[{"hostid":"10084"}]}]}
  }
}
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
        } else {
          res(null)
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
  if (!authKey) {
    authKey = await auth()
    if (!authKey) {
      return res.send(defalutData.getDeviceInfoByDevcieId)
    }
  }
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
    if (!authKey) {
      return res.send(defalutData.getDevices)
    }
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
    if (!authKey) {
      return res.send(defalutData.getDeviceInfoByDevcieId)
    }
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
    if (!authKey) {
      return res.send(defalutData.getHomePageInfo)
    }
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
