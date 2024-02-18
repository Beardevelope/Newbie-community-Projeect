const loginButton = document.querySelector('#loginButton')
const signupButton = document.querySelector('#signupButton')
const logoutButton = document.querySelector('#logoutButton')

/**
 * 경로 지정
 * html 파일들 하나하나 수정하느니 그냥 js로 하나로 통합하기
 */

loginButton.addEventListener('click', () => {
    window.location.href = '../../Auth/auth.html'; //나중에 ip로 경로 관리
})
signupButton.addEventListener('click', () => {
    window.location.href = '../../Auth/auth.html'; //나중에 ip로 경로 관리
})

/**
 * 로그인 했을 경우 수정
 */

const isLogin = sessionStorage.getItem('accessToken')
if (isLogin) {
    loginButton.style.display = 'none';
    signupButton.style.display = 'none';
    logoutButton.style.display = 'inline-block';
}

logoutButton.addEventListener('click', function () {
    sessionStorage.removeItem('accessToken');
    loginButton.style.display = 'inline-block';
    signupButton.style.display = 'inline-block';
    logoutButton.style.display = 'none';
  });