import Log from '@dazn/lambda-powertools-logger';
import got from 'got';

describe('Health end point functionality', () => {
    it('should return success response', async () => {
        const { body: { message } } = (await got('https://q0h298vynh.execute-api.eu-west-1.amazonaws.com/dev/donation/details?pk=user@eg.com', {
            responseType: 'json',
        })) as { body: { message: string } };
        // below log is not needed in reality
        Log.info('Response Message:' , { message });
        expect(message).toBeTruthy();
    });
});

describe('Health end point functionality', () => {
    it('should return 400 response', async () => { // queryString param pk is mandatory
        try {
            const { body: { message } } = (await got('https://q0h298vynh.execute-api.eu-west-1.amazonaws.com/dev/donation/details', {
                responseType: 'json',
            })) as { body: { message: string } };
            // below log is not needed in reality
            Log.info('Response Message:', { message });
            expect(message).toBeTruthy();
        } catch (e) {
            expect(e.statusCode).toBeFalsy();
        }
    });
});

describe('Health end point functionality', () => {
    it('should return 400 response', async () => { // queryString param pk is not in email format
        try {
            const { body: { message } } = (await got('https://q0h298vynh.execute-api.eu-west-1.amazonaws.com/dev/donation/details?pk=abc', {
                responseType: 'json',
            })) as { body: { message: string } };
            // below log is not needed in reality
            Log.info('Response Message:', { message });
            expect(message).toBeTruthy();
        } catch (e) {
            expect(e.statusCode).toBeFalsy();
        }
    });
});
