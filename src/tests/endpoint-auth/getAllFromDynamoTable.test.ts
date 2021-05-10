import Log from '@dazn/lambda-powertools-logger';
import got from 'got';

describe('Health end point functionality', () => {
    it('should return success response', async () => {
        const { body: { message } } = (await got('https://q0h298vynh.execute-api.eu-west-1.amazonaws.com/dev/getAll', {
            responseType: 'json',
        })) as { body: { message: string } };
        // below log is not needed in reality
        Log.info('Response Message:' , { message });
        expect(message).toBeTruthy();
    });
});
