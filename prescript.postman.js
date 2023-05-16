const cmd = pm.request.url.path[0]
const jsonPayload = {
    "cmd": cmd,
    "user":"",
    "UUID_User": pm.environment.get("UUID_User"),
    "OS":"Web"
}

pm.request.url.query.map((param) => {
    jsonPayload[param.key] = param.value
})

pm.request.url = pm.environment.get("BASE_URL")
pm.request.headers.clear()
pm.request.headers.add("SOAPAction: A_WebService#ws_MES")
pm.request.headers.add("cmd: " + cmd)

const soapPayload = `<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:def="http://www.4d.com/namespace/default"><soapenv:Header/><soapenv:Body><def:ws_MES soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><String_I xsi:type="xsd:string">${JSON.stringify(jsonPayload)}</String_I><Blob_I xsi:type="xsd:base64Binary"></Blob_I></def:ws_MES></soapenv:Body></soapenv:Envelope>`

pm.request.body.update({
    mode: 'raw',
    raw: soapPayload,
})