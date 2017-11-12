var twitter = require('twitter');
var splitter = require('./splitter.js');
var flooder = require('./flooder.js');
var fs = require('fs');
const commandLineArgs = require('command-line-args');

const optionDefinitions = [
    { name: 'dry_run', alias: 'd', type: Boolean, defaultValue: false },
    { name: 'reply_to_status_id', alias: 'r', type: String, defaultValue: '' },
    { name: 'max_chars_per_tweet', alias: 'm', type: Number, defaultValue: 280 },
    { name: 'flood_file_name', type: String, multiple: false, defaultOption: true }
];

const options = commandLineArgs(optionDefinitions);

console.log(options.max_chars_per_tweet);

if (options.max_chars_per_tweet < 1 || options.max_chars_per_tweet > 280) {
    throw new Error(`Max characters per tweet should be between 1 and 280`);
}

fs.readFile(options.flood_file_name, 'utf8', 
    function(err, data) {
        var flood_dir_name = require('path').dirname(options.flood_file_name);
        var statuses = splitter.run(data, flood_dir_name, options.max_chars_per_tweet);

        if (!options.dry_run) {
            var client = new twitter({
                consumer_key: process.env.TWITTER_CONSUMER_KEY,
                consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
                access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
                access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
            });

            flooder.run(client, options.reply_to_status_id, statuses);
        } else {
            statuses.forEach(stat => flooder.dumpStatus(stat));
        }
    });

