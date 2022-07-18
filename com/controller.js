const model = require('./model');

class Controller {
	constructor() {}
	async isAlive(request, reply) {
		reply.code(200).send({
			status: 'live',
		});
	}
	async listFiles(request, reply) {
		reply.code(200).send({
			files: [
				'account.htpasswd',
				'billing.htpasswd',
				'tech.htpasswd',
				'complaint.htpasswd'
			]
		});
	}
	async newFile(request, reply) {
		reply.code(200).send({
			message: 'Created file successfully'
		});
	}
	async renameFile(request, reply) {
		reply.code(200).send({
			message: 'Renamed file successfully'
		});
	}
	async deleteFile(request, reply) {
		reply.code(200).send({
			message: 'Deleted file successfully'
		});
	}
	async listCredentials(request, reply) {
		reply.code(200).send({
			credentials: [
				'johngrey',
				'tonystark',
				'natasharomanov',
				'herbertshildt'
			]
		});
	}
	async newCredential(request, reply) {
		reply.code(200).send({
			message: 'Created credential successfully'
		});
	}
	async renameCredential(request, reply) {
		reply.code(200).send({
			message: 'Renamed credential successfully'
		});
	}
	async deleteCredential(request, reply) {
		reply.code(200).send({
			message: 'Deleted credential successfully'
		});
	}
}
module.exports = new Controller();
