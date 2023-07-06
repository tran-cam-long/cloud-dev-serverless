import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
// import { TodoUpdate } from '../models/TodoUpdate';
// import { totalmem } from 'os'

var AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS);

const logger = createLogger('TodosAccess');

export class TodosAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly todosIndex = process.env.INDEX_NAME
    ) {}

    async getAllTodos(userId: string): Promise<TodoItem[]> {
        logger.info(`Start getAllTodos with userId: ${userId}`);

        const result = await this.docClient.query({
            TableName: this.todosTable,
            IndexName: this.todosIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                'userId': userId
            }
        }).promise();

        const items = result.Items;
        logger.info(`End getAllTodos with result: ${items}`);
        return items as TodoItem[];
    }

    async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {
        logger.info(`Start createTodoItem with todoItem: ${todoItem}`);

        const result = await this.docClient.put({
            TableName: this.todosTable,
            Item: todoItem
        }).promise();

        logger.info(`End createTodoItem with result: ${result}`);
        return todoItem;
    }

    async updateTodoItem(todoId: string, userId: string, todoUpdate: TodoUpdate): Promise<TodoUpdate> {
        logger.info(`Start updateTodoItem with todoId: ${todoId}, userId: ${userId}, todoUpdate: ${todoUpdate}`);

        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                userId: userId,
                todoId: todoId
            },
            UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
            ExpressionAttributeValues: {
                ':name': todoUpdate.name,
                ':dueDate': todoUpdate.dueDate,
                ':done': todoUpdate.done
            },
            ExpressionAttributeNames: {
                '#name': 'name'
            }
        }).promise();

        logger.info(`End updateTodoItem with result: ${todoUpdate}`);
        return todoUpdate;
    }

    async deleteTodoItem(todoId: string, userId: string): Promise<void> {
        logger.info(`Start deleteTodoItem with result: ${todoId}, userId: ${userId}`);

        await this.docClient.delete({
            TableName: this.todosTable,
            Key: {
                userId: userId,
                todoId: todoId
            }
        }).promise();

        logger.info(`End deleteTodoItem with result: ${todoId}, userId: ${userId}`);
    }

    async updateTodoAttachmentUrl(todoId: string, userId: string, attachmentUrl: string): Promise<void> {
        logger.info(`Start updateTodoAttachmentUrl with todoId: ${todoId}, userId: ${userId}, attachmentUrl: ${attachmentUrl}`);

        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                userId: userId,
                todoId: todoId
            },
            UpdateExpression: 'attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
                ':attachmentUrl': attachmentUrl
            }
        }).promise();

        logger.info(`End updateTodoAttachmentUrl with todoId: ${todoId}, userId: ${userId}, attachmentUrl: ${attachmentUrl}`);
    }
}