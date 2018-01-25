var JlSqlApi = require( 'jl-sql-api' );
var fs = require( 'fs' );

/**
 * Database-js driver for JSON files.
 * 
 * @see https://github.com/mlaanderson/database-js
 */
class JsonDriver {

    /**
     * Constructor
     * 
     * @param {string} filename File name
     * @param {object} options Options. Defaults to { charset: 'utf-8' }.
     * 
     * @see https://github.com/avz/node-jl-sql-api#options-object for more options.
     */
    constructor( filename, options ) {

        this._api = new JlSqlApi();

        this._filename = filename;

        this._options = Object.assign( {
            charset: 'utf-8'
        }, options );

        this._data = null;
    }

    /**
     * Loads the file and returns a promise to its content.
     * 
     * @returns {Promise}
     */
    _loadFile() {
        var _this = this;
        return new Promise( function ( resolve, reject ) {
            fs.readFile( _this._filename, _this._options.charset, function ( err, data ) {
                if ( err ) {
                    return reject( err );
                }
                try {
                    return resolve( JSON.parse( data ) );
                } catch ( e ) {
                    return reject( e );
                }
            } );
        } );
    }

    /**
     * Saves the file and returns a promise with no data.
     * 
     * @returns {Promise}
     */    
    _saveFile() {
        var _this = this;
        return new Promise( function ( resolve, reject ) {
            fs.writeFile( _this._filename, _this._data || [], _this._options.charset, function ( err ) {
                if ( err ) {
                    return reject( err );
                }
                return resolve();
            } );
        } );        
    }

    /**
     * Returns a promise to the file content.
     * 
     * @param {boolean} reloadFile Whether is desired to reload the file. Defaults to false.
     * @returns {Promise}
     */
    data( reloadFile ) {
        if ( this._data && ! reloadFile ) {
            return Promise.resolve( this._data );
        }
        var _this = this;
        return this._loadFile().then( function ( data ) {
            _this._data = data;
            return data;
        } );
    }

    /**
     * Executes the given query and returns a promise to the resulting data.
     * 
     * @param {string} sql Query to execute.
     * @returns {Promise}
     */
    query( sql ) {
        var _this = this;
        return new Promise( function( resolve, reject ) {

            var queryData = function( data ) {
                api.query( sql )
                    .fromArrayOfObjects( Array.isArray( data ) ? data : [ data ] )
                    .toArrayOfObjects( function( rows ) {
                        resolve( rows );
                    } );
            };

            _this.data()
                .then( queryData )
                .catch( function ( err ) { reject( err ); } );
        } );
    }

    /**
     * Executes the given command and returns a promise with the resulting data.
     * The file is saved after the command execution, whether successful.
     * 
     * @param {string} sql Command to execute.
     * @returns {Promise}
     */    
    execute( sql ) {
        var _this = this;
        return new Promise( function( resolve, reject ) {

            _this.query( sql )
                .then( function keepResults( rows ) {
                    _this._data = rows; // Keep the last content
                    return rows;
                } )
                .then( function saveToFile( rows ) {
                    return _this._saveFile()
                        .then( function ( data ) { resolve( data ); } )
                        .catch( function ( err ) { reject( err ); } );
                } )
                .catch( function ( err ) { reject( err ); } );
        } );
    }

}

module.exports = {
    open: function( connection ) {

        var options = {};
        if ( connection.Parameters ) {
            connection.Parameters.split( '&' ).map( function ( s ) {

                var separated = s.split( '=' );
                var key = separated[ 0 ];
                var val = separated[ 1 ];
                var subKey = null;

                // e.g. "sortOptions.bufferSize"
                if ( key.indexOf( '.' ) >= 0 ) {
                    var sub = key.split( '.' );
                    key = sub[ 0 ];
                    subKey = sub[ 1 ];
                }

                if ( ! subKey ) {
                    options[ key ] = val;
                } else {
                    if ( ! options[ key ] ) {
                        options[ key ] = {};
                    }
                    options[ key ][ subKey ] = val;
                }
            });
        }

        return new JsonDriver( connection.Database, options );
    }
};