var chai = require('chai');
var splitter = require('../splitter.js');

var singleVeryLongLine = '0123456789012';

var singleLongLine1 = '012345678 012345';
var singleLongLine2 = '0123456789 012345';
var singleLongLine3 = '01234 56789 012345';

var wholeTwoLines = '0123 56789 0123456789';

var multiLine1 = '01234 \n567';
var multiLine2 = '01234567 01234\n012';
var multiLine3 = '012\n345\n678\n\n\n';
var multiLine4 = '012\nM:<test.png>0123456789';
var multiLine5 = '012\nM:<test.png>';
var multiLine6 = '012\nM:<test.png>012345678901';
var multiLine7 = '012\nM:<does-not-exist.png>';
var multiLine8 = '012\nMETA-TITLE:<This is a blog>\n345';

var maxColumns = 10;
var floodDirName = './resources/test-images/';

describe('Splits', () => {
  it('should accept a whole line with 10 chars', (done) => {
    var splittedStatuses = splitter.run(wholeTwoLines, floodDirName, maxColumns);

    chai.assert(splittedStatuses.length === 2, 'Wrong number of splits');
    chai.assert(splittedStatuses[0].text === '0123 56789', 'Split error in whole line');
    chai.assert(splittedStatuses[1].text === '0123456789', 'Split error in whole line');

    done();
  });

  it('should split a line longer than 10 chars into 10-char lines and remove trailing space', (done) => {
    var splittedStatuses = splitter.run(singleLongLine1, floodDirName, maxColumns);

    chai.assert(splittedStatuses.length === 2, 'Wrong number of splits');
    chai.assert(splittedStatuses[0].text === '012345678', 'Split error in long line');
    chai.assert(splittedStatuses[1].text === '012345', 'Split error in long line');

    done();
  });

  it('should split a line longer than 10 chars into 10-char lines and remove leading space', (done) => {
    var splittedStatuses = splitter.run(singleLongLine2, floodDirName, maxColumns);

    chai.assert(splittedStatuses.length === 2, 'Wrong number of splits');
    chai.assert(splittedStatuses[0].text === '0123456789', 'Split error in long line');
    chai.assert(splittedStatuses[1].text === '012345', 'Split error in long line');

    done();
  });

  it('should not split words into two rather split line from first space', (done) => {
    var splittedStatuses = splitter.run(singleLongLine3, floodDirName, maxColumns);

    chai.assert(splittedStatuses.length === 3, 'Wrong number of splits');
    chai.assert(splittedStatuses[0].text === '01234', 'Split error in long line');
    chai.assert(splittedStatuses[1].text === '56789', 'Split error in long line');
    chai.assert(splittedStatuses[2].text === '012345', 'Split error in long line');

    done();
  });

  it('should produce an error if a word is longer than the max-column length', (done) => {
    chai.expect(() => splitter.run(singleVeryLongLine, floodDirName, maxColumns)).to.throw('Unable to split because there is a very long word');
    done();
  });

  it('should split multiline string each line by itself', (done) => {
    var splittedStatuses = splitter.run(multiLine1, floodDirName, maxColumns);

    chai.assert(splittedStatuses.length === 2, 'Wrong number of splits');
    chai.assert(splittedStatuses[0].text === '01234', 'Split error in long line');
    chai.assert(splittedStatuses[1].text === '567', 'Split error in long line');

    done();
  });

  it('should split multiline string each line by itself when first line needs also split', (done) => {
    var splittedStatuses = splitter.run(multiLine2, floodDirName, maxColumns);

    chai.assert(splittedStatuses.length === 3, 'Wrong number of splits');
    chai.assert(splittedStatuses[0].text === '01234567', 'Split error in long line');
    chai.assert(splittedStatuses[1].text === '01234', 'Split error in long line');
    chai.assert(splittedStatuses[2].text === '012', 'Split error in long line');

    done();
  });

  it('should split multiline string and media with text', (done) => {
    var splittedStatuses = splitter.run(multiLine4, floodDirName, maxColumns);

    chai.assert(splittedStatuses.length === 2, 'Wrong number of splits');
    chai.assert(splittedStatuses[0].text === '012', 'Split error in long line');
    chai.assert(splittedStatuses[0].media === null, 'Split error in media part');
    chai.assert(splittedStatuses[1].text === '0123456789', 'Split error in long line');
    chai.assert(splittedStatuses[1].media === 'resources/test-images/test.png', 'Split error in media part');

    done();
  });

  it('should split multiline string and media without text', (done) => {
    var splittedStatuses = splitter.run(multiLine5, floodDirName, maxColumns);

    chai.assert(splittedStatuses.length === 2, 'Wrong number of splits');
    chai.assert(splittedStatuses[0].text === '012', 'Split error in long line');
    chai.assert(splittedStatuses[0].media === null, 'Split error in media part');
    chai.assert(splittedStatuses[1].text === null, 'Split error in media part');
    chai.assert(splittedStatuses[1].media === 'resources/test-images/test.png', 'Split error in media part');

    done();
  });

  it('should not allow a media status greater than the expected # of columns', (done) => {
    chai.expect(() => splitter.run(multiLine6, floodDirName, maxColumns))
      .to.throw(`Status attached to the media can not exceed ${maxColumns} characters`);
    done();
  });

  it('should not allow non-existant media to be provided as input', (done) => {
    var mediaPath = 'does-not-exist.png';

    chai.expect(() => splitter.run(multiLine7, floodDirName, maxColumns))
      .to.throw(`Media file with path resources/test-images/${mediaPath} not found`);
    done();
  });

  it('should not produce empty split word when there is trailing new lines', (done) => {
    var splittedStatuses = splitter.run(multiLine3, floodDirName, maxColumns);

    chai.assert(splittedStatuses.length === 3, 'Wrong number of splits');
    chai.assert(splittedStatuses[0].text === '012', 'Split error in long line');
    chai.assert(splittedStatuses[1].text === '345', 'Split error in long line');
    chai.assert(splittedStatuses[2].text === '678', 'Split error in long line');

    done();
  });

  it('should not skip lines starting with meta tag', (done) => {
    var splittedStatuses = splitter.run(multiLine8, floodDirName, maxColumns);

    chai.assert(splittedStatuses.length === 2, 'Wrong number of splits');
    chai.assert(splittedStatuses[0].text === '012', 'Split error in long line');
    chai.assert(splittedStatuses[1].text === '345', 'Split error in long line');

    done();
  });
});
