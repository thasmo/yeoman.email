// config.local.js

module.exports = {
	task: {
		send: {
			transport: {
				host: '<%= email.host ? email.host.name : '' %>',
				port: <%= email.host && email.host.port ? email.host.port : 587 %>,
				auth: {
					user: '<%= email.host ? email.host.username : '' %>',
					pass: '<%= email.host ? email.host.password : '' %>'
				}
			},
			email: {
				from: '<%= email.sender ? email.sender.name : '' %> <%- email.sender ? '<' + email.sender.address + '>' : '' %>',
				to: ['<%= email.preview ? email.preview.email : '' %>']
			}
		}
	}
};
