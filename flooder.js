exports.run = (client, reply_to_status_id, statuses) => {
    var p = Promise.resolve({ id_str: reply_to_status_id });

    statuses.forEach((status) => {
        p = p.then((tweet) => {
            var in_reply_to_status_id = tweet.id_str;

            this.dumpStatus(status)
            return updateStatus(client, status, in_reply_to_status_id); 
        }).catch((error) => {
            error.forEach(e => console.log("Error detail - code: " + e.code + " msg: " + e.message))

            console.log("An error occurred");
            process.exit(1);
        });
    });
}

exports.dumpStatus = (status) => {
    if (status.media && status.text) {
        console.log(`Updating status with text: ${status.text} and media ${status.media}`);
    } else if (status.media) {
        console.log(`Updating status with only media ${status.media}`);
    } else { 
        console.log(`Updating status with only text: ${status.text}`);
    }
}

updateStatus = (client, status, in_reply_to_status_id) => {
    return client.post('statuses/update', 
        {
            status: status.text,
            in_reply_to_status_id: in_reply_to_status_id
        });
}