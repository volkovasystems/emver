
const emver = require( "./emver.js" );

console.log( emver( true ) );

emver( false )( function done( error, version ){
	console.log( arguments );
} );
