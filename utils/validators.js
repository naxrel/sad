const validateRegistration = (username, password) => {
  if (!username || !password) {
    return { valid: false, message: 'Username and password are required' };
  }

  if (username.length < 3) {
    return { valid: false, message: 'Username must be at least 3 characters long' };
  }

  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters long' };
  }

  return { valid: true };
};

const validateLogin = (username, password) => {
  if (!username || !password) {
    return { valid: false, message: 'Username and password are required' };
  }

  return { valid: true };
};

module.exports = {
  validateRegistration,
  validateLogin
};
