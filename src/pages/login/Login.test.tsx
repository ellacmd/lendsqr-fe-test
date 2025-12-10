import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import Login from './Login';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const renderLogin = () => {
    return render(
        <MemoryRouter>
            <Login />
        </MemoryRouter>
    );
};

describe('Login Component', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
    });

    describe('Valid Input and User Interactions', () => {
        it('should render login form with all fields', () => {
            renderLogin();

            expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
            expect(
                screen.getByRole('button', { name: /log in/i })
            ).toBeInTheDocument();
        });

        it('should allow typing in email and password fields', () => {
            renderLogin();

            const emailInput = screen.getByPlaceholderText(
                'Email'
            ) as HTMLInputElement;
            const passwordInput = screen.getByPlaceholderText(
                'Password'
            ) as HTMLInputElement;

            fireEvent.change(emailInput, {
                target: { value: 'test@example.com' },
            });
            fireEvent.change(passwordInput, {
                target: { value: 'password123' },
            });

            expect(emailInput.value).toBe('test@example.com');
            expect(passwordInput.value).toBe('password123');
        });

        it('should toggle password visibility', () => {
            renderLogin();

            const passwordInput = screen.getByPlaceholderText(
                'Password'
            ) as HTMLInputElement;
            const toggleButton = screen.getByRole('button', { name: /show/i });

            expect(passwordInput.type).toBe('password');

            fireEvent.click(toggleButton);
            expect(passwordInput.type).toBe('text');
            expect(
                screen.getByRole('button', { name: /hide/i })
            ).toBeInTheDocument();
        });

        it('should submit form with valid email and password', async () => {
            renderLogin();

            const emailInput = screen.getByPlaceholderText('Email');
            const passwordInput = screen.getByPlaceholderText('Password');
            const submitButton = screen.getByRole('button', {
                name: /log in/i,
            });

            fireEvent.change(emailInput, {
                target: { value: 'test@example.com' },
            });
            fireEvent.change(passwordInput, {
                target: { value: 'password123' },
            });
            fireEvent.blur(emailInput);
            fireEvent.blur(passwordInput);

            await waitFor(() => {
                expect(submitButton).not.toBeDisabled();
            });

            const form = screen.getByPlaceholderText('Email').closest('form');
            if (form) {
                fireEvent.submit(form);
            }

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
            });
        });

        it('should not show errors when fields are valid', async () => {
            renderLogin();

            const emailInput = screen.getByPlaceholderText('Email');
            const passwordInput = screen.getByPlaceholderText('Password');

            fireEvent.change(emailInput, {
                target: { value: 'valid@email.com' },
            });
            fireEvent.change(passwordInput, {
                target: { value: 'validpass123' },
            });
            fireEvent.blur(emailInput);
            fireEvent.blur(passwordInput);

            await waitFor(() => {
                expect(
                    screen.queryByText(/email is required/i)
                ).not.toBeInTheDocument();
                expect(
                    screen.queryByText(/password is required/i)
                ).not.toBeInTheDocument();
            });
        });
    });

    describe('Validation and Error Handling', () => {
        it('should show error for empty email field', async () => {
            renderLogin();

            const emailInput = screen.getByPlaceholderText('Email');

            fireEvent.blur(emailInput);

            await waitFor(() => {
                expect(
                    screen.getByText(/email is required/i)
                ).toBeInTheDocument();
            });
        });

        it('should show error for invalid email format', async () => {
            renderLogin();

            const emailInput = screen.getByPlaceholderText('Email');

            fireEvent.change(emailInput, {
                target: { value: 'invalid-email' },
            });
            fireEvent.blur(emailInput);

            await waitFor(() => {
                expect(
                    screen.getByText(/enter a valid email address/i)
                ).toBeInTheDocument();
            });
        });

        it('should show error for empty password field', async () => {
            renderLogin();

            const passwordInput = screen.getByPlaceholderText('Password');

            fireEvent.blur(passwordInput);

            await waitFor(() => {
                expect(
                    screen.getByText(/password is required/i)
                ).toBeInTheDocument();
            });
        });

        it('should show error for password shorter than 6 characters', async () => {
            renderLogin();

            const passwordInput = screen.getByPlaceholderText('Password');

            fireEvent.change(passwordInput, { target: { value: '12345' } });
            fireEvent.blur(passwordInput);

            await waitFor(() => {
                expect(
                    screen.getByText(/password must be at least 6 characters/i)
                ).toBeInTheDocument();
            });
        });

        it('should disable submit button when form has errors', () => {
            renderLogin();

            const emailInput = screen.getByPlaceholderText('Email');
            const passwordInput = screen.getByPlaceholderText('Password');
            const submitButton = screen.getByRole('button', {
                name: /log in/i,
            });

            fireEvent.change(emailInput, { target: { value: 'invalid' } });
            fireEvent.change(passwordInput, { target: { value: '123' } });

            expect(submitButton).toBeDisabled();
        });

        it('should prevent form submission with invalid data', async () => {
            renderLogin();

            const emailInput = screen.getByPlaceholderText('Email');
            const passwordInput = screen.getByPlaceholderText('Password');
            const form = screen.getByPlaceholderText('Email').closest('form');

            fireEvent.change(emailInput, {
                target: { value: 'invalid-email' },
            });
            fireEvent.change(passwordInput, { target: { value: '123' } });
            if (form) {
                fireEvent.submit(form);
            }

            await waitFor(() => {
                expect(mockNavigate).not.toHaveBeenCalled();
            });
        });

        it('should trim email input and validate correctly', async () => {
            renderLogin();

            const emailInput = screen.getByPlaceholderText('Email');

            // Email with spaces should be trimmed and become valid
            fireEvent.change(emailInput, {
                target: { value: '  test@example.com  ' },
            });
            fireEvent.blur(emailInput);

            await waitFor(() => {
                expect(
                    screen.queryByText(/email is required/i)
                ).not.toBeInTheDocument();
                expect(
                    screen.queryByText(/enter a valid email address/i)
                ).not.toBeInTheDocument();
            });
        });
    });
});
