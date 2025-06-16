## Setting up

Set the global variable:

```
export IAGL_DB_PASSWORD=Passw0rd!
```

## Running the full app (be+fe+pg)

From the main folder, run:

```
docker-compose up --build
```


## Notes

To make things easier to manage I've used a monorepo approach.
There are 2 sub-projects: `api` contains the backend and `fe`
contains the frontend.

A docker-compose file in the root folder of the project allows
to start and stop backend, frontend and postgress server with
one command.


## API

Built with `Express` and `Typescript`.

Given the request for production-readiness at the application
level, I've added the following middlewares:
- rate limited to 50 requests per 10 minutes
- request size limited to 2kb
- cors enabled
- helmet for security

The specs don't seem to hint to cloud set-up, but only for the
app to be made production-ready at the application level.
For this reason I've opted for express and containerisation,
rather than using terraform or cdk to create a single lambda and
an API gateway on AWS, which would be automatically ready to
scale.
If you want an example of that, I have just pushed a different
api in that format to my github account at this URL:
[https://github.com/lud77/bits](https://github.com/lud77/bits).

Joi is used for validating type and format of the parameters
passed to the only route, especially as they will interact with
the db; also included some extra consistency checks (e.g. the
flight must be in the future, arrival should be after departure).

Added endpoints for `/health` (process is responsive) and
`/ready` (db is reachable). To prepare the app for deployment on
AWS ECS or Kubernetes.

The seeder script creates the db schema and adds the data from
the config to the database. It starts only when the db is ready
and exits without doing anything if the db table already exists.
This makes it idempotent and safe to execute every time the api
is started.

The rates are loaded from the db at each request, except for the
default route `-` that is only loaded once and cached. For this use
case (5 data rows) I could have just loaded them in memory, but I
think that would miss the point of the exercise. In production the
table with routes would likely have a much higher cardinality and in
that case I would experiment using an LRU cache.


### Table schema

CREATE TABLE ratesByRoute (
  route TEXT PRIMARY KEY,
  rate REAL NOT NULL
);


## Frontend

Built with `Vite`, `React` and `Typescript`.
Served using `Nginx`, as given the simplicity of the UI I've
decided not to use SSR.

