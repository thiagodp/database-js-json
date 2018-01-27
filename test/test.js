var dbjs = require( 'database-js' );
var assert = require( 'assert' );

describe( 'database-js-json', function () {

    var obj = {
        driverName: '../../../index', // hack to load the index as the json module of database-js
        database: './test/states.json'
    };

    it( 'queries an existing file correctly', function( done ) {
        var conn = new dbjs.Connection( obj );
        var st = conn.prepareStatement( 'SELECT * WHERE state = ?' );
        var search = 'Dakota';
        st.query( search )
            .then( function( data ) {
                assert.equal( data[ 0 ].state, search );
                done();
            } )
            .catch( function( err ) {
                done( err );
            } );
    } );

    it( 'throws when an inexisting file is required', function() {
        var obj2 = Object.assign( obj, { database: 'not-found.json' } );
        assert.throws(
            function() {
                new dbjs.Connection( obj2 );
            },
            /not exist/
        );
    } );

    it( 'does not throw when an inexisting file is not required', function() {
        var obj2 = Object.assign( obj, { database: 'not-found.json', parameters: 'checkOnConnect=false' } );
        new dbjs.Connection( obj2 );
    } );    

} );