# Bank

API REST of a bank. Still in process...

## Start the project

First you have to complete the sensitive data in the config folder such as the name of the DB, the connection to it, the port to run the server and the key for the JSON Web Token and then rename both files by removing the .example.

Please note that the development and test database aren't the same. For the tests to be more efficient, the database is completely deleted at the end. It is recommended to run the tests on a local database because connections to MongoDB usually take a long time.

After that, write these commands from the terminal at the root of the project:

```bash
yarn install

yarn tsc

yarn start
```

To run tests

```bash
yarn test [name of file]

yarn test register
```

## Endpoints

#### Users

-   [POST] /api/users/register ? firstname, lastname, email, password : The email must be unique and the password alphanumeric.

-   [POST] /api/users/login ? email, password

#### Accounts

-   [POST] /api/accounts/deposit ? cbu, amount : A logged user token is required
