var dbjs = require( 'database-js' );
var driver = require( '../' );
var assert = require( 'assert' );

describe( 'database-js-json', function () {

    var users = {
        database: './test/users.json'
    };

    it( 'queries an existing file correctly', function( done ) {
        var conn = new dbjs.Connection( users, driver );
        var st = conn.prepareStatement( 'SELECT * WHERE username = ?' );
        var search = 'alice';
        st.query( search )
            .then( function( data ) {
                assert.equal( data[ 0 ].username, search );
                done();
            } )
            .catch( function( err ) {
                done( err );
            } );
    } );

    it( 'queries single field', function( done ) {
        var conn = new dbjs.Connection( users, driver );
        var st = conn.prepareStatement( 'SELECT age WHERE username = ?' );
        st.query( 'jack' )
            .then( function( data ) {
                assert.equal( data[ 0 ].age, 40 );
                done();
            } )
            .catch( function( err ) {
                done( err );
            } );
    } );

    it( 'queries with value inside the query', function( done ) {
        var conn = new dbjs.Connection( users, driver );
        var st = conn.prepareStatement( 'SELECT age WHERE username = \'jack\'' );
        st.query()
            .then( function( data ) {
                assert.equal( data[ 0 ].age, 40 );
                done();
            } )
            .catch( function( err ) {
                done( err );
            } );
    } );

    it( 'throws when an inexisting file is required', function() {
        var obj2 = Object.assign( users, { database: 'not-found.json' } );
        assert.throws(
            function() {
                new dbjs.Connection( obj2, driver );
            },
            /not exist/
        );
    } );

    it( 'does not throw when an inexisting file is not required', function() {
        var obj2 = Object.assign( users, { database: 'not-found.json', parameters: 'checkOnConnect=false' } );
        new dbjs.Connection( obj2, driver );
    } );

} );