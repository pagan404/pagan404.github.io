import { EncodingsInterface } from './encodings/EncodingsInterface.js';

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  const encodingsInterface = new EncodingsInterface();
  encodingsInterface.init();
});
