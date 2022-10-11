import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getTodoItemsByUserID  } from '../../businessLogic/todos'

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]
    const items = await getTodoItemsByUserID(jwtToken);

    return {
      statusCode: 201,
      body: JSON.stringify({
        items
      })
    }
  })

handler.use(
  cors({
    credentials: true
  })
)
