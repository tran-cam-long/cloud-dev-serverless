import { TodosAccess } from '../dataLayer/todosAccess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'

const logger = createLogger('TodosAccess');
const attachmentUtils = new AttachmentUtils();
const todosAccess = new TodosAccess();

// Implement create todo feature
export async function createTodo(
    newTodo: CreateTodoRequest,
    userId: string
    ): Promise<TodoItem> {
  logger.info(`Start createTodo with request: ${newTodo}, userId: ${userId}`);

  const todoId = uuid.v4();
  const createdDate = new Date().toISOString();
  const s3AttachmentUrl = attachmentUtils.getAttachmentUrl(todoId)
  const newTodoItem = {
    userId,
    todoId,
    createdAt: createdDate,
    done: false,
    attachmentUrl: s3AttachmentUrl,
    ...newTodo
  }
  const createdTodo = await todosAccess.createTodoItem(newTodoItem);

  logger.info(`End createTodo with result: ${createdTodo}`);
  return createdTodo;
}