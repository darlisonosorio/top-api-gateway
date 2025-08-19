### TOP-API-GATEWAY

## Description

A [Nest](https://github.com/nestjs/nest) API-Gateway Application 
that integrates Top-Users and Top-Finance, and includes Authentication


## Prerequisites

Before starting, make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (version 18.x or higher)
- [pnpm](https://pnpm.io/) or [npm](https://www.npmjs.com/)


## Environment Variables

This project requires some environment variables to be configured.  
You can create a `.env` file in the root directory with the following content:

```env
TOP_USERS_URL=localhost
TOP_USERS_PORT=8888
TOP_FINANCE_URL=localhost
TOP_FINANCE_PORT=8889
SECRET_KEY=a7b8c2e1f93d4a5b76e89c0f12d3a456b7c8e9d0123f45a67890bcdef1234567
```

## Project setup

```bash
$ pnpm install
```

## Compile and run

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# e2e tests
$ pnpm run test:e2e
```

