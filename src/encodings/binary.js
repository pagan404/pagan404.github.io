// The scripts converts decimal numbers to binary and vice versa

// Function to convert from decimal to binary

function decimalToBinary(number) {
    if (!Number.isInteger(number) || number < 0) {
        return "Please enter a valid, whole, non-negative number!";
    }
    let binaryText = '';
    if (number > 0) {
        while (number > 0) {
            if (number % 2 === 0) {
                binaryText = '0' + binaryText;
            } else {
                binaryText = '1' + binaryText;
                number -= 1;
            }
            number = Math.floor(number / 2);
        }
    } else {
        binaryText = '0';
    } 
    return binaryText;
}

// Logic to convert from binary to decimal

// Helper function to check if string contains only 1's and 0's
function isBinaryString(str) {
    return /^[01]+$/.test(str);
}

// Function to convert from binary to decimal
function binaryToDecimal(binary) {
    binary = binary.trim();
    if (!isBinaryString(binary)) {
        return "Please enter a valid binary string";
    }
    let number = 0;
    for (let digit of binary) {
        number = number * 2 + parseInt(digit, 10);
    }
    const number_str = number.toString(); 
    return number_str;
}

module.exports = {
    decimalToBinary,
    binaryToDecimal
};