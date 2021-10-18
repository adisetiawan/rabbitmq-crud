# RabbitMQ Sample Producer & Consumer

Sample NodeJS project using RabbitMQ to interact with external API

* app.js is a main API
* consumer.js is consumer which listen and subscribe to queue

## Pre-requisites

* NodeJS
* RabbitMQ

## Installation

* clone repo
* `npm install`
* `cp env.example .env` and change value accordingly

## Running

* Run the consumer app before running main app `nodemon consumer.js`
* Run main app `nodemon app.js`

## Testing

`npm run test`