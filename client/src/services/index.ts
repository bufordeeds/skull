/**
 * Services index file for easier importing
 */

export * from './apiService';
export * from './socketService';
export * from './config';

// Default export for convenience
import apiService from './apiService';
import socketService from './socketService';
import config from './config';

export default {
	api: apiService,
	socket: socketService,
	config
};
