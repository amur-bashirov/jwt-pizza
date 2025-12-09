
Penetration Test of my own website
| Item           | Result                                                                         |
| -------------- | ------------------------------------------------------------------------------ |
| Date           | December 9, 2025                                                                  |
| Target         | pizza.eatandtravel.click                                                      |
| Classification | Broken Access Control – A01:2021                                                                  |
| Severity       | 3 – High                                                                              |
| Description    | While testing the API, I made an HTTP DELETE request to the delete store endpoint without sending any token or credentials of any kind: DELETE /api/store/delete?id=123 Expected behavior: The request should be rejected with a 401 Unauthorized or 403 Forbidden.   Actual behavior: The request succeeded. The store with ID 123 was deleted from the database. The server never checked for  user authtoken|
| Images         | ![Burb successful call](BurbCall.png) <br/> Successful DELETE request with butchered token |
| Corrections    | add token verification to the method                                                          |


Penetretion Test of Charles Butler's website
| Item           | Result                                                                         |
| -------------- | ------------------------------------------------------------------------------ |
| Date           | December 9, 2025                                                                 |
| Target         | pizza.jwtpizzacs329.click                                                     |
| Classification | Injection                                                                      |
| Severity       | 1                                                                              |
| Description    | SQL injection deleted database. All application data destroyed.                |
| Images         | ![Dead database](deadDatabase.png) <br/> Stores and menu no longer accessible. |
| Corrections    | Sanitize user inputs.                                                          |








