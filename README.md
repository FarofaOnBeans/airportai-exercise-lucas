# NodeJS Skeleton for Airport AI

This repository includes a NodeJS / Express / MongoDB skeleton app.

## Setup

### Requirements
Make sure you have MongoDB installed and running on your computer as well as NodeJS/NPM installed.

### Steps
On the root of this app, run the following command to install dependencies:
```
npm install
```

On the root of this app, run the following command to run the application:
```
npm start
```

If everything is ok, you should see a 'Hello world!' message when you go to 'http://localhost:3000' on your browser.

## Additional instructions for setup

To create an Agent, please send a a request to `localhost:3000/signup`


Example Request Body:
````json
{
    "email": "lucas.gomes@hotmail.com",
    "password": "Test1234*",
    "firstName": "Lucas",
    "lastName": "Gomes"
}
````

After a successful response, then you can login with your credentials and get your access token.

URL: (`localhost:3000/login`)

Request Body:
````json
{
    "email": "lucas.bsg@hotmail.com",
    "password": "Test1234*"
}
````

Response Body:
````json

{
  "result": {
      "agent": {
          "_id": "67488cde6508320f0f25dc70",
          "email": "lucas.gomes@hotmail.com",
          "firstName": "Lucas",
          "lastName": "Gomes",
          "__v": 0
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZ2VudCI6eyJfaWQiOiI2NzQ4OGNkZTY1MDgzMjBmMGYyNWRjNzAiLCJlbWFpbCI6Imx1Y2FzLmdvbWVzQGhvdG1haWwuY29tIiwiZmlyc3ROYW1lIjoiTHVjYXMiLCJsYXN0TmFtZSI6IkdvbWVzIiwiX192IjowfSwiaWF0IjoxNzMyODA3OTM1fQ.oPYTVZs6NulvZwvcOTaU6kbcWK0fsftSZvtRvv7MUIc"
  }
}
````

With the `token`, you can place it in the HTTP header `Authorization` with `Bearer ` as the prefix of the token.


Example:


 `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZ2VudCI6eyJfaWQiOiI2NzQ4OGNkZTY1MDgzMjBmMGYy...`

With this header, you will be able to create, edit and delete Products.



## Searching



