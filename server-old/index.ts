import './library/properties'
import Core from './core'
import api from './modules/api'
import app from './modules/app'
import mongoose from './modules/mongoose'

new Core()
  .use(api)
  .use(mongoose)
  .use(app)
  .mount()