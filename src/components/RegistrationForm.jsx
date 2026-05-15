import React, { useEffect, useRef, useState } from 'react'
import './RegistrationForm.css'

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

    const  pageLoadTime = useRef(Date.now())
    const firstInteractionTime=useRef(null)
    const lastKeystrokeTime= useRef(null)
    const submitAttempts = useRef(0)

    useEffect(()=>{
        const saved = localStorage.getItem('registrationDate')

        if(saved){
            try{
                const date = JSON.parse(saved)
                if(date.username) setUsername(date.username)
                 if(date.phone) setPhone(date.phone)
                 if(date.email) setEmail(date.email)
                alert('с возвращением')
            } catch (e){
        console.log('ошибка чтения локал сторедж', e)}
        }
    }, [])

    function markInteraction (){
        const now = Date.now()
        if(firstInteractionTime.current === null){
            firstInteractionTime.current = now
        }
        lastKeystrokeTime.current = now
    }

    function checkSpamProtection() {
        const now = Date.now()
        const timeSincePageLoad = now - pageLoadTime.current
        if(timeSincePageLoad < 3000){
            return {isSpam: true, message: 'Ознакомьтесь с формой перед заполнением. Потом попробуй'}
        }

        if(firstInteractionTime.current !== null){
            const fillDuration = now - firstInteractionTime.current
            if(fillDuration < 2000){
                return {
                    isSpam: true,
                    message: 'Не спеши)'
                }
            }
        }

       

        submitAttempts.current += 1
        if(submitAttempts.current > 3){
            return {
                    isSpam: true,
                    message: 'Слишком много попыток отправки. Жди сука'
                }
        }

        return {
            isSpam: false,
            message: ''
        }
    }

    function handleSubmit(event){
        event.preventDefault()
        const spamCheck = checkSpamProtection()
        if(spamCheck.isSpam){
            alert(spamCheck.message)
            return;
        }

        
            const usernameErr = validateUserName(username)
            const emailErr = validateEmail(email)
            const phoneErr = validatePhone(phone)
            const passwordErr = validatePassword(password)
            const confirmPasswordErr = validateConfirmPassword(confirmPassword)

            if(usernameErr || emailErr || phoneErr || passwordErr || confirmPasswordErr){
                setErrors({
                    username: usernameErr,
                    email: emailErr,
                    phone: phoneErr,
                    password: passwordErr,
                    confirmPassword: confirmPasswordErr
                })

                setTouched({ username: true, email: true, phone: true, password: true, confirmPassword: true })

                alert('Пожалуйста, исправьте ошибки в форме')
                return

            }
        

        const dataToSave = {
            username: username,
            email: email,
            phone: phone,
            savedAt: new Date().toISOString()
        }

        localStorage.setItem('registrationDate', JSON.stringify(dataToSave))
        alert(`Отбор пройден`)

        submitAttempts.current = 0;

         setUsername(''); setEmail(''); setPhone(''); setPassword(''); setConfirmPassword('')
    setTouched({ username: false, email: false, phone: false, password: false, confirmPassword: false })
    setPasswordStrength({ score: 0, label: '', color: '#ddd' })
    setErrors({ username: '', email: '', phone: '', password: '', confirmPassword: '' })
    }

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
        if( !/^\+\d{10,12}$/.test(cleaned) ) {
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
    

    function validateConfirmPassword(value) {
        if(value.length === 0) {
            return 'Подтвердите пароль'
        }
        if(value !== password) {
            return 'Пароли не совпадают'
        }
        return '';
    }

    function handleChange(fieldName) {
        return function(event){
            markInteraction()
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
                    setPasswordStrength(calculatePasswordStrength(value))
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
        <form onSubmit={handleSubmit}>
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
                type="tel"
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
                {password && (
                    <div className="password-strength">
                        <div className="strength-bar-bg">
                            <div className="strength-bar-fill"
                            style={
                                {width: `${(passwordStrength.score / 7) * 100}%`,
                                backgroundColor: passwordStrength.color,
                                transition: 'width 0.3s ease, background-color 0.3s ease'}
                                }/>

                           
                        </div>
                        <span style={{color: passwordStrength.color,}}>
                            {passwordStrength.label}
                        </span>
                    </div>
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

            <button type="submit" className='submit-btn'>Отравить</button>
        </form>
    </div>
  )
}
