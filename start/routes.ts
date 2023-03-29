/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/register', 'UserController.register')
  Route.post('/login', 'UserController.login')
  Route.get('/user', 'UserController.getTokenUser')

  Route.group(() => {
    Route.group(() => {
      Route.get('/logout', 'UserController.logout')
      Route.get('/user/:id', 'UserController.getUser').where('id', /^[0-9]+$/)
    }).middleware('auth')
  })
}).prefix('api/v1')
