# Email Builder Generator
[Yeoman][yeoman] generator that scaffolds out a project for crafting email templates.

## Features
* [Sass][sass] Support
* [Jade][jade] Support
* [Browser-Sync][browsersync] Integration
* Auto-Prefixer Integration
* Resource Optimization
* Notification Support
* Style-Inlining Support
* Preview-Submission Support

## Requirements
* [Node.js][node]
* [Yeoman][yeoman]
* [Bower][bower]
* [Gulp][gulp]

## Setup
* Be sure to have [Node.js][node], [Yeoman][yeoman], [Bower][bower] and [Gulp][gulp] installed.
* Run `npm install -g @thasmo/generator-email` to install the generator globally.
* Run `yo @thasmo/email` inside an empty directory and follow the instructions.

### Options
There are no Yeoman options yet.

## Usage
_Email Builder Generator_  scaffolds a project which uses Gulp to process
source files and it also starts up [Browser-Sync][browsersync] to serve the  templates.

### Configuration
Use `task/config.local.js` to customize and overwrite task options defined in `task/config.js` for your local environment.

### Tasks
- **default**  
  Run the `setup`, `build` and the `watch` tasks.

- **setup**  
  Run `bower install` to install dependencies defined in the `bower.json` file.

- **build**  
  Run the `templates` and `images` tasks.

- **templates**  
  Read `jade` and `Sass` files and compile them to email-friendly HTML templates.

- **images**  
  Read images from the source directory and copy them to the public directory.

- **watch**  
  Start `Browser-Sync` which serves the public directory and re-run tasks when source files change.

- **send**  
  Send preview emails to your configured recipients.

## License
[MIT License][license]

[yeoman]: http://yeoman.io/
[sass]: http://sass-lang.com/
[jade]: http://jade-lang.com/
[browsersync]: http://www.browsersync.io/
[node]: https://nodejs.org/
[bower]: http://bower.io/
[gulp]: http://gulpjs.com/
[license]: http://opensource.org/licenses/MIT
