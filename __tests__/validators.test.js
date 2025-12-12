const { validateRegistration, validateLogin } = require('../utils/validators');

describe('Validators', () => {
  describe('validateRegistration', () => {
    it('should return valid for correct input', () => {
      const result = validateRegistration('testuser', 'password123');
      expect(result.valid).toBe(true);
    });

    it('should fail for short username', () => {
      const result = validateRegistration('ab', 'password123');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('at least 3 characters');
    });

    it('should fail for short password', () => {
      const result = validateRegistration('testuser', '12345');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('at least 6 characters');
    });

    it('should fail for missing username', () => {
      const result = validateRegistration('', 'password123');
      expect(result.valid).toBe(false);
    });

    it('should fail for missing password', () => {
      const result = validateRegistration('testuser', '');
      expect(result.valid).toBe(false);
    });
  });

  describe('validateLogin', () => {
    it('should return valid for correct input', () => {
      const result = validateLogin('testuser', 'password');
      expect(result.valid).toBe(true);
    });

    it('should fail for missing username', () => {
      const result = validateLogin('', 'password');
      expect(result.valid).toBe(false);
    });

    it('should fail for missing password', () => {
      const result = validateLogin('testuser', '');
      expect(result.valid).toBe(false);
    });
  });
});
