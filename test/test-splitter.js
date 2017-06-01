var chai = require('chai');
var should = chai.should();
var splitter = require('../splitter.js');

var singleVeryLongLine = '0123456789012';
var singleLongLine1 = '012345678 012345';
var singleLongLine2 = '0123456789 012345';
var singleLongLine3 = '01234 56789 012345';
var maxColumns = 10;

describe('Splits', () => {
    it('should split a line longer than 10 chars into 10-char lines and remove trailing space', (done) => {
        var splittedLines = splitter.run(singleLongLine1, maxColumns);

        chai.assert(splittedLines[0] === '012345678', 'Split error in long line');
        chai.assert(splittedLines[1] === '012345', 'Split error in long line');

        done();
    });

    it('should split a line longer than 10 chars into 10-char lines and remove leading space', (done) => {
        var splittedLines = splitter.run(singleLongLine2, maxColumns);

        chai.assert(splittedLines[0] === '0123456789', 'Split error in long line');
        chai.assert(splittedLines[1] === '012345', 'Split error in long line');

        done();
    });

    it('should not split words into two rather split line from first space', (done) => {
        var splittedLines = splitter.run(singleLongLine3, maxColumns);

        chai.assert(splittedLines[0] === '01234', 'Split error in long line');
        chai.assert(splittedLines[1] === '56789', 'Split error in long line');
        chai.assert(splittedLines[2] === '012345', 'Split error in long line');

        done();
    });

    it('should produce an error if a word is longer than the max-column length', (done) => {
        chai.expect(() => splitter.run(singleVeryLongLine, maxColumns)).to.throw('Unable to split because there is a very long word');
        done();
    });
});
