import Log from '@dazn/lambda-powertools-logger';
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import AWS from 'aws-sdk';
import { standardOutputSchema as outputSchema } from 'helpers/inputOrOuputSchemas/outputSchemas';
import { incomingEventLogger, onErrorHandler } from 'helpers/middleware';
import middy from 'middy';
import {
    cors,
    httpEventNormalizer,
    httpHeaderNormalizer,
    httpSecurityHeaders, jsonBodyParser,
    validator,
} from 'middy/middlewares';
import status from 'statuses';

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();
const WHITE_SPACES = 2;
const {
    // tslint:disable-next-line:no-magic-numbers
    NOTIFICATION_SIZE = 2,
    SNS_TOPIC_DONATION_ARN,
    TABLE_NAME,
} = process.env;

interface Body {
    body: {
        pk: string;
        amount: string;
    };
}

export const addDonation: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent & Body, _context) => {
    Log.debug('Dynamo table name', { TABLE_NAME });
    Log.debug('SNS topic name', { SNS_TOPIC_DONATION_ARN });
    const { pk, amount } = event.body!;
    const params = {
        Item: {
            pk,
            date: new Date().toISOString(),
            amount,
        },
        TableName: TABLE_NAME!,
    };
    await dynamoDB.put(params).promise();
    const queryParams = {
        ExpressionAttributeValues: {
            ':pk': pk,
        },
        ExpressionAttributeNames: {
            '#pk': 'pk',
        },
        KeyConditionExpression: '#pk = :pk',
        TableName: TABLE_NAME!,
    };
    const queryResult = await dynamoDB.query(queryParams).promise();
    if (queryResult.Count! >= NOTIFICATION_SIZE) {
        // publish to the notification service
        // in this exercise we've just sending it another lambda in the same service
        // in reality I would like to have a dedicated service to take care of notifications
        // notification service can have dedicated email, sms, push notification templates etc..,
        Log.info('Sending a thank you note');
        const snsParams = {
            Message: JSON.stringify({
                displayText: `Thanks a lot for your helping hand`,
                phoneNumber: pk,
            }),
            TopicArn: SNS_TOPIC_DONATION_ARN,
        };
        const snsPublishResult = await sns.publish(snsParams).promise();
        Log.debug('snsPublishResult', { snsPublishResult });
    }

    return ({
        statusCode: status('OK') as number,
        body: JSON.stringify({
            message: 'Thanks for the donation',
        }, null, WHITE_SPACES),
    });
};
// -----------------------------------------------------------------------------------//
// ----------------------------Middy middleware---------------------------------------//
// -----------------------------------------------------------------------------------//

const inputSchema = {
    type: 'object',
    properties: {
        body: {
            type: 'object',
            properties: {
                pk: { type: 'string', minLength: 10, pattern: '^\\+?[1-9]\\d{1,14}$' }, // this pattern can be improved
                amount: { type: 'integer', minimum: 1 },
            },
            required: ['pk', 'amount'],
            additionalProperties: false,
        },
    },
};

export const handler = middy(addDonation)
    .use(httpEventNormalizer()) // Normalizes HTTP events by adding an empty object for queryStringParameters and pathParameters if they are missing.
    .use(httpHeaderNormalizer()) // Normalizes HTTP header names to their canonical format.
    .use(jsonBodyParser()) // Parses the request body to json object
    .use(validator({ inputSchema, outputSchema })) // validates the input
    .use(cors())
    .use(httpSecurityHeaders());

handler.before(incomingEventLogger);
handler.onError(onErrorHandler);
