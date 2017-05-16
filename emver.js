"use strict";

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
			"contributors": [
				"John Lenon Maghanoy <johnlenonmaghanoy@gmail.com>"
			],
			"eMail": "richeve.bebedor@gmail.com",
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
			"clazof": "clazof",
			"comver": "comver",
			"depher": "depher",
			"falzy": "falzy",
			"gnaw": "gnaw",
			"letgo": "letgo",
			"raze": "raze",
			"zelf": "zelf"
		}
	@end-include
*/

const clazof = require( "clazof" );
const comver = require( "comver" );
const depher = require( "depher" );
const falzy = require( "falzy" );
const gnaw = require( "gnaw" );
const letgo = require( "letgo" );
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
			throw new Error( `mongod version retrieval failed,
				${ error.stack }` );
		}

	}else{
		return letgo.bind( zelf( this ) )( function later( cache ){
			return gnaw( "m --stable", option )( function done( error, version ){
				if( clazof( error, Error ) ){
					return cache.callback(
						new Error( `mongod version retrieval failed,
						${ error.stack }` ), "" );
				}

				if( falzy( version ) ){
					return comver( "mongod" ).execute( option )(
						function done( error, version ){
							if( clazof( error, Error ) ){
								return cache.callback(
									new Error( `mongod version retrieval failed,
										${ error.stack }` ), "" );
							}

							return cache.callback( null, version );
						}, option );
				}

				return cache.callback( null, version );
			} );
		} );
	}
};

module.exports = emver;
