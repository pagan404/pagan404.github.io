const textToMorse = require('../morse').textToMorse;
const morseToText = require('../morse').morseToText;

describe('textToMorse', () => {
  it('should convert text to Morse code', () => {
    expect(textToMorse('hello')).toBe('.... . .-.. .-.. ---');
    expect(textToMorse('world')).toBe('.-- --- .-. .-.. -..');
    expect(textToMorse('123')).toBe('.---- ..--- ...--');
    expect(textToMorse(' ')).toBe(' ');
    expect(textToMorse('')).toBe('');
    expect(textToMorse('This is a test')).toBe('- .... .. ...   .. ...   .-   - . ... -');
  });
});

describe('morseToText', () => {
  it('should convert Morse code to text', () => {
    expect(morseToText('.... . .-.. .-.. ---')).toBe('hello');
    expect(morseToText('.-- --- .-. .-.. -..')).toBe('world');
    expect(morseToText('.---- ..--- ...--')).toBe('123');
    expect(morseToText('- .... .. ...  .. ...  .-  - . ... -')).toBe('this is a test');
  });
});