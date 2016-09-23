var yaml = {
    read: require('js-yaml'),
    write: require('write-yaml'),
}
var fs = require('fs');

var bsPkg = require('../assets/vendor/bootstrap-backward/package.json');
var pkg = require('../package.json');

var bootstrap = yaml.read.safeLoad(fs.readFileSync('./bootstrap.yaml', 'utf8'));
var plugins = yaml.read.safeLoad(fs.readFileSync('./plugins.yaml', 'utf8'));

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
yaml.write('../theme.yaml', theme, {indent: 4}, function(err) {
  if (err) console.log(err);
});