const contentBoxFirst = document.getElementById('contentBoxFirst');
const contentSecond = document.getElementById('contentSecond');

// 포스트 데이터 불러오기
let foundPosts = [];
async function postList() {
    try {
        const response = await fetch(`http://localhost:3000/post?order=createdAt&page=1`, {
            accept: 'application/json',
        });
        const jsonData = await response.json();
        let posts = jsonData.posts.data;

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
    const postFirst = foundPosts[0];
    const postSecond = foundPosts[1];
    console.log(postFirst, postSecond);

    contentBoxFirst.innerHTML = `<div class="image">
                                    <img src="${postFirst.image}" alt="" />
                                </div>
                                <div class="titleAndContent">
                                    <div>
                                        <h3>${postFirst.title}</h3>
                                    </div>
                                    <div>${postFirst.content.slice(0, 20)}...</div>
                                </div>
                                <div class="viewAndLike">
                                    <div class="views">
                                        <div class="view">
                                            <img src="./images/view.png" alt="" />
                                        </div>
                                        <div>${postFirst.hitCount}</div>
                                    </div>
                                    <div class="likes">
                                        <div class="like">
                                            <img src="./images/like.png" alt="" />
                                        </div>
                                        <div>${postFirst.likes}</div>
                                    </div>
                                </div>`;
    contentSecond.innerHTML = `<div class="image">
                                    <img src="${postSecond.image}" alt="" />
                                </div>
                                <div class="titleAndContent">
                                    <div>
                                        <h3>${postSecond.title}</h3>
                                    </div>
                                    <div>${postSecond.content.slice(0, 20)}...</div>
                                </div>
                                <div class="viewAndLike">
                                    <div class="views">
                                        <div class="view">
                                            <img src="./images/view.png" alt="" />
                                        </div>
                                        <div>${postSecond.hitCount}</div>
                                    </div>
                                    <div class="likes">
                                        <div class="like">
                                            <img src="./images/like.png" alt="" />
                                        </div>
                                        <div>${postSecond.likes}</div>
                                    </div>
                                </div>`;
}

async function fetchDataAndAddPost() {
    await postList();
    addPost();
}

fetchDataAndAddPost();