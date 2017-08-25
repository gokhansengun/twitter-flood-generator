var _ = require('underscore.string');
var fs = require('fs');

exports.run = (text, flood_dir_name, maxColumns) => {
    // first check text convert it into each paragraph
    var paragraphs = _.words(text, '\n');
    var statusList = [];

    paragraphs.forEach((paragraph) => {
        paragraph = paragraph.trim();

        var mediaRegex = /^M:<(.*?)>(.*)/;
        var metaRegex = /^META:<(.*)>/;
        var mediaMatch = mediaRegex.exec(paragraph);
        var metaMatch = metaRegex.exec(paragraph);
        var mediaPath = null;

        // check whether there is a meta involved, if so skip
        if (metaMatch != null) {
           // skipping this line
           ;
        }
        // check whether there is a media involved
        else if (mediaMatch != null) {
            mediaPath = mediaMatch[1];

            // Update the paragraph by trimming the media
            paragraph = mediaMatch[2];

            if (paragraph.length > maxColumns) {
                throw new Error(`Status attached to the media can not exceed ${maxColumns} characters`)
            }

            mediaPath = require('path').join(flood_dir_name, mediaPath);

            // Validate the media involved, if any not found, throw an error
            if (!fs.existsSync(mediaPath)) {
                throw new Error(`Media file with path ${mediaPath} not found`)
            }

            statusList = statusList.concat({
                media: mediaPath,
                text: paragraph === '' ? null : paragraph
            })
        } else {
            var foldedStr = _.wrap(paragraph, { width: maxColumns - 1, seperator: '\n', cut: false, trailingSpaces: false })

            var splittedLines = _.words(foldedStr, '\n')

            // check whether any of splitted strings have longer columns than 'maxColumns'
            splittedLines.forEach((element) => {
                if (element.length > maxColumns) {
                    throw new Error('Unable to split because there is a very long word');
                }

                statusList = statusList.concat({
                    media: mediaPath,
                    text: element
                });
            });
        }
    });

    return statusList;
}