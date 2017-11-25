# pop-api

[![Build Status](https://travis-ci.org/ChrisAlderson/pop-api.svg?branch=development)](https://travis-ci.org/ChrisAlderson/pop-api)
[![Coverage Status](https://coveralls.io/repos/github/ChrisAlderson/pop-api/badge.svg?branch=development)](https://coveralls.io/github/ChrisAlderson/pop-api?branch=development)
[![Dependency Status](https://david-dm.org/ChrisAlderson/pop-api.svg)](https://david-dm.org/ChrisAlderson/pop-api)
[![devDependencies Status](https://david-dm.org/ChrisAlderson/pop-api/dev-status.svg)](https://david-dm.org/ChrisAlderson/pop-api?type=dev)

**Warning:** this project is still unstable and there is no documentation for
it. Use it at your own risk.

## Features

The pop-api project aims to provide the core modules for the [`popcorn-api`](https://github.com/popcorn-official/popcorn-api)
project, but can also be used for other purposes by using middleware.
 - Cli middleware for reading user input with [`commander.js`](https://github.com/js/commander.js).
 - Database middleware for connection to MongoDb through [`mongoose`](https://github.com/Automattic/mongoose).
 - Logging of routes and other information using [`winston`](https://github.com/winstonjs/winston).
 - Uses [`express`](https://github.com/expressjs/express) under the hood with:
   - Body middleware
   - Error handling
   - Security middleware
 - Interface for registering routes for `express`.
 - DAL class for standard CRUD operations.
 - Route controller to handle routes for your content.

## Installation

```
 $ npm install --save pop-api
```

## Usage

### Basic setup

For your basic setup you have to create a controller which will handle the
routes. Your controller needs to extend from the `IController` interface to
implement the `registerRoutes` method which will be called during the setup.

The route controller below will be created with a constructor which takes an
object as the parameter. This example will register a `GET /hello` route and
sends a JSON object as a response with a greeting to the name provided by the
object from the constructor.

```js
// ./MyRouteController.js
import { IContentController } from 'pop-api'

// Extend your route controller from the 'IController' interface.
export default class MyRouteController extends IController {

  // The constructor takes an object as the parameter.
  constructor({name}) {
    super()

    this.name = name
  }

  // Implement the 'registerRoutes' method from the 'IController interface.
  registerRoutes(router, PopApi) {
    router.get('/hello', this.getHello.bind(this))
  }

  // Router middleware to execute on the 'GET /hello/' route.
  getHello(req, res, next) {
    const { name } = req.params
    return res.json({
      message: `Hello, ${this.name}`
    })
  }

}
```

To initialize the API we create an array of the route controllers and their
constructor arguments we want to register. Then we just call the `init` method
with the route controllers array, and the name and version your API (needed for
the Cli). The API should run by default on port `5000`.

```js
// ./index.js
import PopApi from 'pop-api'
import MyRouteController from './MyRouteController'
import { name, version } from './package.json'

(async () => {
  try {
    // Define the controllers you want to use.
    const controllers = [{
      Controller: MyRouteController,
      args: {
        key: 'value'
      }
    }]

    await PopApi.init({
      controllers,
      name,
      version
    })
    // Api is available on port 5000.
  } catch (err) {
    console.log(error)
  }
})()
```

### Advanced setup

**TODO:** Add example route controller with model, ContentService,
BaseContentController and 'init' method with more options.

## API

 - [Cli](#cli)
 - [Database](#database)
 - [HttServer](#httpserver)
 - [Logger](#logger)
 - [Routes](#routes)
 - [Custom Middleware](#custom-middleware)
 - [Extending Default Middleware](#extending-default-middleware)

### Cli

**TODO:** Document Cli constructor options and input options.

```js
import PopApi,  {
  Cli,
  Logger
} from 'pop-api'
import { name, version } from './package.json'

const cliOpts = {
  name,                  // The name of your application
  version,               // The version of your application
  argv: process.argv     // The arguments to parse
}
PopApi.use(Cli, cliOpts)

// Parsed the input given and binds options for the `Logger` middleware.
// See the documentation for the `Logger` middleware for more options.
const { pretty, quiet } = PopApi.loggerArgs
PopApi.use(Logger, {
  pretty,
  quiet
})
```

### Database

**TODO:** Document Database constructor options.

```
# .env
# (Optional) Assuming you use the `dotenv` modules to get your username and password
# for the database connection
DATABASE_USERNAME=myUsername
DATABASE_PASSWORD=myPassowrd
```

```js
// (Optional) Assuming you use the `dotenv` modules to get your username and password
// for the database connection
import 'dotenv/config'
import PopApi, { Database } from 'pop-api'
import { name } from './package.json'

const databaseOpts = {
  database: name,                             // The name of the database.
  hosts: ['localhost'],                       // A lst of hosts to connect to.
  port: 27017,                                // (Optional) The port of MongoDb.
  username: process.env.DATABASE_USERNAME,    // (Optional) The username to connect to the hosts.
  password: process.env.DATABASE_PASSWORD     // (Optional) The password to connect to the hosts.
}
PopApi.use(Database, databaseOpts)

// The database middleware can now be used to connect to the MongoDb database.
PopApi.database.connect()
  .then(() => {
   // Connection successful!  
  })
  .catch(err => {
    // Handle error
  })
```

### HttpServer

**TODO:** Document HttpServer constructor options.

```js
import PopApi, { HttpServer } from 'pop-api'

const httpServerOpts = {
  app: PopApi.app,    // The express instance from PopApi.
  port: 5000,         // The port your API will be running on.
  workers: 2          // The amount of workers to fork.
}
PopApi.use(HttpServer, httpServerOpts)
// Doesn't bind anything to the PopApi instance, just forks the workers and makes
// the app listen on your configured port.
```

### Logger

**TODO:** Document Logger constructor options.

```js
import PopApi, { Logger } from 'pop-api'
import { join } from 'path'
import { name } from './package.json'

const loggerOpts = {
  name,                                     // The name of the log file.
  logDir: join(...[__basedir, 'tmp']),      // The directory to store the logs in.
  pretty: true,                             // (Optional) Pretty output mode.
  quiet: false                              // (Optional) Quiet mode for no output.
}
PopApi.use(Logger, loggerOpts)

logger.info('\logger\' will be a global object')
// Other log levels you can use are:
//  - logger.debug()
//  - logger.info()
//  - logger.warn()
//  - logger.error()

// Log middleware for logging routes, used bt the `Routes` middleware, or set
// it yourself.
const { expressLogger } = PopApi
PopApi.app.use(expressLogger)
```

### Routes

**TODO:** Document Routes constructor options.

```js
import PopApi, { Routes } from 'pop-api'
import MyRouteController from './MyRouteController'

const routesOpts = {
  app: PopApi.app,                   // The express instance from PopApi.
  controllers: [{                    // A list of controllers to register.
    Controller: MyRouteController,   // The controller you want to register.
    args: {}                         // The arguments to pass down to the Controller.
  }]
}
PopApi.use(Routes, routesOpts)
// Doesn't bind anything to the PopApi instance, just configures the middleware
// for express.
```

### Custom Middleware

The `init` method will register the default Cli, Database, Logger, Routes and
Server middleware, but you can also extends the functionality of `pop-api` by
using your own middleware. In the middleware example below we create a
middleware class which will only hold a simple greeting.

```js
// ./MyMiddleware.js
export default class MyMiddleware {

  // The first parameter will be the 'PopApi' instance, the second will be an
  // object you can use to configure your middleware.
  constructor(PopApi, {name}) {
    this.name = name

    PopApi.myMiddleware = this.myMiddleware()
  }

  myMiddleware() {
    return `Hello, ${this.name}`
  }

}
```

To use the middleware we created you call the `use` method. The first parameter
will be the middleware class you want to create, the second parameter is
optional, but can be used to configure your middleware.

```js
// ./index.js
import PopApi from 'pop-api'
import MyMiddleware from './MyMiddleware'

// Use the middleware you created.
PopApi.use(MyMiddleware, {
  name: 'John'
})

// The middleware will be bound to the 'PopApi' instance.
const greeting = PopApi.myMiddleware // Hello, John
```

## License

MIT License

Copyright (c) 2017 - pop-api - Released under the [MIT license](LICENSE.txt).

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
