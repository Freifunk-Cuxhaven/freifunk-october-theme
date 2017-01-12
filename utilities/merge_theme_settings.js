var yaml = {
    read: require('js-yaml'),
    write: require('write-yaml'),
}
var fs = require('fs');

var bsPkg = require(__dirname+'/../assets/vendor/bootstrap-backward/package.json');
var pkg = require(__dirname+'/../package.json');

// load bootstrap theme settings
var bootstrap = yaml.read.safeLoad(fs.readFileSync(__dirname+'/bootstrap.yaml', 'utf8'));
// load bootstrap plugins (requires) the theme uses
var plugins = yaml.read.safeLoad(fs.readFileSync(__dirname+'/plugins.yaml', 'utf8'));

// Use package.json for theme.yaml definitions
var theme = {
    name: pkg.name,
    description: pkg.description,
    author: pkg.author,
    homepage: pkg.homepage,
    license: pkg.license,
    code: pkg.name,
    form: bootstrap.form,
    require: plugins.require,
}

// save settings to yaml file
yaml.write(__dirname+'/../theme.yaml', theme, {indent: 4}, function(err) {
  if (err) console.log(err);
});