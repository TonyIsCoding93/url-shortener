# URL Shortener

A serverless URL shortening application built on AWS.

## Tech Stack
- **Frontend:** React, Vite
- **Backend:** AWS Lambda, Node.js
- **Database:** AWS DynamoDB
- **API:** AWS API Gateway

## How It Works
1. User submits a long URL
2. API Gateway triggers the createShortURL Lambda
3. Lambda generates a short code and saves it to DynamoDB
4. User receives a short URL
5. Visiting the short URL triggers the redirectURL Lambda
6. Lambda looks up the short code in DynamoDB and redirects the user

## Architecture
React Frontend → API Gateway → Lambda → DynamoDB
