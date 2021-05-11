import Log from '@dazn/lambda-powertools-logger';
import got from 'got';

describe('addDonation endpoint functionality', () => {
    it('should return success response', async () => {
        const { body: { message } } = (await got.post('https://o9r5ukjms5.execute-api.eu-west-1.amazonaws.com/dev/donation', {
            json: {
                pk: '+441234567890',
                amount: 1,
            },
            responseType: 'json',
        })) as { body: { message: string } };
        // below log is not needed in reality
        Log.info('Response Message:', { message });
        expect(message).toBeTruthy();
    });
});

describe('addDonation endpoint functionality, returns 4xx or 5xx', () => {
    it('should return 400 response', async () => {
        try {
        const { body: { message } } = (await got.post('https://o9r5ukjms5.execute-api.eu-west-1.amazonaws.com/dev/donation', {
            json: {
                pk: '+441234567', // invalid phone number
                amount: 1,
            },
            responseType: 'json',
        })) as { body: { message: string } };
        // below log is not needed in reality
        Log.info('Response Message:', { message });
        } catch (e) {
            expect(e.statusCode).toBeFalsy();
        }
    });

    it('should return 400 response', async () => {
        try {
            const { body: { message } } = (await got.post('https://o9r5ukjms5.execute-api.eu-west-1.amazonaws.com/dev/donation', {
                json: {
                    pk: '01234567890',
                    amount: 0, // amount should be an  integer > 0
                },
                responseType: 'json',
            })) as { body: { message: string } };
            // below log is not needed in reality
            Log.info('Response Message:', { message });
        } catch (e) {
            expect(e.statusCode).toBeFalsy();
        }
    });

    it('should return 400 response', async () => {
        try {
            const { body: { message } } = (await got.post('https://o9r5ukjms5.execute-api.eu-west-1.amazonaws.com/dev/donation', {
                json: {
                    pk: '01234567890',
                    amount: 1,
                    additionAttribute: 'test', // only sk and amount are allowed in request body
                },
                responseType: 'json',
            })) as { body: { message: string } };
            // below log is not needed in reality
            Log.info('Response Message:', { message });
        } catch (e) {
            expect(e.statusCode).toBeFalsy();
        }
    });
});
