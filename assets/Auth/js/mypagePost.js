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

        if (posts.length > 0) {
            posts.forEach((post) => {
                foundPosts.push(post);
            });
        }
    } catch (error) {
        console.log(error.message);
        alert(error.message);
    }
}
postList();

// 포스트 화면에 띄우기
function addPost() {
    const postFirst = foundPosts[foundPosts.length - 1];

    contentBox.innerHTML = `<div class="box1">
                    <div class="imgBox">
                        <img src="${postFirst.image || './images/no-image.png'}" alt="" />
                    </div>
                    <div class="posts">
                        <div class="post">
                            <div id=${postFirst.id} class="title">${postFirst.title}</div>
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

async function fetchDataAndAddPost() {
    await postList();
    addPost();
    addEventListenersToPost();
}

fetchDataAndAddPost();

// 조회수 늘리는 함수
async function addHit(clickedPostId) {
    try {
        const newInformation = {
            id: clickedPostId,
        };
        const response = await fetch(`/post/${clickedPostId}/hit`, {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newInformation),
        });
        const information = await response.json();
        if (response.status !== 200) {
            throw new Error(information.message);
        }
    } catch (error) {
        console.log(error.message);
    }
}

// 게시글 제목 클릭했을 때 실행되는 로직
function addEventListenersToPost() {
    const title = document.querySelector('.title');

    title.addEventListener('click', function (event) {
        const clickedPostId = event.target.id;
        console.log(clickedPostId);
        // 조회수 늘리는 함수 실행
        addHit(clickedPostId);
         // 상세 조회 페이지 URL을 생성하여 이동
         const detailPageURL = `../../Auth/post-detail.html?id=${clickedPostId}`;
         window.location.href = detailPageURL;
    });
}
