const controller = require('./controller');

class Routes {
	constructor() {
		this.initialize = this.initialize.bind(this);
		this.isAlive = this.isAlive.bind(this);
	}
	async isAlive(request, reply) {
		return {
			status: 'ok',
		};
	}
	async initialize(fastify, options) {
		fastify.get('/api', this.isAlive);
		fastify.get('/api/list-files', controller.listFiles);
		fastify.post('/api/new-file', controller.newFile);
		fastify.put('/api/rename-file/:filename', controller.renameFile);
		fastify.delete('/api/delete-file/:filename', controller.deleteFile);
		fastify.get('/api/list-credentials', controller.listCredentials);
		fastify.post('/api/new-credential', controller.newCredential);
		fastify.put('/api/rename-credential/:username', controller.renameCredential);
		fastify.delete('/api/delete-credential/:username', controller.deleteCredential);
	}
}

const routes = new Routes();

module.exports = routes.initialize;
