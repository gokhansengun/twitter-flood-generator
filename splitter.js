var _ = require('underscore.string');

exports.run = (text, maxColumns) => {
    // first check text convert it into each paragraph
    var paragraphs = _.words(text, '\n');
    var splittedChunks = [];

    paragraphs.forEach((paragraph) => {
        paragraph = paragraph.trim();
        var foldedStr = _.wrap(paragraph, { width: maxColumns - 1, seperator: '\n', cut: false, trailingSpaces: false })

        var splittedLines = _.words(foldedStr, '\n')

        // check whether any of splitted strings have longer columns than 'maxColumns'
        splittedLines.forEach((element) => {
            if (element.length > maxColumns) {
                throw new Error('Unable to split because there is a very long word');
            }
        });

        splittedChunks = splittedChunks.concat(splittedLines);
    });

    return splittedChunks;
}