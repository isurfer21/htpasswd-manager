const fs = require('fs');
const path = require('path');
const model = require('./model');
const htpasswdMgr = require('htpasswd-mgr');

function getFilename(filename) {
    return (filename.split('.').pop() == 'htpasswd') ? filename : filename + '.htpasswd';
}

class Controller {
    constructor() {}
    async isAlive(request, reply) {
        reply.code(200).send({
            status: 'live',
        });
    }
    async listFiles(request, reply) {
        console.log('Controller::listFiles, params:', request.params, 'body:', request.body);
        if (!!model.config.vaultPath) {
            const files = await fs.promises.readdir(model.config.vaultPath);
            reply.code(200).send({ files: files });
        } else {
            reply.code(500).send(new Error(`Missing 'vaultPath' in config file`));
        }
    }
    async newFile(request, reply) {
        console.log('Controller::newFile, params:', request.params, 'body:', request.body);
        if (!!request.body.filename) {
            let filename = getFilename(request.body.filename),
                filePath = path.join(model.config.vaultPath, filename);
            try {
                await fs.promises.writeFile(filePath, '');
                reply.code(200).send({ message: 'Created file successfully' });
            } catch (err) {
                reply.code(500).send(new Error(err.message));
            }
        } else {
            reply.code(500).send(new Error(`Missing 'filename'`));
        }
    }
    async renameFile(request, reply) {
        console.log('Controller::renameFile, params:', request.params, 'body:', request.body);
        if (!!request.params.filename) {
            if (!!request.body.filename) {
                let originalFilename = getFilename(request.params.filename),
                    originalFilePath = path.join(model.config.vaultPath, originalFilename),
                    revisedFilename = getFilename(request.body.filename),
                    revisedFilePath = path.join(model.config.vaultPath, revisedFilename);
                try {
                    await fs.promises.rename(originalFilePath, revisedFilePath);
                    reply.code(200).send({ message: 'Renamed file successfully' });
                } catch (err) {
                    reply.code(500).send(new Error(err.message));
                }
            } else {
                reply.code(500).send(new Error(`Missing revised 'filename'`));
            }
        } else {
            reply.code(500).send(new Error(`Missing original 'filename'`));
        }
    }
    async deleteFile(request, reply) {
        console.log('Controller::deleteFile, params:', request.params, 'body:', request.body);
        if (!!request.params.filename) {
            let filename = getFilename(request.params.filename),
                filePath = path.join(model.config.vaultPath, filename);
            try {
                await fs.promises.rm(filePath);
                reply.code(200).send({ message: 'Deleted file successfully' });
            } catch (err) {
                reply.code(500).send(new Error(err.message));
            }
        } else {
            reply.code(500).send(new Error(`Missing 'filename'`));
        }
    }
    async listCredentials(request, reply) {
        console.log('Controller::listCredentials, params:', request.params, 'body:', request.body);
        if (!!request.params.filename) {
            let filename = getFilename(request.params.filename),
                filePath = path.join(model.config.vaultPath, filename),
                htpasswdManager = htpasswdMgr(filePath);
            try {
                let listUsers = await htpasswdManager.listUsers();
                listUsers = listUsers.filter(e => e);
                reply.code(200).send({ credentials: listUsers });
            } catch (err) {
                reply.code(500).send(new Error(err.message));
            }
        } else {
            reply.code(500).send(new Error(`Missing 'filename'`));
        }
    }
    async newCredential(request, reply) {
        console.log('Controller::newCredential, params:', request.params, 'body:', request.body);
        if (!!request.params.filename) {
            if (!!request.body.username && !!request.body.password) {
                let filename = getFilename(request.params.filename),
                    filePath = path.join(model.config.vaultPath, filename),
                    htpasswdManager = htpasswdMgr(filePath);
                try {
                    await htpasswdManager.addUser(request.body.username, request.body.password, { algorithm: model.config.algorithm });
                    reply.code(200).send({ message: 'Created credential successfully' });
                } catch (err) {
                    reply.code(500).send(new Error(err.message));
                }
            } else {
                reply.code(500).send(new Error(`Missing 'username' or 'password'`));
            }
        } else {
            reply.code(500).send(new Error(`Missing 'filename'`));
        }
    }
    async reviseCredential(request, reply) {
        console.log('Controller::reviseCredential, params:', request.params, 'body:', request.body);
        if (!!request.params.filename) {
            if (!!request.params.username) {
                let filename = getFilename(request.params.filename),
                    filePath = path.join(model.config.vaultPath, filename),
                    htpasswdManager = htpasswdMgr(filePath);
                try {
                    if (request.params.username != request.body.username) {
                        await htpasswdManager.removeUser(request.params.username);
                    }
                    await htpasswdManager.upsertUser(request.body.username, request.body.password, { algorithm: model.config.algorithm });
                    reply.code(200).send({ message: 'Revised credential successfully' });
                } catch (err) {
                    reply.code(500).send(new Error(err.message));
                }
            } else {
                reply.code(500).send(new Error(`Missing 'username' or 'password'`));
            }
        } else {
            reply.code(500).send(new Error(`Missing 'filename'`));
        }
    }
    async deleteCredential(request, reply) {
        console.log('Controller::deleteCredential, params:', request.params);
        if (!!request.params.filename) {
            if (!!request.params.username) {
                let filename = getFilename(request.params.filename),
                    filePath = path.join(model.config.vaultPath, filename),
                    htpasswdManager = htpasswdMgr(filePath);
                try {
                    await htpasswdManager.removeUser(request.params.username);
                    reply.code(200).send({ message: 'Deleted credential successfully' });
                } catch (err) {
                    reply.code(500).send(new Error(err.message));
                }
            } else {
                reply.code(500).send(new Error(`Missing 'username'`));
            }
        } else {
            reply.code(500).send(new Error(`Missing 'filename'`));
        }
    }
}
module.exports = new Controller();