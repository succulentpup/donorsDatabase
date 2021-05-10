# donorsDatabase
This is a microservice that provides CRUD APIs on donors database.
This microservice has used serverless framework. Ref: https://www.serverless.com/ <br>
At the high level it can be seen as a wrapper on top of cloudformation.

**How to Run:** <br>
It assumes that you've aws account and profile is configured in your machine.
<br>It also assumes node is installed on your machine.
<br>Run the following commands in your terminal. 
1. $ npm install -g serverless
2. clone this repo
3. $ yarn install
4. yarn deploy:dev --profile <yourAWSProfileName>

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
_DELETE - https://[domainName]/dev/delete_
<br>

Now use the above endpoints to use the app.
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



