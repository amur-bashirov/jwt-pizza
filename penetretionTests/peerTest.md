
Penetration Test of my own website
| Item           | Result                                                                         |
| -------------- | ------------------------------------------------------------------------------ |
| Date           | December 9, 2025                                                                  |
| Target         | pizza.eatandtravel.click                                                      |
| Classification | Broken Access Control – A01:2021                                                                  |
| Severity       | 3 – High                                                                              |
| Description    | While testing the API, I made an HTTP DELETE request to the delete store endpoint without sending any token or credentials of any kind: DELETE /api/store/delete?id=123 Expected behavior: The request should be rejected with a 401 Unauthorized or 403 Forbidden.   Actual behavior: The request succeeded. The store was deleted from the database. The server never checked for  user authtoken|
| Images         | ![Burb successful call](BurbCall.png) <br/> Successful DELETE request with butchered token |
| Corrections    | add token verification to the method                                                          |


Penetretion Test of Charles Butler's website
| Item           | Result                                                                         |
| -------------- | ------------------------------------------------------------------------------ |
| Date           | December 9, 2025                                                                 |
| Target         | pizza.jwtpizzacs329.click                                                     |
| Classification | OWASP A07 – Identification & Authentication Failures                                                                     |
| Severity       | Severity: 2 – Medium                                                                             |
| Description    |A credential brute-force attack was performed using Burp Suite Intruder. Multiple common passwords were attempted against the authentication mechanism. The payload "secretpassword" resulted in an HTTP 200 OK, indicating different server behavior from all other attempts (404).                 |
| Images         | ![successful guess](PasswordTesting.png) <br/> Succcesful response for "secretepassword". |
| Corrections    | force limit attmptes allowed                                                          |











