# database-js-json

A [database-js](https://github.com/mlaanderson/database-js) driver for JSON files.

## About

This is a wrapper around the [jl-sql-api](https://github.com/avz/node-jl-sql-api), intended to be used with [database-js](https://github.com/mlaanderson/database-js) for handling JSON files.

Our [releases](https://github.com/thiagodp/database-js-json/releases) adopt [Semantic Versioning](https://semver.org/).

## Install

```shell
npm install database-js-json --save
```

Note: `database-js` must also be installed.

## Basic Usage

```javascript
const Connection = require( 'database-js' ).Connection;

( async () => {
    const connection = new Connection( 'json:///test.json' );
    try {
        const statement = await connection.prepareStatement("SELECT * WHERE user_name = ?");
        const rows = await statement.query('not_so_secret_user');
        console.log(rows);
    } catch (error) {
        console.log(error);
    } finally {
        await connection.close();
    }
} )();
```

## Example

`people.json`
```json
[
    { "name": "Alice", "age": 21 },
    { "name": "Bob", "age": 53 },
    { "name": "Jack", "age": 16 }
]
```

`main.js`
```javascript
const dbjs = require( 'database-js' );
( async () => {
    let conn;
    try {
        conn = new dbjs.Connection( 'json:///people.json' );

        const st1 = conn.prepareStatement( 'SELECT *' );
        const r1 = await st1.query();
        console.log( r1 ); // same as people.json's content

        const st2 = conn.prepareStatement( 'SELECT name ORDER BY name DESC' );
        const r2 = await st2.query();
        console.log( r2 ); // [ { name: 'Jack' }, { name: 'Bob' }, { name: 'Alice' } ]

        const st3 = conn.prepareStatement( 'SELECT MAX(age) AS older' );
        const r3 = await st3.query();
        console.log( r3 ); // [ { older: 53 } ]
        
    } catch ( err ) {
        console.error( err );
    } finally {
        if ( conn ) {
            await conn.close();
        }
    }
} )();
```

## Basic Options

Options can be passed as arguments to the database connection string, in URL-format.

- `charset`: defines the charset (encoding) used to handle the JSON file
  - Defaults to `utf-8`
  - Example: `const connection = new Connection( 'json:///test.json?charset=utf-16' );`
  - Available in database-js-json version `1.0.0` or later

- `checkOnConnect`: whether it should check if the file exists when connecting to it
  - Defaults to `true`
  - Example: `const connection = new Connection( 'json:///test.json?checkOnConnect=false' );`
  - Accepts `false`, `no` or `0` as false
  - Available in database-js-json version `1.1.0` or later  


## Additional Options

Options from [jl-sql-api](https://github.com/avz/node-jl-sql-api) can also be passed as arguments to the database connection.

Example: `{ tmpDir: "/path/to/dir" }`
```javascript
const connection = new Connection( 'json:///test.json?tmpDir=path/to/dir' );
```

When an option that belongs to a group is informed, it must have a dot.

Example: `{ tmpDir: "/path/to/dir", sortOptions: { inMemoryBufferSize: 32000 } }`
```javascript
const connection = new Connection( 'json:///test.json?tmpDir=path/to/dir&sortOptions.inMemoryBufferSize=32000' );
```

## License

[MIT](https://github.com/thiagodp/database-js-json/blob/master/LICENSE) (c) [Thiago Delgado Pinto](https://github.com/thiagodp)
