## Notes

To make things easier to manage I've used a monorepo approach.
There are 2 sub-projects: `api` contains the backend and `fe`
contains the frontend.

A docker-compose file in the root folder of the project allows
to start and stop backend, frontend and postgress server with
one command.


## Setting up

Set the global variable:

```
export IAGL_DB_PASSWORD=Passw0rd!
```

The password you set in this variable will be set as the
password to access the database.


## Running the full app (be+fe+pg)

From the main folder, run:

```
docker-compose up --build -d
```

This will bring up the backend on http://localhost:5000 and
the frontend on http://localhost:3000. It will also start the
Postgres database.


## Stopping the app

From the main folder, run:

```
docker-compose down
```


## API

Built with `Express` and `Typescript`.

To run the tests enter the /api folder and do:

```
npm run test
```

The backend has an endpoint `POST /api/v1/price-points` that
allows to submit flight data according to the spec and returns
the price points.

Given the requirement for production-readiness at the application
level, I've added the following middlewares:
- rate limited to 50 requests per 10 minutes from an IP
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

To run the tests enter the /api folder and do:

```
npm run test
```

The UI shows a form where the flight data can be entered, and a
button that will trigger a POST to the api endpoint `/price-points`
and display the result if it's valid.

The validation on the frontend is implemented without libraries,
with a simple hand-written function.

The logic to handle the date and time pickers is probably the most
complex part of the fe, even though I've now simplified it. This is
because I wanted to avoid the datetime-local input element that
sometimes causes problems with some browsers.
