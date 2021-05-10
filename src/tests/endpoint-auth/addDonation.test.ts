import Log from '@dazn/lambda-powertools-logger';
import got from 'got';

describe('addDonation endpoint functionality', () => {
    it('should return success response', async () => {
        const { body: { message } } = (await got.post('https://q0h298vynh.execute-api.eu-west-1.amazonaws.com/dev/donation', {
            json: {
                pk: 'ganesh@gmail.com',
                amount: 1,
            },
            responseType: 'json',
        })) as { body: { message: string } };
        // below log is not needed in reality
        Log.info('Response Message:', { message });
        expect(message).toBeTruthy();
    });
});

describe('addDonation endpoint functionality', () => {
    it('should return 400 response', async () => {
        try {
        const { body: { message } } = (await got.post('https://q0h298vynh.execute-api.eu-west-1.amazonaws.com/dev/donation', {
            json: {
                sk: 'ganesh@gmail.com', // invalid input, it should be pk, not sk
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
});

describe('addDonation endpoint functionality', () => {
    it('should return 400 response', async () => {
        try {
            const { body: { message } } = (await got.post('https://q0h298vynh.execute-api.eu-west-1.amazonaws.com/dev/donation', {
                json: {
                    sk: 'ganeshgmail.com', // invalid email
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
});

describe('addDonation endpoint functionality', () => {
    it('should return 400 response', async () => {
        try {
            const { body: { message } } = (await got.post('https://q0h298vynh.execute-api.eu-west-1.amazonaws.com/dev/donation', {
                json: {
                    sk: 'ganesh@gmail.com',
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
});

describe('addDonation endpoint functionality', () => {
    it('should return 400 response', async () => {
        try {
            const { body: { message } } = (await got.post('https://q0h298vynh.execute-api.eu-west-1.amazonaws.com/dev/donation', {
                json: {
                    sk: 'ganesh@gmail.com',
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
