var fs = require('fs');

exports.run = (client, reply_to_status_id, statuses) => {
    var p = Promise.resolve({ id_str: reply_to_status_id });

    statuses.forEach((status) => {
        p = p.then((tweet) => {
            var in_reply_to_status_id = tweet.id_str;

            if (status.media) {
                return updateMedia(client, status)
                  .then((media) => {
                      return updateStatus(this, client, status, media.media_id_string, in_reply_to_status_id)
                  });
            } else {
                return updateStatus(this, client, status, null, in_reply_to_status_id); 
            }
        }).catch((error) => {
            if (Array.isArray(error)) {
                error.forEach(e => console.log(`Error detail - code: ${e.code} msg: ${e.message}`))
            } else {
                console.error(`An error occurred, please clean and retry. Details: ${error}`)
            }

            process.exit(1);
        });
    });
}

exports.dumpStatus = (status) => {
    if (status.media && status.text) {
        console.log(`Updating status(DT): ${status.text}`);
        console.log(`Updating status(DM): ${status.media}`);
    } else if (status.media) {
        console.log(`Updating status(OM): ${status.media}`);
    } else { 
        console.log(`Updating status(OT): ${status.text}`);
    }
}

updateStatus = (that, client, status, media_ids, in_reply_to_status_id) => {
    that.dumpStatus(status);

    return client.post('statuses/update', 
        {
            status: status.text,
            media_ids: media_ids,
            in_reply_to_status_id: in_reply_to_status_id
        });
}

updateMedia = (client, status) => {
    var data = fs.readFileSync(status.media);

    console.log(`Uploading the media file ${status.media}`)
    // Post the media file
    return client.post('media/upload', { media: data });
}

