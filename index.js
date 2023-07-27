const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios')
const functionCode = core.getInput('function-code')
const functionName = core.getInput('function-name')
const functionID = core.getInput('function-id')
const token = core.getInput('token')
const functionType = core.getInput('function-type').toUpperCase()

async function main() {
    // Appends the Auth Header to all Axios requests.
    axios.interceptors.request.use(function (config) {
        config.headers.Authorization = `Bearer ${token}`;

        return config;
    });

    const bodyParams = {
        code: functionCode,
        display_name: functionName,
        resourceType: functionType,
    }

    let res;

    // If no function ID, just create the function.
    if (!functionID) {
        res = await axios.post(`https://api.segmentapis.com/functions`, bodyParams);
    } else {
        res = await axios.patch(`https://api.segmentapis.com/functions/${functionID}`, bodyParams);
    }

    return res.data;
}

main()
    .then((body) => console.log(`Created or Updated Function with ID: ${body?.data?.function?.id} succesfully!`))
    .catch(err => core.setFailed(err.message));
