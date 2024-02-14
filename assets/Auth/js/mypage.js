function logout() {
    // Add your logout logic here
    alert('Logout button clicked!');
}

const USER_API = 'http://localhost:3000/user'
const USER_ID = 1
const TOKEN = sessionStorage.getItem('accessToken') || `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidHlwZSI6ImFjY2VzcyIsImlhdCI6MTcwNjc2MDQ3NiwiZXhwIjoxNzA2NzYwNzc2fQ.j5dxoMx--o6U2KRir4dm7013p4fszOUqVvH0CGmq2BI`

const profileImage = document.querySelector("#profileImage")
const email = document.querySelector('#email')
const nickname = document.querySelector("#NICKNAME")
const password = document.querySelector('#PASSWORD')
const passwordConfirm = document.querySelector("#PASSWORDCONFIRM")
const name = document.querySelector('#NAME')
const contact = document.querySelector("#CONTACT")
const modifyButton = document.querySelector(".fixbutton")

const postTitle = document.querySelector("#post-title")
const postLike = document.querySelector("#post-like")
const postView = document.querySelector("#post-view")

const postBoxes = document.querySelector(".post-boxes")
const postProjectBoxes = document.querySelector(".postProject-boxes")


const projectTitle = document.querySelector(".title")
const projectLike = document.querySelector(".like")
const projectView = document.querySelector(".view")

const POST_API = 'http://localhost:3000/post';

const getPost = async () => {
    const response = await fetch(`${POST_API}/${POST_ID}`, {
        method: "GET",
    })
    const data = await response.json()
    if (!response.ok) {
        alert(`${data.message}`)
        throw new Error('서버 오류')
    }
    return data.post
}

const getUserIdByToken = async () => {

}

const defaultDisplay = async () => {
    try {
        const response = await fetch(`${USER_API}/userinfo`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${TOKEN}`,
            },
        });
        
        const responseData = await response.json();
        console.log(responseData)

        const posts = responseData.posts
        const postProject = responseData.projectPost
        if (!response.ok) {
            alert(`${responseData.message}`);
            throw new Error('서버 에러')
        }

        if (response.ok) {
            email.placeholder = responseData.email
            nickname.placeholder = responseData.nickname
            password.placeholder = "*******"
            passwordConfirm.placeholder = "********"
            name.placeholder = responseData.name || "-"
            contact.placeholder = responseData.contact || '-'
            
            
            posts.forEach((post) => {
                const box = document.createElement('div')
                const hr = document.createElement('hr')
                box.className = 'box1'

                box.innerHTML = `
                <div class="imgBox">
                    <img src="${post.image}" alt="" />
                </div>
                <div class="posts">
                    <div class="post">
                        <div class="title">${post.title}</div>
                        <div class="likeAndview">
                            <div class="like">
                                ${post.likes}
                                <img src="./images/like.png" />
                            </div>
                            <div class="view">
                                ${post.hitCount}
                                <img src="./images/view.png" />
                            </div>
                        </div>
                    </div>
                    <div></div>
                </div>

                `
                postBoxes.appendChild(box)
                postBoxes.appendChild(hr)
            })

            postProject.forEach((post) => {
                console.log(post)
                const box = document.createElement('div')
                const hr = document.createElement('hr')
                box.className = 'box1'

                box.innerHTML = `
                <div class="imgBox">
                    <img src="${post.image}" alt="" />
                </div>
                <div class="posts">
                    <div class="post">
                        <div class="title">${post.title}</div>
                        <div class="likeAndview">
                            <div class="like">
                                ${post.likes}
                                <img src="./images/like.png" />
                            </div>
                            <div class="view">
                                ${post.hitCount}
                                <img src="./images/view.png" />
                            </div>
                        </div>
                    </div>
                    <div></div>
                </div>

                `
                postProjectBoxes.appendChild(box)
                postProjectBoxes.appendChild(hr)
            })
            
        }
    } catch (error) {
        alert('서버 에러');
        console.error(error)
    }
}

const modifyUserInfo = async () => {
    try {
        const data = {
            email: email.value,
            password: password.value,
            passwordConfirm: password.value,
            nickname: nickname.value
        };

        const response = await fetch(`${USER_API}/${USER_ID}/update`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${TOKEN}`,
            },
            body: JSON.stringify(data)
        });
        console.log(data);
        const responseData = await response.json();
        if (!response.ok) alert(`${responseData.message}`);

        if (response.ok) {
            sessionStorage.setItem('accessToken', responseData.accessToken)
            alert(`수정 완료`);
        }
    } catch (error) {
        alert('서버 에러');
        console.error(error)
    }
};

modifyButton.addEventListener('click', modifyUserInfo)
defaultDisplay()