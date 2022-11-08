import './library/properties'
import Core from './core'
import app from './modules/app'

Core
  .new()
  .use(app)
  .mount()