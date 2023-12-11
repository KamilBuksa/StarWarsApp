# Star Wars App 

## Application Description

#### Star Wars-Themed Features:
- **In Memory Cache**
  - *Performance Optimization*: Fast, temporary data storage for enhanced application speed.
- **Swagger Documentation with Authentication**
  - *Secured API Navigation*: Default admin credentials (username and password: admin) for accessing detailed API documentation.
- **Paginated Lists and Details**
  - *Efficient Data Presentation*: Species, films, vehicles, starships, and planets are presented in paginated lists with detailed views. Includes an endpoint for the most frequently appearing character in the opening credits.

#### Additional Functionalities:
- **Multilingual Error Handling**
  - *Global User Engagement*: Supports multiple languages for error messages.
- **Multilingual Mailing Support**
  - *Diverse Communication*: Capability for sending emails in various languages.
- **Registration Process with Email Verification**
  - *Secure User Onboarding*: Registration complemented by email verification for security.
- **JWT Authentication**
  - *Secure Authentication*: JSON Web Tokens used for a secure login process.
- **Password Reminder**
  - *User Convenience*: Feature to assist users in recalling their passwords.
- **Password Reset**
  - *Account Security*: Allows users to securely reset their passwords.
- **Serving Static Files in Emails**
  - *Enhanced Email Experience*: Incorporates static files in emails for a more interactive experience.
- **Cron Job for Deleting Old, Unassigned Images**
  - *Automated Maintenance*: Regular cleanup of old and unassociated images in the system.
- **Image CDN**
  - *Efficient Image Delivery*: Uses a Content Delivery Network for faster and more reliable image handling.

## Important -> Environment File Setup
- **Rename `demo.env` to `.env`**
  - Before running the application, make sure to rename the `demo.env` file to `.env`. This file contains important environment variables necessary for the application's configuration and proper functioning.



## Before Installation
```bash
$ docker-compose build
$ docker-compose up
```


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start 
$ npm run start:dev 
```


## Important Configuration Note

#### TypeORM Synchronization Issue
- **Initial Setup**: When running the application for the first time, set `NEST_SYNCHRONIZE` in the `.env` file to `true`. This will allow TypeORM to properly synchronize and create entities in the Docker container.
- **Post-Initialization**: Once the entities have been successfully created in Docker, change `NEST_SYNCHRONIZE` in the `.env` file to `false`. This is important to prevent unintended database alterations during subsequent application starts.

Failure to change `NEST_SYNCHRONIZE` back to `false` may lead to potential data inconsistencies or loss.


## Swagger Documentation Access

#### Access Details
- **Default Password for Swagger**: The default password to access the Swagger UI is set to "admin".
- **Swagger UI Link**: To access the Swagger UI, use the following link: [SWAGGER](http://localhost:3000/api/doc/)
- **Swagger JSON Documentation Link**: For the Swagger JSON documentation, visit: [SWAGGER-JSON](http://localhost:3000/api/doc-json/)



## Test

```bash
# unit tests
$ npm run test

```


