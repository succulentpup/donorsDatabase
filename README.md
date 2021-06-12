# donorsDatabase
This is a microservice that provides CRU APIs on donors database.
<br>
This microservice used serverless framework. Ref: https://www.serverless.com/.
At the high level it can be seen as a wrapper on top of cloudformation.

**How to Run:** <br>
It assumes that you've aws account and aws profile is configured in your machine.
<br>It also assumes node runtime is installed on your machine.
<br>Run the following commands in your terminal. 
1. $ npm install -g serverless
2. clone this repo
3. Navigate to the repo
4. $ yarn install
5. yarn deploy:dev --profile [yourAWSProfileName]

It will build and deploy the lambdas behind an API gateway.
<br> In the console you can see similar output as following 
<br>
_endpoints_:
<br>
_GET - https://[domainName]/dev/health_
<br>
_GET - https://[domainName]/dev/getAll_
<br>
_GET - https://[domainName]/dev/donation/details_
<br>
_POST - https://[domainName]/dev/donation_
<br>

Now use the above endpoints to use the app.
<br>
In the below example, I've used curl but any REST client can be used, for eg: postman, insomnia etc...
<br>
Call the below endpoint twice. Replace the domainName with the actual domain name and also use any suitable working phone number.
From the 2nd call, you'll receive the sms on the given phone number.
<br>
In realtime it may not be that affective to receive sms for each donation. This can be handled by understanding the business logic.
<br>
<br>
$ curl --request POST \
  --url https://[domainName]/dev/donation \
  --header 'content-type: application/json' \
  --data '{
	"pk": "+441234567890",
	"amount": 1
}
'
<br>
<br>
**NOTE:** after your testing is done, run the following command to remove the stack and the associated resources. It's a clean up activity.
<br>
$ sls --profile [profile] remove

Input validation of endpoints is done through middy middleware. It can be done at the API Gateway as well & that could save some money by rejecting the bad requests there itself.
In real time, number of bad requests can be expected to be less unless there is a DOS/DDOS.
<br>
Having the input validation in the source code can help us understand the API contracts by looking at one place and hence easier to troubleshoot.
I understand it's debatable, in my opinion the final call can depend on the complexity of application that we're implementing.

**TestCases:**
<br>
The set of test cases in this microservice repo are actually updating the DB.
<br>
This is not desirable in real time. Implemented this way just to showcase the usage of JEST framework and test cases.

_NOTE_: 
<br>
No recursive DB is performed to keep this assignment simple
<br>
If you want to run '$ yarn test', in each request replace the domain name with the correct domain
