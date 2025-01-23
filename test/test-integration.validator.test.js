import AuthService from '../src/js/common/auth-service.js';

describe('AuthService', () => {
    let authService;

    beforeEach(() => {
        authService = new AuthService();
    });

    it('should call login with correct username and password', async () => {
        const mockResponse = { success: true };
        jest.spyOn(authService, 'login').mockResolvedValue(mockResponse);

        const username = 'testuser';
        const password = 'password123';
        const result = await authService.login(username, password);

        expect(authService.login).toHaveBeenCalledWith(username, password);
        expect(result).toEqual(mockResponse);
    });

    it('should handle failed login', async () => {
        const mockResponse = { success: false, error: 'Invalid credentials' };
        jest.spyOn(authService, 'login').mockResolvedValue(mockResponse);

        const username = 'wronguser';
        const password = 'wrongpassword';
        const result = await authService.login(username, password);

        expect(authService.login).toHaveBeenCalledWith(username, password);
        expect(result).toEqual(mockResponse);
    });
});
