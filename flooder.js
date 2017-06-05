exports.run = (client, reply_to_status_id, statuses) => {
    var p = Promise.resolve({ id_str: reply_to_status_id });

    statuses.forEach((status) => {
        p = p.then((tweet) => {
            var in_reply_to_status_id = tweet.id_str;

            console.log('Updating status: ' + status);
            return updateStatus(client, status, in_reply_to_status_id); 
        }).catch((error) => {
            error.forEach(e => console.log("Error detail - code: " + e.code + " msg: " + e.message))

            console.log("An error occurred");
            process.exit(1);
        });
    });
}

updateStatus = (client, status, in_reply_to_status_id) => {
    return client.post('statuses/update', 
        {
            status: status,
            in_reply_to_status_id: in_reply_to_status_id
        });
}