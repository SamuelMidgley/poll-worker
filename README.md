# Poll worker

Cloudflare worker using Hono framework with a D1 database.

## Migrations

While there is no admin panel using migration files to add questions and options.

## To dos

- [] Add JWT auth
- [] Add admin routes
  - [] POST / PATCH / DELETE question
  - [] POST / PATCH / DELETE options
  - [] Analytics

## Helpful CLI snippets for Hono

`npx wrangler d1 list`

`npx wrangler d1 execute <DATABASE_NAME> --local --file=./schema.sql`

`npx wrangler d1 execute <DATABASE_NAME> --local --command="SELECT * FROM Customers"`
