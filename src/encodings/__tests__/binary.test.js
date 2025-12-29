import { decimalToBinary, textToBinary, binaryToDecimal, binaryToText } from '../binary.js';

describe('decimalToBinary', () => {
  it('should convert decimal to binary', () => {
    expect(decimalToBinary(10)).toBe('00001010');
    expect(decimalToBinary(255)).toBe('11111111');
    expect(decimalToBinary(0)).toBe('00000000');
    expect(decimalToBinary(-5)).toBe("Please enter a valid, whole, non-negative number!");
    expect(decimalToBinary(3.14)).toBe("Please enter a valid, whole, non-negative number!");
    expect(decimalToBinary('abc')).toBe("Please enter a valid, whole, non-negative number!");
  });
});

describe('textToBinary', () => {
  it('should convert text to binary', () => {
    expect(textToBinary('A')).toBe('01000001');
    expect(textToBinary('Hello')).toBe('01001000 01100101 01101100 01101100 01101111');
    expect(textToBinary('0')).toBe('00110000');
    expect(textToBinary(' ')).toBe('00100000');
    expect(textToBinary('')).toBe('');
    expect(textToBinary(123)).toBe("Input must be a string");
  });
});

describe('binaryToDecimal', () => {
  it('should convert binary to decimal', () => {
    expect(binaryToDecimal('1010')).toBe('10');
    expect(binaryToDecimal('11111111')).toBe('255');
    expect(binaryToDecimal('0')).toBe('0');
    expect(binaryToDecimal('abc')).toBe("Please enter a valid binary string");
    expect(binaryToDecimal('123')).toBe("Please enter a valid binary string");
    expect(binaryToDecimal('')).toBe("Please enter a valid binary string");
    expect(binaryToDecimal('   1010   ')).toBe('10'); // Test with leading/trailing spaces
    expect(binaryToDecimal('001000110')).toBe('70'); // Test with leading zeros
  });
});

describe('binaryToText', () => {
  it('should convert binary to text', () => {
    expect(binaryToText('01000001')).toBe('A');
    expect(binaryToText('01001000 01100101 01101100 01101100 01101111')).toBe('Hello');
    expect(binaryToText('00110000')).toBe('0');
    expect(binaryToText('00100000')).toBe(' ');
    expect(binaryToText('')).toBe("Please enter a valid binary string");
    expect(binaryToText('abc')).toBe("Please enter a valid binary string");
  });
});
