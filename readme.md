# NodeJS Project (User-Admin API)

Node.js assignment incorporates user authentication, role-based access control, and secure APIs. It features functionalities like user management, admin capabilities, and ensures data integrity through data validation, utilizing Express.js and offering a choice between MongoDB or Firebase as the database storing images on cloudinary and accessing form data using multer.

### Authentication and Security

- [x] **Authentication:**
  - [x] Implement an authentication system using **JSON Web Tokens (JWT)**.
- [x] **Password Encryption:**
  - [x] Use **bcrypt** to securely encrypt user passwords.

### Image Storage

- [x] **Profile Image:**
  - [x] Save profile images using **Cloudinary** for handling form data with **Multer**.
  - [x] Ensure that image URLs work, at least in the local environment.

# Getting Started

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Amit-Singh-14/Nodejs-User-Admin-API.git
   ```

2. Install dependencies

   ```
   npm install
   ```

3. **Important: Create .env file with refrence to .env.sample**

   ```
   (Add all secret, keys, names based on .env.sample)
   ```

4. Run to Start server
   ```
   npm run dev
   ```

## Endpoints User

### 1. Register User

- Method: POST
- Request Body : {name : required, email: required, phone: required, password: required}

```
Path: http://localhost:8000/api/v1/users/register
```

- response :

```
{
    "statusCode": 200,
    "data": {
        "_id": "659a877dc8cc5427e57738fb",
        "name": "user1",
        "email": "a@b.com",
        "phone": 1234567890,
       "profileimage": "http://res.cloudinary.com/dwww26uau/image/upload/v1704627639/gv3xei8y5tg3f1rlbz0e.jpg",        "role": "user",
        "createdAt": "2024-01-07T11:14:05.397Z",
        "updatedAt": "2024-01-07T11:14:05.397Z",
        "__v": 0
    },
    "message": "User registered Successfully",
    "success": true
}
```

### 2. Login User

- Method: POST
- Request Body : {email |or| phone : required, password : required}

```
Path: http://localhost:8000/api/v1/users/login
```

- response :

```
{
    "statusCode": 200,
    "data": {
        "user": {
            "_id": "659a877dc8cc5427e57738fb",
            "name": "user1",
            "email": "a@b.com",
            "phone": 1234567890,
           "profileimage": "http://res.cloudinary.com/dwww26uau/image/upload/v1704627639/gv3xei8y5tg3f1rlbz0e.jpg",            "role": "user",
            "createdAt": "2024-01-07T11:14:05.397Z",
            "updatedAt": "2024-01-07T11:15:22.966Z",
            "__v": 0
        },
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTlhODc3ZGM4Y2M1NDI3ZTU3NzM4ZmIiLCJpYXQiOjE3MDQ2MjYxMjIsImV4cCI6MTcwNDcxMjUyMn0.Unzy_2cry5WUK24iRDF2TvD5FyUJvC6268mMHerhf7w"
    },
    "message": "User LoggedIn Successfully",
    "success": true
}
```

# Authenticated Routes for Users only (Logged In)

### 3. Logout User

- Method: POST

```
Path: http://localhost:8000/api/v1/users/logout
```

- response :

```
{
    "statusCode": 200,
    "data": {},
    "message": "User Logged Out",
    "success": true
}
```

### 4. update Account Details

- Method: PATCH
- Request Body : {name |or| profileimage : required}

```
Path: http://localhost:8000/api/v1/users/updateuserdetails
```

- response :

```
{
    "statusCode": 200,
    "data": {
        "_id": "659a877dc8cc5427e57738fb",
        "name": "user1updated",
        "email": "a@b.com",
        "phone": 1234567890,
       "profileimage": "http://res.cloudinary.com/dwww26uau/image/upload/v1704627639/gv3xei8y5tg3f1rlbz0e.jpg",        "role": "user",
        "createdAt": "2024-01-07T11:14:05.397Z",
        "updatedAt": "2024-01-07T11:18:41.465Z",
        "__v": 0
    },
    "message": "account details updated Successfully",
    "success": true
}
```

### 5. delete user

- Method: DELETE
- Request Body: {password : required} // verification

```
Path: http://localhost:8000/api/v1/users/deleteuser
```

- response :

```
{
    "statusCode": 200,
    "data": {},
    "message": "User deleted Successfully",
    "success": true
}
```

## Endpoints Admin

### 1. Register New Admin

- Method: POST
- Request Body : {name : required, email: required, phone: required, password: required}

```
Path: http://localhost:8000/api/v1/admins/registernewadmin
```

- response :

```
{
    "statusCode": 200,
    "data": {
        "_id": "659a89c83c4c6e43224b1a40",
        "name": "admin1",
        "email": "admin1@a.com",
        "phone": 987654322,
       "profileimage": "http://res.cloudinary.com/dwww26uau/image/upload/v1704627639/gv3xei8y5tg3f1rlbz0e.jpg",        "role": "admin",
        "createdAt": "2024-01-07T11:23:52.878Z",
        "updatedAt": "2024-01-07T11:23:52.878Z",
        "__v": 0
    },
    "message": "Admin registered Successfully",
    "success": true
}
```

### 2. Login Admin

- Method: POST
- Request Body : {email |or| phone : required, password : required}

```
Path: http://localhost:8000/api/v1/admins/loginadmin
```

- response :

```
{
    "statusCode": 200,
    "data": {
        "admin": {
            "_id": "659a89c83c4c6e43224b1a40",
            "name": "admin1",
            "email": "admin1@a.com",
            "phone": 987654322,
           "profileimage": "http://res.cloudinary.com/dwww26uau/image/upload/v1704627639/gv3xei8y5tg3f1rlbz0e.jpg",
            "role": "admin",
            "createdAt": "2024-01-07T11:23:52.878Z",
            "updatedAt": "2024-01-07T11:25:26.981Z",
            "__v": 0
        },
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTlhODljODNjNGM2ZTQzMjI0YjFhNDAiLCJpYXQiOjE3MDQ2MjY3MjYsImV4cCI6MTcwNDcxMzEyNn0.AmuUc3A_xEa2-5QAgBcbZkjV_hB8y04Gb-_WTJOpxT4"
    },
    "message": "Admin LoggedIn Successfully",
    "success": true
}
```

# Authenticated Routes for Admin only (Logged In)

### 3. Logout User

- Method: POST

```
Path: http://localhost:8000/api/v1/admins/logoutadmin
```

- response :

```
{
    "statusCode": 200,
    "data": {},
    "message": "Admin Logged Out",
    "success": true
}
```

### 4. Get All Users

- method: GET

```
Path: http://localhost:8000/api/v1/admins/getallusers
```

- response :

```
{
    "statusCode": 200,
    "data": [
        {
            "_id": "659a75ac944e8fec618b5a4c",
            "name": "amit",
            "email": "admin@a.com",
            "phone": 987654321,
           "profileimage": "http://res.cloudinary.com/dwww26uau/image/upload/v1704627639/gv3xei8y5tg3f1rlbz0e.jpg",
            "role": "admin",
            "createdAt": "2024-01-07T09:58:04.844Z",
            "updatedAt": "2024-01-07T10:19:24.528Z",
            "__v": 0
        },
        {
            "_id": "659a89c83c4c6e43224b1a40",
            "name": "admin1",
            "email": "admin1@a.com",
            "phone": 987654322,
           "profileimage": "http://res.cloudinary.com/dwww26uau/image/upload/v1704627639/gv3xei8y5tg3f1rlbz0e.jpg",
            "role": "admin",
            "createdAt": "2024-01-07T11:23:52.878Z",
            "updatedAt": "2024-01-07T11:25:26.981Z",
            "__v": 0
        }
    ],
    "message": "Successfully retrived all users.",
    "success": true
}
```

### 5. update User Role

- Method: PATCH
- Request Params: {userid}

```
Path: http://localhost:8000/api/v1/admins/updateuserrole/:userid
```

- response :

```
{
    "statusCode": 200,
    "data": {
        "_id": "659a75ac944e8fec618b5a4c",
        "name": "amit",
        "email": "admin@a.com",
        "phone": 987654321,
       "profileimage": "http://res.cloudinary.com/dwww26uau/image/upload/v1704627639/gv3xei8y5tg3f1rlbz0e.jpg",
        "role": "user",
        "createdAt": "2024-01-07T09:58:04.844Z",
        "updatedAt": "2024-01-07T11:30:54.877Z",
        "__v": 0
    },
    "message": "Successfully updated user role.",
    "success": true
}
```

### 5. Delete Single User

- Method: DELETE
- Request Params: {userid}

```
Path: http://localhost:8000/api/v1/admins/deletesingleuser/:userid
```

- response :

```
{
    "statusCode": 200,
    "data": {},
    "message": "Successfully deleted user role.",
    "success": true
}
```

### 5. Delete All User

- Method: DELETE
- Request Body: {password : required} // confirmation

```
Path: http://localhost:8000/api/v1/admins/deletealluser
```

- response :

```
{
    "statusCode": 200,
    "data": {},
    "message": "Successfully deleted all user.",
    "success": true
}
```
