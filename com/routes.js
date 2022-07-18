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
		fastify.get('/api/files', controller.listFiles);
		fastify.post('/api/file', controller.newFile);
		fastify.put('/api/file/:filename', controller.renameFile);
		fastify.delete('/api/file/:filename', controller.deleteFile);
		fastify.get('/api/file/:filename/credentials', controller.listCredentials);
		fastify.post('/api/file/:filename/credential', controller.newCredential);
		fastify.put('/api/file/:filename/credential/:username', controller.reviseCredential);
		fastify.delete('/api/file/:filename/credential/:username', controller.deleteCredential);
	}
}

const routes = new Routes();

module.exports = routes.initialize;
