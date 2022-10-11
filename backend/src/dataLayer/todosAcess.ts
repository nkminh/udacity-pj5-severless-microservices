import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
// import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)
const bucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration : number = +process.env.SIGNED_URL_EXPIRATION

const s3 = new XAWS.S3({
    signatureVersion: 'v4'
  })

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
export class TodoAccess {

    constructor(
      private readonly docClient: DocumentClient = createDynamoDBClient(),
      private readonly todoItemsTable = process.env.TODOS_TABLE) {
    }



    async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {
      logger.info("Start Func createTodoItem")
      await this.docClient.put({
        TableName: this.todoItemsTable,
        Item: todoItem
      }).promise()

      return todoItem
    }

    async deleteTodoItem(todoId: string, userId: string) {
      logger.info("Start Func deleteTodoItem")
      // let deleteItem :DeleteItemInput;
      // deleteItem.TableName =  this.todoItemsTable;
      // deleteItem.Key = {'todoId': todoId}
      var params = {
        Key: {
          todoId: todoId,
          userId: userId
        },
        TableName: this.todoItemsTable
      };
      const response = await this.docClient.delete(params).promise()
      return response
    }

    async getTodoItemsByUserID(userID: string): Promise<TodoItem[]> {
      logger.info("Start Func getTodoItemsByUserID")
        const result = await this.docClient.query({
          TableName: this.todoItemsTable,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
            ':userId': userID
          },
          ScanIndexForward: false
        }).promise()

        const items = result.Items
        return items as TodoItem[]
    }
    async getTodoItemsByTodoID(todoId: string): Promise<TodoItem> {
      const result = await this.docClient.query({
        TableName: this.todoItemsTable,
        KeyConditionExpression: 'todoId = :todoId',
        ExpressionAttributeValues: {
          ':todoId': todoId
        },
        ScanIndexForward: false
      }).promise()

      const items = result.Items
      return items[0] as TodoItem
    }


    async updateTodoItem(todoItem: TodoItem): Promise<TodoItem> {
         // Set the parameters.
        const params = {
            TableName: this.todoItemsTable,
            Key: {
                todoId: todoItem.todoId,
                userId: todoItem.userId
            },
            // ProjectionExpression: "#r",
            // ExpressionAttributeNames: { "#r": "rank" },
            ExpressionAttributeNames: {
              '#name': 'name'
            },
            UpdateExpression: "set #name = :name, dueDate = :dueDate, done = :done, attachmentUrl = :attachmentUrl ",
            ExpressionAttributeValues: {
                ":name": todoItem.name,
                ":dueDate": todoItem.dueDate,
                ":done": todoItem.done,
                ":attachmentUrl": (todoItem.attachmentUrl || '')
            },
        };
        try {
            const data = await this.docClient.update(params).promise();
            console.log("Success - item added or updated", data);
            return;
        } catch (err) {
            console.log("Error", err);
        }
    }

    async uploadImage(todoId: string, userId: string, imageId: string): Promise<string> {

      const imageUrl = `https://${bucketName}.s3.amazonaws.com/${imageId}`
      // update url to dynamodb
      const params = {
        TableName: this.todoItemsTable,
        Key: {
            todoId: todoId,
            userId: userId
        },
        UpdateExpression: "set attachmentUrl = :attachmentUrl ",
        ExpressionAttributeValues: {
            ":attachmentUrl": imageUrl
        },
      };
      await this.docClient.update(params).promise();

      const baseUrl = s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: imageId,
        Expires: urlExpiration
      })

      return baseUrl
    }

}

function createDynamoDBClient() {
    // if (process.env.IS_OFFLINE) {
    //   console.log('Creating a local DynamoDB instance')
    //   return new XAWS.DynamoDB.DocumentClient({
    //     region: 'localhost',
    //     endpoint: 'http://localhost:8000'
    //   })
    // }

    return new XAWS.DynamoDB.DocumentClient()
}
