// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '758bfcat6k'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-t6xf9o72.us.auth0.com',            // Auth0 domain
  clientId: 'UhkhxK3Z2tU5Flb3iBXQGLdtOkjB6lTw',          // Auth0 client id
  callbackUrl: 'http://ae379a68e26c943699c660a9d35d8a36-1616005923.us-east-1.elb.amazonaws.com/callback'
}
