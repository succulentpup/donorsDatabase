import Log from '@dazn/lambda-powertools-logger';
import { APIGatewayProxyHandler } from 'aws-lambda';
import AWS from 'aws-sdk';
import { standardOutputSchema as outputSchema } from 'helpers/inputOrOuputSchemas/outputSchemas';
import { incomingEventLogger, onErrorHandler } from 'helpers/middleware';
import middy from 'middy';
import {
    cors,
    httpEventNormalizer,
    httpHeaderNormalizer,
    httpSecurityHeaders,
    validator,
} from 'middy/middlewares';
import status from 'statuses';

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const WHITE_SPACES = 2;
const { TABLE_NAME } = process.env;

export const queryDonationsOfUser: APIGatewayProxyHandler = async (event, _context) => {
    Log.debug('Dynamo table name', { TABLE_NAME });
    const { pk } = event.queryStringParameters as { pk: string; sk: string };
    const params = {
        ExpressionAttributeValues: {
            ':pk': pk,
        },
        ExpressionAttributeNames: {
            '#pk': 'pk',
        },
        KeyConditionExpression: '#pk = :pk',
        TableName: TABLE_NAME!,
    };
    const queryResult = await dynamoDB.query(params).promise();
    Log.debug('queryResult: ', { queryResult });
    return ({
        statusCode: status('OK') as number,
        body: JSON.stringify({
            message: JSON.stringify(queryResult.Items),
        }, null, WHITE_SPACES),
    });
};
// -----------------------------------------------------------------------------------//
// ----------------------------Middy middleware---------------------------------------//
// -----------------------------------------------------------------------------------//

const inputSchema = {
    type: 'object',
    properties: {
        queryStringParameters: {
            type: 'object',
            properties: {
                pk: { type: 'string', minLength: 10, pattern: '^\\+?[1-9]\\d{1,14}$' }, // this pattern can be improved
            },
            required: ['pk'],
            additionalProperties: false,
        },
    },
};

export const handler = middy(queryDonationsOfUser)
    .use(httpEventNormalizer()) // Normalizes HTTP events by adding an empty object for queryStringParameters and pathParameters if they are missing.
    .use(httpHeaderNormalizer()) // Normalizes HTTP header names to their canonical format.
    .use(validator({ inputSchema, outputSchema })) // validates the input
    .use(cors())
    .use(httpSecurityHeaders());

handler.before(incomingEventLogger);
handler.onError(onErrorHandler);
