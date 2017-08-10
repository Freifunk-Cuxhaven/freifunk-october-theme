var yaml = {
    read: require('js-yaml'),
    write: require('write-yaml'),
}
var fs = require('fs');

var toTitleCase = function(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

var toHandleCase = function(str) {
    return str.toLowerCase().replace(/\s/g, '_');
}

var sortVariables = function (variables) {

    function compare(a,b) {
    if (a.context.line.start < b.context.line.start)
        return -1;
    if (a.context.line.start > b.context.line.start)
        return 1;
    return 0;
    }

    return variables.sort(compare);
}

var groupVariables = function (variables, tab) {
    var groups = {};
    // group variables to groups, e.g. colors, options, pagination, etc
    variables.forEach(function(variableDefs) {
        console.log("variableDefs", variableDefs);

        // ignore private variables
        if(variableDefs.context.scope == "private") {
            return;
        }
        // types to lower cae for easier witch case compare
        if(variableDefs.type) {
        variableDefs.type = variableDefs.type.toLowerCase();
        }
        // init group variable if not set
        if(!groups[variableDefs.group[0]]) {
            groups[variableDefs.group[0]] = [];
        }

        var groupName = variableDefs.group[0];

        var id = variableDefs.context.name;
        var handle = 'bs4-'+variableDefs.context.name;
        var label = variableDefs.context.name;
        var defaultVal = variableDefs.context.value;
        var comment = variableDefs.description;
        
        // different objects for different types
        switch (variableDefs.type) {
            case 'color':
            groups[groupName].push({
                handle: handle,
                octoberType: "colorpicker",
                shopifyType: 'color',
                label: label,
                default: defaultVal,
                comment: comment,
                id: id
            });
            break;
            case 'number':
            groups[groupName].push({
                handle: handle,
                octoberType: "number",
                shopifyType: 'number',
                label: label,
                default: Number(defaultVal),

                comment: comment,
                id: id
            });
            break;
            case 'bool':
            case 'boolean':
            groups[groupName].push({
                handle: handle,
                octoberType: "checkbox",
                shopifyType: 'checkbox',
                label: label,
                default: defaultVal === 'true',
                comment: comment,
                id: id
            });
            break;
            case 'text':
            default:
            groups[groupName].push({
                handle: handle,
                octoberType: "text",
                shopifyType: 'text',
                label: label,
                default: defaultVal,
                comment: comment,
                id: id
            });
            break;
        }
    }, this);

    return groups;
}



var generate = function (groups, tab) {

    var octoberForm = {
        "form": {
            "tabs": {
                "fields": {
                    'bs4-main-section': {
                        "label": 'Bootstrap 4',
                        "type": "section",
                        "tab": tab,
                        "comment": "Bootstrap 4 (https://github.com/JumpLinkNetwork/bootstrap-backward) for OctoberCMS by [JumpLink](https://www.jumplink.eu)"
                    }
                }
            }

        }
    };
    var octoberFields = octoberForm.form.tabs.fields;

    var shopifySchema = [
        {
            name: tab,
            settings: [
                {
                    "type": "paragraph",
                    "content": "Bootstrap 4 (https://github.com/JumpLinkNetwork/bootstrap-backward) for Shopify by [JumpLink](https://www.jumplink.eu)"
                },
            ],
        }
    ];
    var shopifySettings = shopifySchema[0].settings;

    // write groups to settings and clean up 
    for(var name in groups) { 
        var group = groups[name];

        // title
        octoberFields['bs4-'+toHandleCase(name)] = {
            "label": toTitleCase(name),
            "type": "section",
            "tab": tab,
            //"comment": "TODO",
        };

        // title
        shopifySettings.push({
            "type": "header",
            "content": toTitleCase(name),
        });

        group.forEach(function(groupContext) {
            // use handle for variable name
            var handle = groupContext.handle;

            octoberFields[handle] = {
                type: groupContext.octoberType,
                label: groupContext.label,
                default: groupContext.default,
                tab: tab,
                assetVar: groupContext.id
            }

            if(groupContext.comment && groupContext.comment != "" && groupContext.comment != "\n") {
                octoberFields[handle].comment = groupContext.comment;
            }


            var shopifySetting = {
                type: groupContext.shopifyType,
                id: handle,
                label: groupContext.label,
                default: groupContext.default,
            }

            if(groupContext.comment && groupContext.comment != "" && groupContext.comment != "\n") {
                shopifySetting.info = groupContext.comment;
            }

            shopifySettings.push(shopifySetting);

        }, this);
    }

    console.log("octoberFields", octoberFields);
    console.log("shopifySettings", shopifySettings);

    // save settings to october yaml file
    octoberForm.form.tabs.fields = octoberFields
    yaml.write.sync(__dirname+'/../dist/variables/bootstrap.yaml', octoberForm, {indent: 4});

    // save settings to shopify json file
    shopifySchema[0].settings = shopifySettings;
    fs.writeFileSync(__dirname+'/../dist/variables/bootstrap.json', JSON.stringify(shopifySchema, null, 2) , 'utf-8');
}

var bsPkg = require(__dirname+'/../vendor/bootstrap-backward/package.json');
var tab = "Bootstrap "+bsPkg.version;



var bootstrap_variables = groupVariables(sortVariables(require(__dirname+'/../vendor/bootstrap-backward/variables.json')));

generate(bootstrap_variables, tab);

