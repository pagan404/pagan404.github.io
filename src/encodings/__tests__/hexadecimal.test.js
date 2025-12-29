import { decimalToHex, hexToDecimal } from '../hexidecimal.js';

describe('decimalToHex', () => {
  it('should convert decimal to hex', () => {
    expect(decimalToHex(10)).toBe('A');
    expect(decimalToHex(255)).toBe('FF');
    expect(decimalToHex(0)).toBe('0');
    expect(decimalToHex(16)).toBe('10');
    expect(decimalToHex(31)).toBe('1F');
    expect(decimalToHex(-5)).toBe("Please enter a valid, whole, non-negative number!");
    expect(decimalToHex(3.14)).toBe("Please enter a valid, whole, non-negative number!");
    expect(decimalToHex('abc')).toBe("Please enter a valid, whole, non-negative number!");
  });
});

describe('hexToDecimal', () => {
  it('should convert hex to decimal', () => {
    expect(hexToDecimal('A')).toBe(10);
    expect(hexToDecimal('FF')).toBe(255);
    expect(hexToDecimal('0')).toBe(0);
    expect(hexToDecimal('10')).toBe(16);
    expect(hexToDecimal('1F')).toBe(31);
    expect(hexToDecimal('-5')).toBe("Please enter a valid hex string");
    expect(hexToDecimal('3.14')).toBe("Please enter a valid hex string");
    expect(hexToDecimal('xyz')).toBe("Please enter a valid hex string");
  });
});
