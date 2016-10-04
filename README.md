# fridge.ly

## Migrations

This project uses [knex](http://knexjs.org/) for migrations.

To create a new migration:

```
$ ./node_modules/.bin/knex migrate:make <migration_name>
```

To run all migrations:

```
$ ./node_modules/.bin/knex migrate:latest
```
