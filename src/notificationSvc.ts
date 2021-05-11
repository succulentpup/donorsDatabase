import Log from '@dazn/lambda-powertools-logger';
import { SNSHandler } from 'aws-lambda';
import AWS from 'aws-sdk';
import { safeJsonParse } from 'helpers/safeParse';

const sns = new AWS.SNS({ apiVersion: '2010-03-31' });

interface SnsMessageType {
    displayText: string;
    phoneNumber: string;
}

export const notificationSvc: SNSHandler =  async (event) => {
    Log.debug('event: ', { event });
    // tslint:disable-next-line:ban-ts-ignore
    // @ts-ignore
    const [err, parsedMessage]: [null, SnsMessageType] = safeJsonParse(event.Records[0].Sns.Message);
    if (err) {
        Log.error('Something went wrong in parsing received SNS event');
    } else {
        Log.debug('ParsedMessage: ', { parsedMessage });
        const messageParams = {
            Message: parsedMessage.displayText,
            PhoneNumber: parsedMessage.phoneNumber,
            Subject: 'Thanks',
        };
        await sns.publish(messageParams).promise();
        Log.debug('SMS has been sent');
    }
};

export const handler = notificationSvc;
