exports.run = function(client, statuses) {
    var p = Promise.resolve({ id_str: '' });
    var in_reply_to_status_id = '';

    statuses.forEach(function(status) {
        p = p.then(function(tweet) {
            in_reply_to_status_id = tweet.id_str;

            console.log('Updating status: ' + status);
            return updateStatus(client, status, in_reply_to_status_id); 
        }).catch(function (error) {
            console.log("An error occurred");
            process.exit(1);
        });
    });
}

updateStatus = function(client, status, in_reply_to_status_id) {
    return client.post('statuses/update', 
        {
            status: status,
            in_reply_to_status_id: in_reply_to_status_id
        });
}