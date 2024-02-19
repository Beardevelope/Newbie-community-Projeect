/**회원가입 및 로그인 */
const forms = document.querySelector('.forms'),
    pwShowHide = document.querySelectorAll('.eye-icon'),
    links = document.querySelectorAll('.link');

const signupButton = document.querySelector('#signup');
const email = document.querySelector('.email');
const password = document.querySelector('.signup-password');
const confirmPassword = document.querySelector('.confirm-password');
const nickname = document.querySelector('.nickname');

const loginButton = document.querySelector('#login');
const loginEmail = document.querySelector('.login-email');
const loginPassword = document.querySelector('.login-password');

const googleButton = document.querySelector('.field.google')

const signup = async () => {
    try {
        const data = {
            email: email.value,
            password: password.value,
            passwordConfirm: confirmPassword.value,
            nickname: nickname.value,
        };
        const response = await fetch(`/user/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const responseData = await response.json();

        if (!response.ok) alert(`${responseData.message}`);
        if (response.ok) {
            alert(`회원가입 성공`);
            forms.classList.toggle('show-signup');
        }
    } catch (error) {
        console.error(error);
        alert('서버 에러');
        window.location.href = 'server-error';
    }
};

const login = async () => {
    try {
        console.log('login2')
        const data = {
            email: loginEmail.value,
            password: loginPassword.value,
        };
        console.log('data', data)
        const credentials = btoa(`${data.email}:${data.password}`);
        const token = `Basic ${credentials}`;
        console.log(token)
        console.log('before')
        const response = await fetch(`/auth/login`, {
            method: 'POST',
            headers: {
                Authorization: token,
            },
        });
        console.log('after');
        const responseData = await response.json();
        if (!response.ok) alert(`${responseData.message}`);

        if (response.ok) {
            alert(`로그인 성공`);
            sessionStorage.setItem('accessToken', responseData.accessToken)
            window.location.href = './';
        }
    } catch (error) {
        alert('서버 에러');
        console.error(error)
    }
};

const googleLogin = async () => {
    try {
        window.location.href = '/auth/to-google'
    } catch (error) {
        console.error(error)
        alert('사바 에러')
    }
}

document.addEventListener("DOMContentLoaded", async () => {

    pwShowHide.forEach((eyeIcon) => {
        eyeIcon.addEventListener('click', () => {
            let pwFields = eyeIcon.parentElement.parentElement.querySelectorAll('.password');

            pwFields.forEach((password) => {
                if (password.type === 'password') {
                    password.type = 'text';
                    eyeIcon.classList.replace('bx-hide', 'bx-show');
                    return;
                }
                password.type = 'password';
                eyeIcon.classList.replace('bx-show', 'bx-hide');
            });
        });
    });

    links.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); //preventing form submit
            forms.classList.toggle('show-signup');
        });
    });
    signupButton.addEventListener('click', signup);
    loginButton.addEventListener('click', async () => {
        await login()
    });
    googleButton.addEventListener('click', googleLogin)
})



