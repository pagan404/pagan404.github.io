import { textToBrailleContractions } from "../braille2_contractions.js";

describe('Braille Translation', () => {
  it('should convert text to Braille', () => {
    expect(textToBrailleContractions("This is a test")).toBe("⠠⠞⠓⠊⠎⠀⠊⠎⠀⠁⠀⠞⠑⠎⠞");
    expect(textToBrailleContractions("Lorem Ipsum")).toBe("⠠⠇⠕⠗⠑⠍⠀⠠⠊⠏⠎⠥⠍");
    expect(textToBrailleContractions("HELLO WORLD")).toBe("⠠⠠⠓⠑⠇⠇⠕⠀⠠⠠⠺⠕⠗⠇⠙");
    expect(textToBrailleContractions("hello world")).toBe("⠓⠑⠇⠇⠕⠀⠺⠕⠗⠇⠙");
    expect(textToBrailleContractions("Hello, World!")).toBe("⠠⠓⠑⠇⠇⠕⠂⠀⠠⠺⠕⠗⠇⠙⠖");
    expect(textToBrailleContractions("123")).toBe("⠼⠂⠆⠒");
    expect(textToBrailleContractions("!@#$%^&*(),")).toBe("⠖⠈⠁⠨⠼⠈⠎⠨⠴⠈⠢⠈⠯⠐⠔⠐⠣⠐⠜⠂");
    expect(textToBrailleContractions("Mixed123")).toBe("⠠⠍⠊⠭⠑⠙⠼⠂⠆⠒");
    expect(textToBrailleContractions("Mixed123!")).toBe("⠠⠍⠊⠭⠑⠙⠼⠂⠆⠒⠖");
    expect(textToBrailleContractions(" ")).toBe("⠀");
    expect(textToBrailleContractions("")).toBe("");
    expect(textToBrailleContractions("LOREM Ipsum asphalt but every more, have conceiving beyond already, ever father know,")).toBe("⠠⠠⠇⠕⠗⠑⠍⠀⠠⠊⠏⠎⠥⠍⠀⠵⠏⠓⠁⠇⠞⠀⠃⠀⠑⠀⠍⠂⠀⠓⠀⠒⠉⠧⠛⠀⠃⠽⠀⠁⠇⠗⠂⠀⠐⠑⠀⠐⠋⠀⠐⠅⠂");
  });
});
