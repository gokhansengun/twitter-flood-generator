var twitter = require('twitter');
var splitter = require('./splitter.js');
var flooder = require('./flooder.js');
var fs = require('fs');
const commandLineArgs = require('command-line-args');

const optionDefinitions = [
    { name: 'dry_run', alias: 'd', type: Boolean, defaultValue: false },
    { name: 'reply_to_status_id', alias: 'r', type: String, defaultValue: '' },
    { name: 'flood_file_name', type: String, multiple: false, defaultOption: true }
];

const options = commandLineArgs(optionDefinitions);

fs.readFile(options.flood_file_name, 'utf8', 
    function(err, data) {
        var statuses = splitter.run(data);

        if (!options.dry_run) {
            var client = new twitter({
                consumer_key: process.env.TWITTER_CONSUMER_KEY,
                consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
                access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
                access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
            });

            flooder.run(client, options.reply_to_status_id, statuses);
        } else {
            statuses.forEach(stat => console.log('Status: ' + stat));
        }
    });

