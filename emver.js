/*;
	@module-license:
		The MIT License (MIT)
		@mit-license

		Copyright (@c) 2017 Richeve Siodina Bebedor
		@email: richeve.bebedor@gmail.com

		Permission is hereby granted, free of charge, to any person obtaining a copy
		of this software and associated documentation files (the "Software"), to deal
		in the Software without restriction, including without limitation the rights
		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		copies of the Software, and to permit persons to whom the Software is
		furnished to do so, subject to the following conditions:

		The above copyright notice and this permission notice shall be included in all
		copies or substantial portions of the Software.

		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		SOFTWARE.
	@end-module-license

	@module-configuration:
		{
			"package": "emver",
			"path": "emver/emver.js",
			"file": "emver.js",
			"module": "emver",
			"author": "Richeve S. Bebedor",
			"eMail": "richeve.bebedor@gmail.com",
			"contributors": [
				"John Lenon Maghanoy <johnlenonmaghanoy@gmail.com>"
			],
			"repository": "https://github.com/volkovasystems/emver.git",
			"test": "emver-test.js",
			"global": true
		}
	@end-module-configuration

	@module-documentation:
		Get mongod current version.
	@end-module-documentation

	@include:
		{
			"comver": "comver",
			"depher": "depher",
			"falzy": "falzy",
			"gnaw": "gnaw",
			"raze": "raze",
			"zelf": "zelf"
		}
	@end-include
*/

const comver = require( "comver" );
const depher = require( "depher" );
const falzy = require( "falzy" );
const gnaw = require( "gnaw" );
const raze = require( "raze" );
const zelf = require( "zelf" );

const emver = function emver( synchronous, option ){
	/*;
		@meta-configuration:
			{
				"synchronous": "boolean",
				"option": "object"
			}
		@end-meta-configuration
	*/

	let parameter = raze( arguments );

	synchronous = depher( parameter, BOOLEAN, false );

	option = depher( parameter, OBJECT, { } );

	if( synchronous ){
		try{
			let version = gnaw( "m --stable", true, option );

			if( falzy( version ) ){
				version = comver( "mongod" ).execute( true, option );
			}

			return version;

		}catch( error ){
			throw new Error( `cannot get mongod version, ${ error.stack }` );
		}

	}else{
		let catcher = gnaw( "m --stable", option )
			.push( function done( error, version ){
				if( error instanceof Error ){
					return catcher.pass( new Error( `cannot get mongod version, ${ error.stack }` ), "" );

				}else if( falzy( version ) ){
					comver( "mongod" ).execute( option )
						.then( function done( error, version ){
							if( error instanceof Error ){
								return catcher.pass( new Error( `cannot get mongod version, ${ error.stack }` ), "" );

							}else{
								return catcher.pass( null, version );
							}
						} );

				}else{
					return catcher.pass( null, version );
				}
			} );

		return catcher;
	}
};

module.exports = emver;
