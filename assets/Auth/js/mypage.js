function logout() {
    // Add your logout logic here
    alert('Logout button clicked!');
}

const USER_API = '/user';
const TOKEN =
    sessionStorage.getItem('accessToken') ||
    `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidHlwZSI6ImFjY2VzcyIsImlhdCI6MTcwNjc2MDQ3NiwiZXhwIjoxNzA2NzYwNzc2fQ.j5dxoMx--o6U2KRir4dm7013p4fszOUqVvH0CGmq2BI`;

const uploadImage = document.getElementById('uploadImage');
const fileInput = document.getElementById('fileInput');
const email = document.querySelector('#email');
const nickname = document.querySelector('#NICKNAME');
const password = document.querySelector('#PASSWORD');
const passwordConfirm = document.querySelector('#PASSWORDCONFIRM');
const modifyButton = document.querySelector('.fixbutton');

const postTitle = document.querySelector('#post-title');
const postLike = document.querySelector('#post-like');
const postView = document.querySelector('#post-view');

const postBoxes = document.querySelector('.post-boxes');
const postProjectBoxes = document.querySelector('.postProject-boxes');

const projectTitle = document.querySelector('.title');
const projectLike = document.querySelector('.like');
const projectView = document.querySelector('.view');

const POST_API = '/post';

const verfyEmailButton = document.querySelector('.email-verify')

const getPost = async () => {
    const response = await fetch(`${POST_API}/${POST_ID}`, {
        method: 'GET',
    });
    const data = await response.json();
    if (!response.ok) {
        alert(`${data.message}`);
        throw new Error('서버 오류');
    }
    return data.post;
};

const defaultDisplay = async () => {
    try {
        const response = await fetch(`${USER_API}/userinfo`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${TOKEN}`,
            },
        });

        const responseData = await response.json();
        console.log(responseData);
        const USER_ID = responseData.id;
        const posts = responseData.posts;
        const postProject = responseData.projectPost;
        if (!response.ok) {
            alert(`${responseData.message}`);
            throw new Error('서버 에러');
        }

        if (response.ok) {
            email.placeholder = responseData.email;
            nickname.placeholder = responseData.nickname;
            password.placeholder = '*******';
            passwordConfirm.placeholder = '********';
            uploadImage.src =
                responseData.profileImage || './images/KakaoTalk_20240219_035136481.png';

            posts.forEach((post) => {
                const box = document.createElement('div');
                const hr = document.createElement('hr');
                box.className = 'box1';

                box.innerHTML = `
                <div class="imgBox">
                    <img src="${post.image}" alt="" />
                </div>
                    <div class="title">${post.title}</div>
                    <div class="viewAndLike">
                        <div class="views">
                            <div class="view">
                                <img src="./images/view.png" alt="" />
                            </div>
                            <div>${post.hitCount}</div>
                        </div>
                        <div class="likes">
                            <div class="like">
                                <img src="./images/like.png" alt="" />
                            </div>
                            <div>${post.likes}</div>
                        </div>
                    </div>
                </div>

                `;
                postBoxes.appendChild(box);
            });
        }

        const uploadUserProfile = async (data) => {
            const response = await fetch(`${USER_API}/profile/${USER_ID}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
                body: data,
            });
            const responseJson = await response.json();
            if (!response.ok) {
                alert(`${data.message}`);
                throw new Error('서버 오류');
            }
            if (response.ok) {
                alert(`${data.message}`);
                location.reload();
            }
            return responseJson;
        };

        const modifyUserInfo = async () => {
            try {
                const data = {
                    email: email.value,
                    password: password.value,
                    passwordConfirm: password.value,
                    nickname: nickname.value,
                };
                const response = await fetch(`${USER_API}/${USER_ID}/update`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${TOKEN}`,
                    },
                    body: JSON.stringify(data),
                });
                const responseData = await response.json();
                if (!response.ok) alert(`${responseData.message}`);

                if (response.ok) {
                    alert(`${responseData.message}`);
                    location.reload();
                }
            } catch (error) {
                alert('서버 에러');
                console.error(error);
            }
        };

        modifyButton.addEventListener('click', modifyUserInfo);
        uploadImage.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', async (event) => {
            const selectedFile = event.target.files[0];

            const formData = new FormData();
            formData.append('image', selectedFile);
            await uploadUserProfile(formData);
        });

        verfyEmailButton.addEventListener('click', async () => {
            const email = prompt('이메일을 입력해주세요:')
            const data = {
                email: email
            }
            const response = await fetch('/email/send-verification-email', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${TOKEN}`,
                },
                body: JSON.stringify(data),
            })
            const responseJson = await response.json()
            console.log(responseJson)
            if (!response.ok) {
                alert(responseJson.message)
            }
            if (response.ok) {
                alert(responseJson.message)
            }
        })


    } catch (error) {
        alert('서버 에러');
        console.error(error);
    }
};

defaultDisplay();
