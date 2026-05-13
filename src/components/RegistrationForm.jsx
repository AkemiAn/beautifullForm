import React, { useState } from 'react'

export default function RegistrationForm() {

    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        label: '',
        color: '#ddd'
    })
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errors, setErrors] = useState({
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    })

    const [touched, setTouched] = useState({
        username: false,
        email: false,
        phone: false,
        password: false,
        confirmPassword: false
    })

    


    function validateUserName(value) {
        if(value.trim().length === 0) {
            return 'Имя обязательно для заполнения'
        }
        if(value.trim().length < 2) {
            return 'Имя должно содержать минимум 2 символа'
        }
        if( /^\d/.test(value.trim()) ) {
            return 'Имя не может начинаться с цифры'
        }
        return '';
    }
    function validateEmail(value) {
        if(value.trim().length === 0) {
            return 'Email обязателен для заполнения'
        }
        const emailPattern = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/
        if( !emailPattern.test(value) ) {
            return 'Введите корректный Email'
        }
        return '';
    }
    function validatePhone(value) {
        if(value.trim().length === 0) {
            return 'Телефон обязателен для заполнения'
        }
        const cleaned = value.replace(/[\s\-()]/g, '')
        if( !/^\+&\d{10,12}$/.test(cleaned) ) {
            return 'Введите корректный номер'
        }
        return '';
    }

    function validatePassword(value) {
        if(value.length === 0) {
            return 'Пароль обязателен для заполнения'
        }
        if( value.length < 8) {
            return 'Пароль должен содержать минимум 8 символов'
        }
        if( !/[A-Z]/.test(value)) {
            return 'Пароль должен содержать хотябы одну заглавную букву'
        }
        if( !/[a-z]/.test(value)) {
            return 'Пароль должен содержать хотябы одну строчную букву'
        }
        if( !/[0-9]/.test(value)) {
            return 'Пароль должен содержать хотябы одну цифру'
        }
        return '';
    }

    function validateСоташкьPassword(value) {
        if(value.length === 0) {
            return 'Подтвердите пароль'
        }
        if(value.length !== password) {
            return 'Пароли не совпадают'
        }
        return '';
    }

    function handleChange(fieldName) {
        return function(event){
            const value = event.target.value;
            let error ='';

            switch (fieldName) {
                case 'username':
                    setUsername(value);
                    error = validateUserName(value);
                    break;
                case 'email':
                    setEmail(value);
                    error = validateEmail(value);
                    break;
                case 'phone':
                    setPhone(value);
                    error = validatePhone(value);
                    break;
                case 'password':
                    setPassword(value);
                    error = validatePassword(value);
                    break;
                case 'confirmPassword':
                    setConfirmPassword(value);
                    error = validateConfirmPassword(value);
                    break;
            }

            setErrors(prev => ({
                ...prev,
                [fieldName]: error

            }));
        }
    }

    function handleBlur(fieldName){
        return function() {
            setTouched(prev => ({
                ...prev,
                [fieldName]: true
            }))
        }
    }

    function calculatePasswordStrength(pwd) {
        if (pwd.length === 0) {
            return { score: 0, label: '', color: '#ddd'};
        }
        let score = 0;

        if (pwd.length >=8) score++;
        if (pwd.length >=12) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[a-z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[!@#$%^&*]/.test(pwd)) score++;
        if (/[^A-Za-z0-9!@#$%^&*]/.test(pwd)) score++;

        if (score <=2) return {score, label: 'Хуйня, переделывай', color:'red'};
        if (score <=3) return {score, label: 'Стрем, переделывай', color:'orange'};
        if (score <=4) return {score, label: 'Норм', color:'yellow'};
        if (score <=5) return {score, label: 'Заебца', color:'green'};
        return {score, label: 'УЛЬТРА ЗАЕБИСЬ', color:'green'};
        
    }


 

  return (
    <div className='form-container'>
        <h1>Регистрация</h1>
        <form>
            <div className="form-field">
                <label htmlFor="username">Имя пользователя *</label>
                <input 
                type="text"
                id='username' 
                placeholder='Введите ваше имя'
                value={username}
                onChange={handleChange('username')}
                onBlur={handleBlur('username')}/>
                {touched.username && errors.username && (
                    <span className='error-message'>{errors.username}</span>
                )}
            </div>

             <div className="form-field">
                <label htmlFor="email">Email *</label>
                <input 
                type="email"
                id='email' 
                placeholder='Введите ваш Email'
                value={email}
                onChange={handleChange('email')}
                onBlur={handleBlur('email')}/>
                {touched.email && errors.email && (
                    <span className='error-message'>{errors.email}</span>
                )}
            </div>

            <div className="form-field">
                <label htmlFor="phone">Телефон *</label>
                <input 
                type="phone"
                id='phone' 
                placeholder='Введите ваш телефон'
                value={phone}
                onChange={handleChange('phone')}
                onBlur={handleBlur('phone')}/>
                {touched.phone && errors.phone && (
                    <span className='error-message'>{errors.phone}</span>
                )}
            </div>

            <div className="form-field">
                <label htmlFor="password">Пароль *</label>
                <input 
                type="password"
                id='password' 
                placeholder='Введите пароль'
                value={password}
                onChange={handleChange('password')}
                onBlur={handleBlur('password')}/>
                {touched.password && errors.password && (
                    <span className='error-message'>{errors.password}</span>
                )}
            </div>
            <div className="form-field">
                <label htmlFor="confirmPassword">Подтвердите пароль *</label>
                <input 
                type="password"
                id='confirmPassword' 
                placeholder='Повторите пароль'
                value={confirmPassword}
                onChange={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}/>
                {touched.confirmPassword && errors.confirmPassword && (
                    <span className='error-message'>{errors.confirmPassword}</span>
                )}
            </div>
        </form>
    </div>
  )
}
