# Memofy

A FlashCards API Built with Nodejs and Expressjs

## Swagger Documentation

[here](https://memofyflashcards.herokuapp.com/api/v1/docs/)

## Quick Start

- Clone the repo
  ```
    git clone https://github.com/mohammed5420/flash-cards.git
  ```
- Install all needed dependencies
  ```
    cd flash-cards/
    npm install
  ```
- Create `.env` file with these variables

  ```
    APPLICATION_NAME=

    BASE_URI=http://localhost:3300/api/v1/

    CONNECTION_STRING=

    EMAIL_ADDRESS=

    SECRET_KEY=

    SENDGRID_HOST=

    SENDGRID_PASSWORD=

    SENDGRID_POST=

    SENDGRID_USERNAME=

    VERIFY_SECRET_KEY=
  ```

- Now run the project
  <!-- For Development -->

  ```
    npm run start:dev
  ```

  <!-- For Production -->

  ```
    npm run start:prod
  ```

## Features

- Full `CRUD` operations
- Email Messages
- Upload images for profile pictures
- Authentication and Authorization from scratch (Sign Up,Sign In, Email verification, Forget Password, Reset Password )
