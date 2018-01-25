# database-js-json

A [database-js](https://github.com/mlaanderson/database-js) driver for JSON files.

## About

This is a wrapper around the [jl-sql-api](https://github.com/avz/node-jl-sql-api), intended to be used with [database-js](https://github.com/mlaanderson/database-js) for handling JSON files.

## Install

```shell
npm install database-js-json
```

## Basic Usage

```javascript
var Connection = require( 'database-js2' ).Connection;

(async () => {
    const connection = new Database( 'json:///test.json' );
    
    try {
        let statement = await connection.prepareStatement("SELECT * WHERE user_name = ?");
        let rows = await statement.query('not_so_secret_user');
        console.log(rows);
    } catch (error) {
        console.log(error);
    } finally {
        await connection.close();
    }
} )();
```

### Options

Options from [jl-sql-api](https://github.com/avz/node-jl-sql-api) can be passed as arguments to the database connection, in the format of a URL.

Example: `{ tmpDir: "/path/to/dir" }`
```javascript
const connection = new Database( 'json:///test.json?tmpDir=path/to/dir' );
```

When an option that belongs to a group is informed, it must have a dot.

Example: `{ tmpDir: "/path/to/dir", sortOptions: { inMemoryBufferSize: 32000 } }`
```javascript
const connection = new Database( 'json:///test.json?tmpDir=path/to/dir&sortOptions.inMemoryBufferSize=32000' );
```

## License

[MIT](https://github.com/thiagodp/database-js-json/blob/master/LICENSE) (c) [thiagodp](https://github.com/thiagodp)