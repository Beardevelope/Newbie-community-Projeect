const post_API = '/warning';
const postList = document.querySelector('.postList');
const TOKEN =
    sessionStorage.getItem('accessToken') ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoibWluaGVlQHlhaG9vLmNvbSIsImlkIjoxLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzA4MTI0MDYwLCJleHAiOjE3MDgxMjc2NjB9.-aXllZjFBB37Vs37wIhrGx_lUWemyKXwc7DnX7b3qZE';

const getpostList = async () => {
    const response = await fetch(`${post_API}/warningPost`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${TOKEN}`,
        },
    });

    if(response.status === 406) {
        throw new Error('관리자만 접근 가능합니다.')
    }

    const responseData = await response.json();
    if (!response.ok) {
        alert(`${responseData.message}`);
        throw new Error('서버 에러');
    }
    return responseData;
};

const listpost = async () => {
    try {
        const posts = await getpostList();
        if (posts.posts.length > 0) {
            const postTable = document.createElement('table');
            postTable.className = 'postTable';

            postTable.innerHTML = `
            <caption>
                Developers Rating
            </caption>
            <thead id="">
                <tr>
                    <th>image</th>
                    <th>TITLE</th>
                    <th>CONTENT</th>
                    <th>WARNING COUNT</th>
                    <th>DETAIL</th>
                </tr>
            </thead>
            <tbody></tbody>
            <tfoot>
                <tr>
                    <td colspan="5" class="tablefoot"></td>
                </tr>
            </tfoot>
        `;

            const tbody = postTable.querySelector('tbody');
            const foundPosts = posts.posts;
            foundPosts.forEach((post) => {
                const row = document.createElement('tr');
                row.style.borderBottom = '1px solid #000';
                if (post.isBan) {
                    row.classList.add('banned-post');
                }
                row.innerHTML = `
                <td>
                    <img src="${post.image}" alt="img" onerror="this.src='https://i.postimg.cc/yYYd1HV1/katara.jpg'" />
                </td>
                <td class="postTitle" id="${post.id}" style="cursor: pointer;">${post.title}</td>
                <td>${post.content.slice(0, 5)}..</td>
                <td>${post.warning}</td>
                <td>
                <button class="view" data-postid="${post.id}">follow</button>
                </td>
            `;
                tbody.appendChild(row);
            });

            postTable.addEventListener('click', async (event) => {
                const targetButton = event.target.closest('button.view');

                const postId = targetButton.getAttribute('data-postid');
                console.log(`Button with postId ${postId} clicked.`);
                const detailPageURL = `./detailWarningPost.html?id=${postId}`;
                window.location.href = detailPageURL;
            });

            postList.appendChild(postTable);
            addEventListenerPostTitle();
        }
    } catch (error) {
        console.error(error);
    }
};
function addEventListenerPostTitle() {
    const postTitles = document.querySelectorAll('.postTitle');
    postTitles.forEach((postTitle) => {
        postTitle.addEventListener('click', function (event) {
            const clickedPostId = event.target.id;
            // 상세 조회 페이지 URL을 생성하여 이동
            const detailPageURL = `../../Auth/post-detail.html?id=${clickedPostId}`;
            window.location.href = detailPageURL;
        });
    });
}

const display = async () => {
    await listpost();
};

display();
