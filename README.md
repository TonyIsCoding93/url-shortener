# URL Shortener

A serverless URL shortener built on AWS. Paste in a long link, get a short one back that sends you to the original.

![Demo](docs/demo.gif)

## What it does

You put a long URL into the frontend and it hands you back a short link. Click that link and it takes you to the original site. The backend is fully serverless, so there's no server sitting around costing money when nobody's using it.

## Architecture

    React frontend  ->  API Gateway  ->  Lambda  ->  DynamoDB

- Frontend: React, Vite
- API: AWS API Gateway (HTTP API)
- Compute: AWS Lambda (Node.js)
- Database: AWS DynamoDB
- AWS SDK for JavaScript v3

## How it works

Two Lambda functions, one for each direction.

Creating a short URL:

1. The frontend POSTs the long URL to API Gateway.
2. API Gateway triggers the createShortURL Lambda.
3. It generates a random 6 character code (base 36, about 2 billion possibilities) and writes the code and long URL to DynamoDB.
4. It sends the finished short URL back.

Redirecting:

1. Someone visits the short link, which hits API Gateway as a GET.
2. API Gateway triggers the redirectURL Lambda.
3. It pulls the code off the URL path and looks it up in DynamoDB.
4. If it finds a match it returns a 301 redirect to the original URL. If not, a 404.

DynamoDB is just a key value store here. The short code is the partition key and the long URL is what it maps to. A shortener is a pure key lookup so that fits well. No joins, no complicated queries.

## What I ran into

Getting my bearings in AWS was the hard part. There are a couple hundred services and none of it means anything until you've actually touched it. I got partway into spinning up an EC2 instance before I realized this project didn't need a server at all and Lambda was the right tool. What made it click was realizing I wasn't learning some separate AWS skill. I was writing JavaScript that uses AWS's SDK to wire a few services together into an API. Once I saw it that way it stopped feeling so big.

The SDK confused me for a while too. There's a DynamoDBClient, and then separate command objects like PutItemCommand and GetItemCommand, and I couldn't tell why they were split apart. It made sense once I got the pattern. The client is the thing that actually talks to DynamoDB and the commands just describe what you want done. You build a command and send it through the client.

Then there was learning JavaScript itself, mostly the async side of it. A call to DynamoDB doesn't give you the answer right away. It gives you a promise, and you have to await it before you can trust that the write or the read actually finished. That one took me a minute to really understand.

## What I'd do differently

I kept this simple on purpose, but I know where it's thin:

- Codes are random with no duplicate check, so a new one could overwrite an existing link. I'd put a condition on the write so it fails instead of overwriting, then retry with a new code.
- Math.random isn't secure. For anything real I'd use a proper generator.
- I used the low level DynamoDB client, which means writing the type tags like { S: value } by hand. The Document Client handles that for you.
- CORS is open to any origin right now. I'd lock it to my actual frontend.

## Running locally

The backend runs live on AWS. To run the frontend against it:

    npm install
    npm run dev

Then open the local URL Vite prints.
