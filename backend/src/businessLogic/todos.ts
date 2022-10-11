import { TodoAccess } from '../dataLayer/todosAcess'
// import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
import { parseUserId } from '../auth/utils'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'


// TODO: Implement businessLogic
const todosAccess = new TodoAccess()
export async function getTodoItemsByTodoID(todoId: string): Promise<TodoItem> {
    return todosAccess.getTodoItemsByTodoID(todoId)
}

export async function getTodoItemsByUserID(jwtToken: string): Promise<TodoItem[]> {
    const userId = parseUserId(jwtToken)
    return todosAccess.getTodoItemsByUserID(userId)
}

export async function createTodoItem(
    createTodoRequest: CreateTodoRequest,
    jwtToken: string
): Promise<TodoItem> {

    const todoId = uuid.v4()
    const userId = parseUserId(jwtToken)

    return await todosAccess.createTodoItem({
        todoId: todoId,
        userId: userId,
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        createdAt: new Date().toISOString(),
        done: false,
        attachmentUrl: ''
    })
}

export async function updateTodoItem(
    createTodoRequest: UpdateTodoRequest,
    todoID: string,
    jwtToken: string
): Promise<TodoItem> {

    const userId = parseUserId(jwtToken)
    return await todosAccess.updateTodoItem({
        todoId: todoID,
        userId: userId,
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        createdAt: '',
        done: createTodoRequest.done,
        attachmentUrl: ''
    })
}


export async function deleteTodoItem(
    todoID: string, jwtToken: string
) {
    const userId = parseUserId(jwtToken)
    return await todosAccess.deleteTodoItem(todoID, userId);
}
