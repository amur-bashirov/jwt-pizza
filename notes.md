# Learning notes

## JWT Pizza code study and debugging

As part of `Deliverable ⓵ Development deployment: JWT Pizza`, start up the application and debug through the code until you understand how it works. During the learning process fill out the following required pieces of information in order to demonstrate that you have successfully completed the deliverable.

| User activity                                       | Frontend component | Backend endpoints | Database SQL |
| --------------------------------------------------- | ------------------ | ----------------- | ------------ |
| View home page                                      | Home.jsx                   |   None                |    None       |
| Register new user<br/>(t@jwt.com, pw: test)         |   Register.jsx             |          POST   /api/auth/register   |      INSERT into users (email,password,role)        |
| Login new user<br/>(t@jwt.com, pw: test)            |   Login.jsx                 |        POST   api/auth/login      |           SELECT * FROM user WHERE email=?   |
| Order pizza                                         |       Order.jsx/Menu.jsx    |           POST api/orders        |  INSERT INTO orders(userid,pizza,...)            |
| Verify pizza                                        |   Order.jsx                 |        GET api/orders/:id           |       SELECT * FROM orders WHERE id=?       |
| View profile page                                   |    Profile.jsx              |        GET  api/users/me           |   SELECT * FROM users WHERE id=?           |
| View franchise<br/>(as diner)                       |   FranchiseList.jsx          |         GET api/franchies          |  SELECT * from franchies            |
| Logout                                              |  localSotrage + React state |       none                           |      none        |
| View About page                                     |    About.jsx                |         none                        |      none        |
| View History page                                   |         History.jsx           |     GET  api/orders/user/:id              |     SELECT * FROM orders WHERE userdId=?         |
| Login as franchisee<br/>(f@jwt.com, pw: franchisee) |         Login.jsx           |        POST about/auth/login           |     SELECT * FROM users WHERE emial=?         |
| View franchise<br/>(as franchisee)                  |                    |                   |              |
| Create a store                                      |                    |                   |              |
| Close a store                                       |                    |                   |              |
| Login as admin<br/>(a@jwt.com, pw: admin)           |                    |                   |              |
| View Admin page                                     |                    |                   |              |
| Create a franchise for t@jwt.com                    |                    |                   |              |
| Close the franchise for t@jwt.com                   |                    |                   |              |
