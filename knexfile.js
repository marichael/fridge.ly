// Update with your config settings.

module.exports = {
  test: {
    client: 'mysql',
    connection: {
      database: 'fridgely_test',
      user:     'fridgely',
      password: 'poop'
    }
  },

  development: {
    client: 'mysql',
    connection: {
      database: 'fridgely_development',
      user:     'fridgely',
      password: 'poop'
    }
  },

  staging: {
    client: 'mysql',
    connection: {
      host: "fridgely-1.ctdccxw5jbvt.us-west-1.rds.amazonaws.com",
      database: 'fridgely_staging',
      user:     'fridgely',
      password: 'uUP8/NMVYqy1X7/Dyqpe78Anni2fAse4pWSsKk6wDl4=' // don't worry, this is just a for-fun app :)
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  // production: {
  //   client: 'postgresql',
  //   connection: {
  //     database: 'my_db',
  //     user:     'username',
  //     password: 'password'
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations'
  //   }
  // }

};
