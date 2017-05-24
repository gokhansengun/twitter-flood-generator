var _ = require('underscore.string');

exports.run = function(paragraph) {
    var foldedStr = _.wrap(paragraph, { width: 139, seperator: '\n', cut: false, trailingSpaces: false })
    return  _.words(foldedStr, '\n');
}