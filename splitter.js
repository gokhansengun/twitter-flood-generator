var _ = require('underscore.string');

exports.run = function(paragraph, maxColumns) {
    var foldedStr = _.wrap(paragraph, { width: maxColumns - 1, seperator: '\n', cut: false, trailingSpaces: false })

    var splittedWords = _.words(foldedStr, '\n')

    // check whether any of splitted strings have longer columns than 'maxColumns'
    splittedWords.forEach(function(element) {
        if (element.length > maxColumns) {
            throw new Error('Unable to split because there is a very long word');
        }
    });

    return splittedWords;
}