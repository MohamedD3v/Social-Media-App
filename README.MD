# Social Media App API

This is a backend for a Social Media Application built with Node.js and Express and TypeScript.

## Technologies Used

* Node.js
* TypeScript
* Express.js
* MongoDB (Mongoose)
* Zod Validation
* Helmet & Rate Limit & Cors
* Bcrypt
* NodeMailer
* JsonWebToken(JWT)

## APIS EndPoints

### 1. Auth Modules

* **POST** `api/v1/auth/signup` ==> Register a New User.
* **POST** `api/v1/auth/login` ==> Login User.
* **PATCH** `api/v1/auth/confirm-email` ==> confirmEmailOTP User.
