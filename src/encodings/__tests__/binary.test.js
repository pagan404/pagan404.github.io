const decimalToBinary = require('../binary').decimalToBinary;
const binaryToDecimal = require('../binary').binaryToDecimal;

describe('decimalToBinary', () => {
  it('should convert decimal to binary', () => {
    expect(decimalToBinary(10)).toBe('1010');
    expect(decimalToBinary(255)).toBe('11111111');
    expect(decimalToBinary(0)).toBe('0');
    expect(decimalToBinary(-5)).toBe("Please enter a valid, whole, non-negative number!");
    expect(decimalToBinary(3.14)).toBe("Please enter a valid, whole, non-negative number!");
    expect(decimalToBinary('abc')).toBe("Please enter a valid, whole, non-negative number!");
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