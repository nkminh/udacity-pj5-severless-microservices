import { parseUserId } from '../auth/utils'
import { TodoAccess } from '../dataLayer/todosAcess'
import * as uuid from 'uuid'

// TODO: Implement the fileStogare logic
// const todoTable = process.env.TODOS_TABLE
const todoAccess = new TodoAccess();
export async function getUploadUrl(todoId: string, jwtToken: string) {
    const userId = parseUserId(jwtToken)
    const imageId = uuid.v4()
    return await todoAccess.uploadImage(todoId, userId, imageId)

}
