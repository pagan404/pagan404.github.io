const textToBraille = require('../braille2 contractions.js').textToBraille;

describe('Braille Translation', () => {
  it('should convert text to Braille', () => {
    expect(textToBraille("This is a test")).toBe("⠠⠞⠓⠊⠎⠀⠊⠎⠀⠁⠀⠞⠑⠎⠞");
    expect(textToBraille("Lorem Ipsum")).toBe("⠠⠇⠕⠗⠑⠍⠀⠠⠊⠏⠎⠥⠍");
    expect(textToBraille("HELLO WORLD")).toBe("⠠⠠⠓⠑⠇⠇⠕⠀⠠⠠⠺⠕⠗⠇⠙");
    expect(textToBraille("hello world")).toBe("⠓⠑⠇⠇⠕⠀⠺⠕⠗⠇⠙");
    expect(textToBraille("Hello, World!")).toBe("⠠⠓⠑⠇⠇⠕⠂⠀⠠⠺⠕⠗⠇⠙⠖");
    expect(textToBraille("123")).toBe("⠼⠂⠆⠒");
    expect(textToBraille("!@#$%^&*(),")).toBe("⠖⠈⠁⠨⠼⠈⠎⠨⠴⠈⠢⠈⠯⠐⠔⠐⠣⠐⠜⠂");
    expect(textToBraille("Mixed123")).toBe("⠠⠍⠊⠭⠑⠙⠼⠂⠆⠒");
    expect(textToBraille("Mixed123!")).toBe("⠠⠍⠊⠭⠑⠙⠼⠂⠆⠒⠖");
    expect(textToBraille(" ")).toBe("⠀");
    expect(textToBraille("")).toBe("");
    expect(textToBraille("LOREM Ipsum asphalt but every more, have conceiving beyond already, ever father know,")).toBe("⠠⠠⠇⠕⠗⠑⠍⠀⠠⠊⠏⠎⠥⠍⠀⠵⠏⠓⠁⠇⠞⠀⠃⠀⠑⠀⠍⠂⠀⠓⠀⠒⠉⠧⠛⠀⠃⠽⠀⠁⠇⠗⠂⠀⠐⠑⠀⠐⠋⠀⠐⠅⠂");
  });
});
