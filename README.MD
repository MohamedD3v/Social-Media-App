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
* AWS S3

## APIS EndPoints

### 1. Auth Modules

* **POST** `api/v1/auth/signup` ==> Register a New User.
* **POST** `api/v1/auth/login` ==> Login User.
* **PATCH** `api/v1/auth/confirm-email` ==> confirmEmailOTP User.


### 2. User Modules

* **GET** `api/v1/user/profile` ==> Get Profile Info.
* **POST** `api/v1/user/logout` ==> logout from Only or All Devices.
* **POST** `api/v1/user/refresh-token` ==> Get new AccessToken from RefreshToken.
* **PATCH** `api/v1/user/profile-image` ==> Upload Profile Image.
* **PATCH** `api/v1/user/cover-images` ==> Upload Cover Images.




## How to Run
1. Clone the repo
2. Run npm install
3. Create a .env file like(.env.example)
4. Run npm start:dev