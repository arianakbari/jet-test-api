# JET Game of three test

This app consist of three endpoint `/join`, `/make-move`, `/subscribe`!

![Class Digram](/doc/diagram.drawio.png)

The entire domain layer is organized into the `domain` folder. It has no dependency on any specific framework.
This app uses `Express.js` as a web framework. `PostgreSQL` used as a database and `Redis` as a cache. Most of the
communications in this project uses `REST API` but for the real time communication, I considered using a service 
called `Pusher`. It is way easier to use in comparison to other solutions like `WebSocket` or `SSE`.

I enjoyed using [inversify](https://github.com/inversify/InversifyJS) as an IoC container. 

For running this app locally, first run `pnpm env:copy`, set the required environment variables, then run `docker-compose up --build`.

This app also uses Github actions for CI/CD. There are simple workflows configured to demonstrate the concept. There is a deployed and up and running
version of this [app](https://jet-test-api.liara.run). I developed a simple client using `Vue.js` located in this [repo](https://github.com/arianakbari/jet-test-client). This app uses
Github Actions too and live version of it, is accessible [here](https://jet-test.liara.run).

Also swagger API documentation is configured and accessible [here](https://jet-test-api.liara.run).

