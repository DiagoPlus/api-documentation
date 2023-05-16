// Extract response
let repsonseData = pm.response.text()
const doc = xml2Json(repsonseData)
repsonseData = doc['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns1:ws_MESResponse']['String_O']['_']
const jsonData = JSON.parse(repsonseData)

// Visualize response
pm.visualizer.set('<pre>{{response}}</pre>', {
    response: JSON.stringify(jsonData, null, '  '),
});

// Validate response schema
const schemaRequest = {
    url: 'https://api.getpostman.com/apis/92dfe251-6ce5-4599-98ea-d6aa5b4b3ea0/schemas/4686933e-6bdf-4d06-9cd8-fe42cb791f28/files/diagoplus.json',
    method: 'GET',
    header: {
        'Accept': 'application/vnd.api.v10+json',
        'Content-Type': 'application/json',
        'x-api-key': 'PMAK-6450c8559957217d9c11a054-0224770a44c33c6b643f4e74bc88633632',
    }
}
pm.sendRequest(schemaRequest, (error, schemaResponse) => {
    const schema = JSON.parse(schemaResponse.json().content)
    const cmd = pm.request.headers.get('cmd')
    const responseSchema = schema.paths['/' + cmd].post.responses[200].content['application/json'].schema

    pm.test("Validate response schema", () => {
        tv4.addSchema("/", schema);
        const valid = tv4.validate(jsonData, responseSchema)
        if (!valid)
            console.log(tv4.error)
        pm.expect(valid).to.be.true;
    });
})