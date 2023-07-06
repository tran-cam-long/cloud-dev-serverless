import { TodosAccess } from '../dataLayer/todosAccess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
// import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
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