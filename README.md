##Run application

```
$ npm install  # install all dependencies
$ npm start    # service running at http://localhost:3000
```

##Available APIs
| Resource | Required params | Description |
| --- | --- | --- |
| `POST /api/auth` | username, password | Basic authentication to get access token |
| `POST /api/v1/parkings` | latitude, longtitude, floor, slot | Add new parking place |
| `GET /api/v1/parkings` | | Retrieve all parking places from database|
| `GET /api/v1/parkings/{id}` | | Get a parking place from its id |
| `PUT /api/v1/parkings/{id}` | vacant (true/ false) | Update vacancy status of a specific place |
| `GET /api/v1/search?vacant=$vacant` | vacant (true/ false) | Retrieve all vacant places from database |
| `GET /api/v1/search/position?latitude=$lat&longtitude=$lon` | | Get parking places from specific position |
| `GET /api/v1/search/vacant-parkings?latitude=$lat&longtitude=$lon` | | Get vacant places from specific position |

Access token is required to use APIs, can be sent in header, body or as query param

```
access-token: $token	# send with header
token: $token			# send with body or as query param
```

##Example of using APIs
###HTTP basic authentication
Perform basic authentication, access token is returned. The below ```username/password``` pairs can be used

```
userone / password
usertwo / password
``` 

Request

```
POST /api/auth HTTP/1.1
Host: 127.0.0.1:3000
Content-Type: application/json
Cache-Control: no-cache
Postman-Token: 162f0b29-00a7-955d-537f-871b93444585

{
 "username": "userone",
 "password": "password"
}
```

Response

```
{
 "success": true,
 "message": "Authentication successful.",
 "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InVzZXJvbmUiLCJwYXNzd29yZCI6InBhc3N3b3JkIiwiaWF0IjoxNDU5NzE3NDc4LCJleHAiOjE0NTk4MDM4Nzh9.by3KpTPUK2J-OmxkKoC72DM5-UpbbhRlEcmAXCqiuaA"
}
```

###Add new parking place
Request

```
POST /api/v1/parkings HTTP/1.1
Host: 127.0.0.1:3000
Content-Type: application/json
access-token: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InVzZXJvbmUiLCJwYXNzd29yZCI6InBhc3N3b3JkIiwiaWF0IjoxNDU5ODc2OTA2LCJleHAiOjE0NTk5NjMzMDZ9.gyzK9JwDJEXnJyswxwbmxvulA8LmTGkdrJQavj7SmE0
Cache-Control: no-cache
Postman-Token: f303d6f7-b613-d48e-39fc-59ec6fdf2bd9

{
    "latitude": "35.00000",
    "longtitude": "-40.00000",
    "floor": "-1",
    "slot": "F42",
    "remark": "On 1st basement"
}
```

Response

```
{
  "success": true,
  "message": "Successful execution.",
  "data": {
    "id": "daa9c1f0-fb72-11e5-8dc0-03a2a4b509c6",
    "position": {
      "latitude": "35.00000",
      "longtitude": "-40.00000"
    },
    "floor": "-1",
    "slot": "F42",
    "remark": "On 1st basement",
    "vacant": true
  }
}
```