
const assert = require( "assert" );
const emver = require( "./emver.js" );
const filled = require( "filled" );
const truly = require( "truly" );

assert.equal( truly( emver( true ) ), true, "should be true" );

emver( false )( function done( error, version ){
	assert.equal( filled( Array.from( arguments ) ), true, "should be true" );
} );

console.log( "ok" );
