/**
 * Test file to check connectivity to the server
 */

import { API_CONFIG } from './config';

/**
 * Test HTTP connectivity to the server
 * @returns {Promise<Object>} The response from the server
 */
export const testHttpConnection = async () => {
	try {
		console.log(
			'Testing HTTP connection to:',
			`${API_CONFIG.BASE_URL}/api/test`
		);
		const response = await fetch(`${API_CONFIG.BASE_URL}/api/test`);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		console.log('HTTP connection test successful:', data);
		return data;
	} catch (error) {
		console.error('HTTP connection test failed:', error);
		throw error;
	}
};

/**
 * Test socket.io connectivity to the server
 * @returns {Promise<boolean>} True if the connection was successful
 */
export const testSocketConnection = async () => {
	const { socketService } = await import('./socketService');

	try {
		console.log('Testing socket.io connection to:', API_CONFIG.SOCKET_URL);
		await socketService.initialize(API_CONFIG.SOCKET_URL);
		console.log('Socket.io connection test successful');
		return true;
	} catch (error) {
		console.error('Socket.io connection test failed:', error);
		throw error;
	} finally {
		// Clean up the connection
		socketService.disconnect();
	}
};

/**
 * Run both HTTP and socket.io connection tests
 * @returns {Promise<Object>} The results of both tests
 */
export const runConnectionTests = async () => {
	const results = {
		http: { success: false, data: null, error: null },
		socket: { success: false, error: null }
	};

	try {
		const httpData = await testHttpConnection();
		results.http = { success: true, data: httpData, error: null };
	} catch (error) {
		results.http = { success: false, data: null, error: error.message };
	}

	try {
		await testSocketConnection();
		results.socket = { success: true, error: null };
	} catch (error) {
		results.socket = { success: false, error: error.message };
	}

	return results;
};

export default {
	testHttpConnection,
	testSocketConnection,
	runConnectionTests
};
