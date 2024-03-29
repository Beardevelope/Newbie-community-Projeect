const firstPostBox = document.getElementById('contentBoxFirst');
const secondPostBox = document.getElementById('contentSecond');

// 포스트 데이터 불러오기
let foundPosts = [];
async function postList() {
    try {
        const response = await fetch(`/post?order=createdAt&page=1`, {
            accept: 'application/json',
        });
        const jsonData = await response.json();
        let posts = jsonData.posts.data;

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
    const postFirst = foundPosts[0];
    const postSecond = foundPosts[1];
    console.log(postFirst, postSecond);

    firstPostBox.innerHTML = `<div class="image">
                                    <img src="${postFirst.image}" alt="" />
                                </div>
                                <div class="titleAndContent">
                                    <div>
                                        <h3 class="post" id=${postFirst.id} style="cursor: pointer" onclick="location.href='./Auth/post-detail.html?id=${postFirst.id}'">${postFirst.title}</h3>
                                    </div>
                                    <div>내용은 해당 게시글에서 확인하세요</div>
                                </div>
                                <div class="viewAndLike">
                                    <div class="views">
                                        <div class="view">
                                            <img src="./Auth/images/view.png" alt="" />
                                        </div>
                                        <div>${postFirst.hitCount}</div>
                                    </div>
                                    <div class="likes">
                                        <div class="like">
                                            <img src="./Auth/images/like.png" alt="" />
                                        </div>
                                        <div>${postFirst.likes}</div>
                                    </div>
                                </div>`;
    secondPostBox.innerHTML = `<div class="image">
                                    <img src="${postSecond.image}" alt="" />
                                </div>
                                <div class="titleAndContent">
                                    <div>
                                        <h3 class="post" id=${postSecond.id} style="cursor: pointer" onclick="location.href='./Auth/post-detail.html?id=${postSecond.id}'">${postSecond.title}</h3>
                                    </div>
                                    <div>내용은 해당 게시글에서 확인하세요</div>
                                </div>
                                <div class="viewAndLike">
                                    <div class="views">
                                        <div class="view">
                                            <img src="./Auth/images/view.png" alt="" />
                                        </div>
                                        <div>${postSecond.hitCount}</div>
                                    </div>
                                    <div class="likes">
                                        <div class="like">
                                            <img src="./Auth/images/like.png" alt="" />
                                        </div>
                                        <div>${postSecond.likes}</div>
                                    </div>
                                </div>`;
}

async function fetchDataAndAddPost() {
    await postList();
    addPost();
    addEventListenersToPost()
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
    const posts = document.querySelectorAll('.post');
    posts.forEach((post) => {
        post.addEventListener('click', function (event) {
            const clickedPostId = event.target.id;
            console.log(clickedPostId)
            // 조회수 늘리는 함수 실행
            addHit(clickedPostId);
        });
    });
}
