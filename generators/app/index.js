var generator = require('yeoman-generator'),
    yosay = require('yosay'),
    fullname = require('fullname'),
    email = require('git-user-email'),
    dot = require('dot-object'),
    licenses = require('spdx-license-list'),
    string = require('string'),
    validate = require('validate-npm-package-name');

module.exports = generator.Base.extend({
	prompting: function() {
		var yo = this,
		    done = this.async();

		yo.log(yosay('Let\'s craft some gorgeous email templates!'));

		this.prompt([
			{
				type: 'input',
				name: 'project.name',
				message: 'Feel free to name your project.',
				default: this.appname
			}, {
				type: 'input',
				name: 'project.identifier',
				message: 'Please provide a package name.',
				default: function(answers) {
					return string(answers['project.name']).trim().slugify().s;
				},
				validate: function(value) {
					var result = validate(value);

					if(!result.validForNewPackages) {
						var messages = [];

						if(result.errors) {
							messages = messages.concat(result.errors);
						}

						if(result.warnings) {
							messages = messages.concat(result.warnings);
						}

						messages = messages.map(function(value) {
							return string(value + '.').humanize().s;
						});

						return messages.join(' ');
					}

					return true;
				}
			}, {
				type: 'input',
				name: 'project.description',
				message: 'Please provide a short project description.',
				default: null
			}, {
				type: 'input',
				name: 'project.license',
				message: 'Choose a SPDX license of your liking or leave empty.',
				validate: function(value) {
					if(!value || licenses.hasOwnProperty(value)) {
						return true;
					}

					return value + ' is no valid SPDX license identifier. Choose one from spdx.org/licenses.';
				}
			}, {
				type: 'checkbox',
				name: 'project.files',
				message: 'Please select files to be created, if needed.',
				choices: [
					{
						name: '.editorconfig',
						value: 'editorconfig',
						checked: true
					}, {
						name: '.gitignore',
						value: 'gitignore',
						checked: true
					}, {
						name: '.gitattributes',
						value: 'gitattributes',
						checked: true
					}, {
						name: 'README.md',
						value: 'readme',
						checked: true
					}, {
						name: 'CHANGELOG.md',
						value: 'changelog',
						checked: true
					}
				]
			}, {
				type: 'input',
				name: 'project.author.name',
				message: 'Set the project\'s author\'s name.',
				default: function() {
					var done = this.async();

					fullname(function(error, name) {
						done(name);
					});
				}
			}, {
				type: 'input',
				name: 'project.author.email',
				message: 'Set the project\'s author\'s email address.',
				default: function() {
					var done = this.async();
					done(email());
				}
			}, {
				type: 'input',
				name: 'project.author.website',
				message: 'Set the project\'s author\'s website address.'
			}, {
				type: 'input',
				name: 'email.subject',
				message: 'What\'s the email\'s subject?',
				default: function(answers) {
					return answers['project.name'];
				}
			}, {
				type: 'confirm',
				name: 'email.preview.enabled',
				message: 'Do you want to use email preview submission?',
				default: true
			}, {
				type: 'input',
				name: 'email.sender.name',
				message: 'Provide the sender\'s name.',
				default: function() {
					var done = this.async();

					fullname(function(error, name) {
						done(name);
					});
				},
				when: function(answers) {
					return answers['email.preview.enabled'];
				}
			}, {
				type: 'input',
				name: 'email.sender.address',
				message: 'Provide the sender\'s email address.',
				default: function() {
					var done = this.async();
					done(email());
				},
				when: function(answers) {
					return answers['email.preview.enabled'];
				}
			}, {
				type: 'input',
				name: 'email.preview.email',
				message: 'To which email address should previews be sent to?',
				default: function() {
					var done = this.async();
					done(email());
				},
				when: function(answers) {
					return answers['email.preview.enabled'];
				}
			}, {
				type: 'list',
				name: 'email.host.type',
				message: 'Choose an email transport service.',
				choices: [
					{
						name: 'Direct',
						value: 'direct'
					}, {
						name: 'SMTP',
						value: 'smtp'
					}, {
						name: 'AWS SES',
						value: 'ses'
					}, {
						name: 'Sendmail',
						value: 'sendmail'
					}, {
						name: 'Sendgrid',
						value: 'sendgrid'
					}, {
						name: 'Sailthru',
						value: 'sailthru'
					}, {
						name: 'Mandrill',
						value: 'mandrill'
					}
				],
				default: 'direct',
				when: function(answers) {
					return answers['email.preview.enabled'];
				}
			}, {
				type: 'input',
				name: 'email.host.name',
				message: 'Provide the host\'s name.',
				validate: function(value) {
					return !!value;
				},
				when: function(answers) {
					return answers['email.preview.enabled'] && answers['email.host.type'] == 'smtp';
				}
			}, {
				type: 'input',
				name: 'email.host.port',
				message: 'Provide the host\'s port.',
				default: function(answers) {
					return answers['email.host.type'] == 'smtp' ? 587 : null;
				},
				validate: function(value) {
					return !!value;
				},
				when: function(answers) {
					return answers['email.preview.enabled'] && answers['email.host.type'] == 'smtp';
				}
			}, {
				type: 'input',
				name: 'email.host.username',
				message: 'Provide the username to authenticate with the host.',
				validate: function(value) {
					return !!value;
				},
				when: function(answers) {
					return answers['email.preview.enabled'] && answers['email.host.type'] == 'smtp';
				}
			}, {
				type: 'password',
				name: 'email.host.password',
				message: 'Provide the password to authenticate with the host.',
				validate: function(value) {
					return !!value;
				},
				when: function(answers) {
					return answers['email.preview.enabled'] && answers['email.host.type'] == 'smtp';
				}
			}
		], function(answers) {
			yo.answers = answers;
			dot.object(yo.answers);

			done();
		}.bind(this));
	},

	writing: {
		common: function() {
			this.answers.project.files.indexOf('editorconfig') !== -1 && this.fs.copyTpl(this.templatePath('_editorconfig'), this.destinationPath('.editorconfig'), this.answers);
			this.answers.project.files.indexOf('readme') !== -1 && this.fs.copyTpl(this.templatePath('README.md'), this.destinationPath('README.md'), this.answers);
			this.answers.project.files.indexOf('changelog') !== -1 && this.fs.copyTpl(this.templatePath('CHANGELOG.md'), this.destinationPath('CHANGELOG.md'), this.answers);
			this.fs.copy(this.templatePath('public/'), this.destinationPath('public/'), {globOptions: {dot: true}});
		},

		license: function() {
			this.answers.project.license && this.fs.copyTpl(this.templatePath('../../../node_modules/spdx-license-list/licenses/' + this.answers.project.license + '.txt'), this.destinationPath('LICENSE.md'), this.answers);
		},

		gulp: function() {
			this.fs.copyTpl(this.templatePath('gulpfile.js'), this.destinationPath('gulpfile.js'), this.answers);
			this.fs.copy(this.templatePath('task/**'), this.destinationPath('task/'));
			this.fs.copyTpl(this.templatePath('task/config.local.js'), this.destinationPath('task/config.local.js'), this.answers);
			this.fs.write(this.destinationPath('task/send'), '');
		},

		bower: function() {
			this.fs.copyTpl(this.templatePath('bower.json'), this.destinationPath('bower.json'), this.answers);
		},

		node: function() {
			this.fs.copyTpl(this.templatePath('package.json'), this.destinationPath('package.json'), this.answers);
		},

		git: function() {
			this.answers.project.files.indexOf('gitignore') !== -1 && this.fs.copyTpl(this.templatePath('_gitignore'), this.destinationPath('.gitignore'), this.answers);
			this.answers.project.files.indexOf('gitattributes') !== -1 && this.fs.copyTpl(this.templatePath('_gitattributes'), this.destinationPath('.gitattributes'), this.answers);
		},

		source: function() {
			this.fs.copy(this.templatePath('source/'), this.destinationPath('source/'), {globOptions: {dot: true}});
			this.fs.copyTpl(this.templatePath('source/template/index.jade'), this.destinationPath('source/template/index.jade'), this.answers);
		}
	},

	install: function() {
		this.installDependencies();
	},

	end: function() {
		this.log(yosay('All set. Happy building!'));
	}
});
