const USER_API = 'http://localhost:3000/user'
const USER_ID = 1
const TOKEN ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidHlwZSI6ImFjY2VzcyIsImlhdCI6MTcwNjcwMDQwOSwiZXhwIjoxNzA2NzAwNzA5fQ.TkfteEkduOWAPgonLSFmiuj3Xy60xSXkyLWOB_FKaTU"

const email = document.querySelector('#email')
const nickname = document.querySelector('#nickname')
const password = document.querySelector('#password')
const passwordConfirm = document.querySelector('#passwordConfirm')
const modifyButton = document.querySelector('#modify-button')
console.log(TOKEN)
const modifyUserInfo = async () => {
    try {
        const data = {
            email: email.value,
            password: password.value,
            passwordConfirm: passwordConfirm.value,
            nickname: nickname.value,
        };
        const response = await fetch(`${USER_API}/${USER_ID}/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`
            },
            body: JSON.stringify(data),
        });
        console.log(response)
    
        const responseData = await response.json();
        if (!response.ok) alert(`${responseData.message}`);
        if (response.ok) {
            alert(`유저 정보 수정 성공`);
            window.location.href = './mainpage.html';
        }
    } catch (error) {
        console.log(error.message)
        alert(error)
    }
    
}

modifyButton.addEventListener("click", modifyUserInfo)