# Blockbuster

### Introduction

90's videoclub API rest using **nodejs**, **express**, **mongoose** and **mongodb**. It has been built using **MVC** pattern. Basic **CRUD** operations are implemented.

<img src="https://user-images.githubusercontent.com/65553496/113405929-e9226180-93aa-11eb-89a6-478d276f066b.png" width=100% height=100%>
<img src="https://user-images.githubusercontent.com/65553496/114618816-183daa80-9caa-11eb-9596-96a0fa127ffc.png" width=100% height=100%>
Some screenshots using Postman

### Setup :wrench:

Download or clone de repository. After that, run:

```
npm install
```

Database configuration is in config/connection_db.js file. Change as many parameters as neccessary.

After dependencies had been installed, run the seeds as follows:

```
npm run seed
```

### Main Endpoints

<details>
  <summary>Authentication</summary>
  
  ### Authentication :key:

Some Blockbuster's endpoints can be used without registration or token.

#### How to register?

`/signup` endpoint allows user to signup in the app. After this, the user will be able to get a token, gaining access to new app features.
To register, user should include in body request an `email` and a `username` as follows:

```json
{
  "username": "documentation",
  "email": "documentation@blockbuster.com",
  "password": "********"
}
```

Default user will have _user_ role. Users with _admin_ role can only be created using a user with admin role created previously. See below.

#### Getting a token

After registration, user will be able to obtain an individual token by accessing to `/auth` endpoint and adding `username` and `email` as in signin. This action should return something like:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRvY3VtZW50YXRpb24iLCJlbWFpbCI6ImRvY3VtZW50YXRpb25AYmxvY2tidXN0ZXIuY29tIiwiaWF0IjoxNjE3MTAwMjg0fQ.lBiH9zM3wdP4BgiFQxKOZcW43p4Tm3NySRwjy_ULjlc"
}
```

This token should be include in header request.

</details>

<details>
  <summary>Users</summary>
  
### Users :information_desk_person:

Everything regarding users is sited on `/user` endpoint.

#### POST /user/profile

Each user can show its profile information. Orders info is also include in this part.

```json
{
  "movieId": "605f5f08fecef891c1d656e5",
  "email": "documentation@blockbuster.com",
  "password": "********"
}
```

This POST will return something like:

```json
{
  "profile": {
    "_id": "606454921f916c4df21d3c44",
    "username": "documentation",
    "email": "documentation@blockbuster.com",
    "roleId": "605e3c2f27c76e28fd4ae7e8",
    "__v": 0
  },
  "orders": [
    {
      "_id": "606454fe1f916c4df21d3c45",
      "userId": "606454921f916c4df21d3c44",
      "movieId": "605f5f08fecef891c1d656e5",
      "startDate": "Wed Mar 31 2021 12:54:54 GMT+0200 (hora de verano de Europa central)",
      "endDate": "Sat Apr 03 2021 12:54:54 GMT+0200 (hora de verano de Europa central)",
      "__v": 0
    }
  ]
}
```

Each user can only display its own profile information.

#### POST /user/createUserAdmin

Only a admin user can create new admin users.

`http://localhost:3000/user/createUserAdmin`

Current admin user should include its user and email and the new user name and email as follows:

```json
{
  "username": "admin",
  "email": "admin@blockbuster.com",
  "password": "********",
  "newUserName": "newAdmin",
  "newUserEmail": "newAdmin@blockbuster",
  "newUserPassword": "********"
}
```

#### POST /user/createUser

This endpoint does the same that createUserAdmin, but it will create a new user with regular user role.

#### POST /user

This endpoint returns a list both regular and admin users currently in the database.

#### POST /user/[id]

This endpoints retrieves information about a specific user based on their id.

#### DELETE /user/[id]

This endpoint deletes from db a specific user based on its id.

</details>

<details>
  <summary>Movies</summary>
  
  ### Movies :vhs:

`/movie` endpoint can be used without registration and token.

#### GET /movie/

It returns a JSON object with all movies available in database. An example of the JSON object returned:

```json
{
  "_id": "605b64a9f0f9462918e51957",
  "title": "Blade Runner",
  "year": 1982,
  "available": true,
  "cast": ["Harrison Ford", "Sean Young", "Daryl Hannah", "Rutger Hauer"]
}
```

#### GET /movie/searchId/[id]

If you know the movie id, you can return the JSON object directly.

```
http://localhost:3000/movie/searchId/605b64a9f0f9462918e51957
```

#### GET /movie/searchTitle/[query]

You can perform search actions based on title.

```
http://localhost:3000/movie/searchTitle/matrix
```

It is possible to perform a search with more than one term:

```
http://localhost:3000/movie/searchTitle/matrix blade
```

However, search term will be considered individually. For instance, the results of search /matrix reloaded will not contain only _Matrix Reloaded_, but also _Matrix_ and _Matrix Revolutions_.

#### GET /movie/searchCast/[query]

You can perform search actions based on cast.

```
http://localhost:3000/movie/searchPerformer/ford
```

This search will return matches with "ford" in field cast.

It is possible to perform a search with more than one term (see searchTitle).

#### GET /movie/searchGenre/[query]

You can perform search actions based on cast.

```
http://localhost:3000/movie/searchPerformer/drama
```

It is possible to perform a search with more than one term (see searchTitle).

</details>

<details>
  <summary>Orders</summary>

### Orders :page_facing_up:

This endpoints groups everything related with orders.

#### POST /order/myOrders

This endpoint allows user to display its orders. User needs enter email and password.

#### POST /order/createOrder

To create an order, user must specify its email and the movieId of the movie he or she wants to rent:

```json
{
  "email": "documentation@blockbuster.com",
  "movieId": "605b654bf0f9462918e5196f",
  "password": "********"
}
```

If the order is created correctly, it will show order info:

```
"Order {\"userId\":\"606454921f916c4df21d3c44\",\"movieId\":\"605b654bf0f9462918e5196f\",\"startDate\":\"2021-04-01T10:26:46.603Z\",\"endDate\":\"2021-04-04T10:26:46.603Z\"} was created"
```

#### GET /order/listOrders

Admin users can see all list currently in the database thanks to this endpoint.

</details>

### Documentation :notebook_with_decorative_cover:

This project has documentation made with Swagger for some endpoints.
![swagger_screenshot](https://user-images.githubusercontent.com/65553496/117848961-20c2da00-b284-11eb-8409-4b6728e6b177.png)

### Tools :nut_and_bolt:

- [nodejs](https://nodejs.org/en/) - JavaScript runtime enviroment
- [express](http://expressjs.com/) - nodejs backend framework
- [mongodb](https://www.mongodb.com/) - database
- [mongoose](https://mongoosejs.com/) - object modelling tool
- [jwtoken](https://jwt.io/) - authentication
- [bcrypt](https://www.npmjs.com/package/bcrypt) - store the password in db
- [supertest](https://www.npmjs.com/package/supertest) - testing
- [swagger](https://swagger.io/) - documentation

### Tools used during app development

- [visual studio code](https://code.visualstudio.com/)
- [postman](https://www.postman.com/)
- [robo3t](https://robomongo.org/) - GUI for mongodb
- [compass](https://www.mongodb.com/products/compass) - GUI for mongodb

### Author :basketball:

Rubén Fernández Santos
