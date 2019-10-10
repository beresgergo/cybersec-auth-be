'use strict';

const DEBUG = 1;
const INFO  = 2;

const LOG_LEVEL = process.env.LOG_LEVEL || 3;

module.exports.getLogger = (tag) => {
	return {
		debug : function(message) {
			if (LOG_LEVEL <= DEBUG) {
				console.debug('DEBUG | ' + tag + ' | MSG=' + message);
			}
		},
		info : function(message) {
			if (LOG_LEVEL <= INFO) {
				console.debug('INFO | ' + tag + ' | MSG=' + message);
			}
		},
		error : function(message) {
			console.debug('ERROR | ' + tag + ' | MSG=' + message);
		}
	};
};
