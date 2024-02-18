const contentBox = document.querySelector('.post-boxes');

// userId를 추출하는 함수
function extractUserId(token) {
    if (!token) {
        console.error('토큰이 없습니다.');
        return null;
    }
    try {
        // 토큰의 페이로드(payload)를 디코딩하여 사용자 정보를 추출합니다.
        const payload = token.split('.')[1];
        const decodedPayload = atob(payload);
        const userInfo = JSON.parse(decodedPayload);
        const userId = userInfo.id;
        return userId;
    } catch (error) {
        console.error('토큰에서 사용자 ID를 추출하는 중 에러 발생:', error);
        return null;
    }
}

const userId = extractUserId(TOKEN);

// 포스트 데이터 불러오기
let foundPosts = [];
async function postList() {
    try {
        const response = await fetch(`/post/myposts/${userId}`, {
            accept: 'application/json',
            headers: {
                Authorization: `Bearer ${TOKEN}`,
            },
        });
        const jsonData = await response.json();
        let posts = jsonData;

        posts.forEach((post) => {
            foundPosts.push(post);
        });
    } catch (error) {
        console.log(error.message);
        alert(error.message);
    }
}
postList();

// 포스트 화면에 띄우기
function addPost() {
    const postFirst = foundPosts[foundPosts.length - 1];

    if (postFirst.image) {
        contentBox.innerHTML = `<div class="box1">
                    <div class="imgBox">
                        <img src="${postFirst.image}" alt="" />
                    </div>
                    <div class="posts">
                        <div class="post">
                            <div class="title">${postFirst.title}</div>
                            <div class="likeAndview">
                                <div class="like">
                                    <img src="./images/like.png" />${postFirst.likes}
                                </div>
                                <div class="view">
                                    <img src="./images/view.png" />${postFirst.hitCount}
                                </div>
                            </div>
                        </div>
                        <div></div>
                    </div>
                </div>`;
        return;
    }
    contentBox.innerHTML = `<div class="box1">
                    <div class="imgBox">
                        <img src="" alt="" />
                    </div>
                    <div class="posts">
                        <div class="post">
                            <div class="title">${postFirst.title}</div>
                            <div class="likeAndview">
                                <div class="like">
                                    <img src="./images/like.png" />${postFirst.likes}
                                </div>
                                <div class="view">
                                    <img src="./images/view.png" />${postFirst.hitCount}
                                </div>
                            </div>
                        </div>
                        <div></div>
                    </div>
                </div>`;
}

async function fetchDataAndAddPost() {
    await postList();
    addPost();
}

fetchDataAndAddPost();
