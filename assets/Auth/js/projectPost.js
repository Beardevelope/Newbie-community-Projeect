const firstProject = document.getElementById('firstProject');
const secondProject = document.getElementById('secondProject');

async function fetchProject() {
    try {
        console.time('project-post');
        const response = await fetch(`/project-post?page=1`, {
            method: 'GET',
        });

        const data = await response.json();
        console.timeEnd('project-post');
        return data.sortPost;
    } catch (error) {
        console.error('에러 --- ', error);
        throw new error(error);
    }
}

async function fetchLike(projectId) {
    try {
        const response = await fetch(`/project-like/${projectId}`, {
            method: 'GET',
        });

        const data = await response.json();

        console.log(data);

        return data;
    } catch (error) {
        console.error('에러 --- ', error);
        throw new error(error);
    }
}

async function getProject() {
    const fetchProjectData = await fetchProject();

    const projectBox = document.querySelector('.projectBox');

    for (let i = 0; i < 2; i++) {
        const fetchLikeData = await fetchLike(fetchProjectData[i].id);

        const contentBox = document.createElement('div');
        contentBox.className = 'contentBox';
        contentBox.id = 'project';

        contentBox.innerHTML = `  <div class="image">
        <img src="${fetchProjectData[i].image}" alt="" />
    </div>
    <div class="titleAndContent">
        <div>
            <h3>${fetchProjectData[i].title}</h3>
        </div>
        <div>${fetchProjectData[i].content.slice(0, 20)}...</div>
    </div>
    <div class="viewAndLike">
        <div class="views">
            <div class="view">
                <img src="./images/view.png" alt="" />
            </div>
            <div>${fetchProjectData[i].hitCount}</div>
        </div>
        <div class="likes">
            <div class="like">
                <img src="./images/like.png" alt="" />
            </div>
            <div class='likeCount'>${fetchLikeData}</div>
        </div>
    </div>`;

        projectBox.appendChild(contentBox);

        contentBox.addEventListener('click', () => {
            window.location.href = `../ProjectPost/projectPostDetail.html?id=${fetchProjectData[i].id}`;
        });
    }
}

getProject();
