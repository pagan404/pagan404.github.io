const textToBraille = require('../braille1').textToBraille1;
const brailleToText = require('../braille1').braille1ToText;  

describe('textToBraille', () => {
  it('should convert text to Braille', () => {
    expect(textToBraille('hello')).toBe('⠓⠑⠇⠇⠕');
    expect(textToBraille('world')).toBe('⠺⠕⠗⠇⠙');
    expect(textToBraille('123')).toBe('⠂⠆⠒');
    expect(textToBraille(' ')).toBe(' ');
    expect(textToBraille('')).toBe('');
    expect(textToBraille('This is a test')).toBe('⠞⠓⠊⠎ ⠊⠎ ⠁ ⠞⠑⠎⠞');
  });
});

describe('brailleToText', () => {
  it('should convert Braille to text', () => {
    expect(brailleToText('⠓⠑⠇⠇⠕')).toBe('hello');
    expect(brailleToText('⠺⠕⠗⠇⠙')).toBe('world');
    expect(brailleToText('⠂⠆⠒')).toBe('123');
    expect(brailleToText(' ')).toBe(' ');
    expect(brailleToText('')).toBe('');
    expect(brailleToText('⠞⠓⠊⠎ ⠊⠎ ⠁ ⠞⠑⠎⠞')).toBe('this is a test');
  });
});