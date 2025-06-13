## Running the app

From the main folder, run:

```
docker-compose up --build
```


## Notes

Given the request for production-readiness at the application
level, I've added the following middlewares:
- rate limited to 50 requests per 10 minutes
- request size limited to 2kb
- cors enabled
- helmet for security

Joi is used for validating type and format of the parameters
passed to the route, especially as they will interact with the
db; also included some extra consistency checks (e.g. the flight
is in the future, arrival should be after departure)

Added endpoints for `/health` (process is responsive) and
`/ready` (db is reachable).

The business logic is in the `src/domain` folder.
