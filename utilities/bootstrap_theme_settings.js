var yaml = require('write-yaml');
var bsPkg = require('../assets/vendor/bootstrap-backward/package.json');
var bootstrap_variables = require('../assets/vendor/bootstrap-backward/variables.json');
var bootstrap_theme_settings = {
    "form": {
        "tabs": {
            "fields": {

            }
        }

    }
};

var toTitleCase = function(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

// sort variables to groups
bootstrap_variables.forEach(function(variableDefs) {
    console.log("variableDefs", variableDefs);

    if(variableDefs.context.scope == "private") {
        return;
    }

    if(variableDefs.type) {
      variableDefs.type = variableDefs.type.toLowerCase();
    }

    switch (variableDefs.type) {
        case 'color':
            bootstrap_theme_settings.form.tabs.fields['bs4-'+variableDefs.context.name] = {
                type: "colorpicker",
                label: variableDefs.context.name,
                default: variableDefs.context.value,
                tab: toTitleCase(variableDefs.group[0]),
                comment: variableDefs.description,
            }
        break;
        case 'number':
            bootstrap_theme_settings.form.tabs.fields['bs4-'+variableDefs.context.name] = {
                type: "number",
                label: variableDefs.context.name,
                default: Number(variableDefs.context.value),
                tab: toTitleCase(variableDefs.group[0]),
                comment: variableDefs.description,
            }
        break;
        case 'bool':
        case 'boolean':
            bootstrap_theme_settings.form.tabs.fields['bs4-'+variableDefs.context.name] = {
                type: "checkbox",
                label: variableDefs.context.name,
                default: variableDefs.context.value === 'true',
                tab: toTitleCase(variableDefs.group[0]),
                comment: variableDefs.description,
            }
        break;
        case 'text':
        default:
            bootstrap_theme_settings.form.tabs.fields['bs4-'+variableDefs.context.name] = {
                type: "text",
                label: variableDefs.context.name,
                default: variableDefs.context.value,
                tab: toTitleCase(variableDefs.group[0]),
                comment: variableDefs.description,
            }
        break;
    }
}, this);

// save settings to yaml file
yaml('./test-travis.yml', bootstrap_theme_settings, {indent: 4}, function(err) {
  if (err) console.log(err);
});
//fs.writeFileSync('./settings_schema/bootstrap.json', JSON.stringify(bootstrap_theme_settings, null, 2) , 'utf-8');