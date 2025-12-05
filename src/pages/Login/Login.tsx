import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import logoSrc from '@/assets/lendsqr-logo.svg';
import illustrationSrc from '@/assets/login-illustration.svg';
import './Login.scss';

type Field = 'email' | 'password';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [values, setValues] = useState<Record<Field, string>>({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<Record<Field, string>>({
        email: '',
        password: '',
    });
    const [touched, setTouched] = useState<Record<Field, boolean>>({
        email: false,
        password: false,
    });

    const validateField = (field: Field, value: string) => {
        const trimmedValue = value.trim();

        if (field === 'email') {
            if (!trimmedValue) {
                return 'Email is required.';
            }

            if (!EMAIL_PATTERN.test(trimmedValue)) {
                return 'Enter a valid email address.';
            }

            return '';
        }

        if (!trimmedValue) {
            return 'Password is required.';
        }

        if (trimmedValue.length < MIN_PASSWORD_LENGTH) {
            return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
        }

        return '';
    };

    const handleChange =
        (field: Field) => (event: ChangeEvent<HTMLInputElement>) => {
            const { value } = event.target;

            setValues((prev) => ({
                ...prev,
                [field]: value,
            }));

            if (touched[field]) {
                setErrors((prev) => ({
                    ...prev,
                    [field]: validateField(field, value),
                }));
            }
        };

    const handleBlur = (field: Field) => () => {
        setTouched((prev) => ({
            ...prev,
            [field]: true,
        }));

        setErrors((prev) => ({
            ...prev,
            [field]: validateField(field, values[field]),
        }));
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextTouched: Record<Field, boolean> = {
            email: true,
            password: true,
        };

        setTouched(nextTouched);

        const nextErrors: Record<Field, string> = {
            email: validateField('email', values.email),
            password: validateField('password', values.password),
        };

        setErrors(nextErrors);

        const hasErrors = Object.values(nextErrors).some(Boolean);

        if (hasErrors) {
            return;
        }

        navigate('/dashboard');
    };

    const emailError = touched.email && Boolean(errors.email);
    const passwordError = touched.password && Boolean(errors.password);
    const isSubmitDisabled =
        Boolean(validateField('email', values.email)) ||
        Boolean(validateField('password', values.password));

    return (
        <div className='login'>
            <section className='login__visual'>
                <img
                    src={logoSrc}
                    alt='Lendsqr'
                    className='login__logo'
                    loading='lazy'
                />

                <img
                    src={illustrationSrc}
                    alt='People connecting to financial tools'
                    className='login__illustration'
                    loading='lazy'
                />
            </section>

            <section className='login__content'>
                <img
                    src={logoSrc}
                    alt='Lendsqr'
                    className='login__logo login__logo--mobile'
                    loading='lazy'
                />

                <header className='login__header'>
                    <h1 className='login__title'>Welcome!</h1>
                    <p className='login__subtitle'>Enter details to login.</p>
                </header>

                <form
                    className='login__form'
                    onSubmit={handleSubmit}
                    noValidate>
                    <div
                        className={`login__field${
                            emailError ? ' login__field--error' : ''
                        }`}>
                        <div className='login__input-wrapper'>
                            <input
                                type='email'
                                name='email'
                                placeholder='Email'
                                className='login__input'
                                autoComplete='email'
                                value={values.email}
                                onChange={handleChange('email')}
                                onBlur={handleBlur('email')}
                                aria-invalid={emailError}
                                aria-describedby='login-email-error'
                            />
                        </div>
                        {emailError ? (
                            <span
                                id='login-email-error'
                                className='login__error'
                                role='alert'>
                                {errors.email}
                            </span>
                        ) : null}
                    </div>

                    <div
                        className={`login__field${
                            passwordError ? ' login__field--error' : ''
                        }`}>
                        <div className='login__input-wrapper'>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name='password'
                                placeholder='Password'
                                className='login__input'
                                autoComplete='current-password'
                                value={values.password}
                                onChange={handleChange('password')}
                                onBlur={handleBlur('password')}
                                aria-invalid={passwordError}
                                aria-describedby='login-password-error'
                            />
                            <button
                                type='button'
                                className='login__toggle'
                                onClick={() =>
                                    setShowPassword((prev) => !prev)
                                }>
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        {passwordError ? (
                            <span
                                id='login-password-error'
                                className='login__error'
                                role='alert'>
                                {errors.password}
                            </span>
                        ) : null}
                    </div>

                    <p className='login__forgot'>Forgot password?</p>

                    <button
                        type='submit'
                        className='login__submit'
                        disabled={isSubmitDisabled}>
                        Log in
                    </button>
                </form>
            </section>
        </div>
    );
};

export default Login;
