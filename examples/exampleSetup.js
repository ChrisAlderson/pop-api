// Import the necessary modules.
import { isMaster } from 'cluster'

// Import the content service for the controllers and the `intBase` helper
// function to setup your API.
import {
  ContentService,
  PopApi
} from '../src'

// Import the examples.
import {
  ExampleController,
  ExampleMiddleware,
  ExampleModel
} from '.'

// Import the name and version from your package.json for the Cli and Database
// middlewares.
import {
  name,
  version
} from '../package'

// Create a controllers array with the controllers to register.
const controllers = [{
  Controller: ExampleController,
  constructor: {
    service: new ContentService({
      Model: ExampleModel,
      itemType: 'example',
      projection: {
        name: 1
      },
      query: {}
    })
  }
}]

// `init` is a helper method to registers the built in middleware and
// returns the PopApi instance. You can also register the individual
// middlewares with more options.
PopApi.init({
  controllers,
  name,
  version
})

// Register the example middleware.
PopApi.use(ExampleMiddleware, {
  name: 'Chris'
})

// Server middleware uses the cluster module and forks the process.
// `isMaster` ensures the message only gets called once.
if (isMaster) {
  logger.error(PopApi.exampleMiddleware)
}