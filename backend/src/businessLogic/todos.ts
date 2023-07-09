import { TodosAccess } from '../dataLayer/todosAccess'
import { AttachmentUtils } from '../helpers/attachmentUtils'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
// import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { TodoUpdate } from '../models/TodoUpdate'
// import * as createError from 'http-errors'

const logger = createLogger('TodosAccess');
const attachmentUtils = new AttachmentUtils();
const todosAccess = new TodosAccess();

// Implement create todos feature
export async function createTodo(
    newTodo: CreateTodoRequest,
    userId: string
    ): Promise<TodoItem> {
  logger.info(`Start createTodo with request: ${newTodo}, userId: ${userId}`);

  const todoId = uuid.v4();
  const createdAt = new Date().toISOString();
  const s3AttachmentUrl = attachmentUtils.getAttachmentUrl(todoId)
  const newTodoItem = {
    userId,
    todoId,
    createdAt: createdAt,
    done: false,
    attachmentUrl: s3AttachmentUrl,
    ...newTodo
  }
  const createdTodo = await todosAccess.createTodoItem(newTodoItem);

  logger.info(`End createTodo with result: ${createdTodo}`);
  return createdTodo;
}

// Implement get todos feature
export async function getAllTodos(userId: string): Promise<TodoItem[]> {
  logger.info(`Start getAllTodos with userId: ${userId}`);

  const todosList = await todosAccess.getAllTodos(userId);

  logger.info(`End getAllTodos with userId: ${userId}`);
  return todosList;
}

// Implement update todos feature
export async function updateTodo(updateTodo: UpdateTodoRequest, todoId: string, userId: string): Promise<TodoUpdate> {
  return await todosAccess.updateTodoItem(todoId, userId, updateTodo);
}

// Implement delete todos feature
export async function deleteTodo(todoId: string, userId: string): Promise<void>{
  return await todosAccess.deleteTodoItem(todoId, userId);
}

// Implement attachment feature
export async function createAttachmentPresignedUrl(todoId: string, userId: string): Promise<string> {
  logger.info("Start createAttachmentPresignedUrl with userId: ", userId);
  return attachmentUtils.getUploadUrl(todoId);
}