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
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'
Route.get("/posts/update/:id", "BlogController.showPost").as("update_post")
Route.get("/posts/:id", "BlogController.getOnePost").as("show_post")

Route.group(() => {
    Route.post("/posts/update/:id", "BlogController.update")

}).middleware('auth')
Route.get('/', "BlogController.index").as('home')
Route.get("/api", "BlogController.loadPosts").as("api")
Route.get('/user/register', 'AuthController.goRegister').as('register')
Route.get('/contact', 'ContactController.index').as('contact')
Route.get('/user/login', 'AuthController.goLogin').as('login')
Route.get('/create/post', 'BlogController.createPostPage').as('createPost')

//POST ROUTES 
Route.post('/user/register', 'AuthController.register')
Route.post('/logout', 'AuthController.logOut')
Route.post('/user/login',  'AuthController.login')