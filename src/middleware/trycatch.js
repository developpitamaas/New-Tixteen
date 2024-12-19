// Wrapper function to handle async/await errors
const Trycatch = (fn) => (req, res, next) => {
    // Resolve the function and catch any errors
    Promise.resolve(fn(req, res, next)).catch(next);
  };
  
  module.exports = Trycatch;
  