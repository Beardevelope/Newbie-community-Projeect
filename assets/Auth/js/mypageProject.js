const accessToken = sessionStorage.getItem('accessToken');

async function fetchProject() {
    try {
        const response = await fetch(`http://localhost:3000/project-post/myProject`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const data = await response.json();
        console.log(data);

        return data;
    } catch (error) {
        console.error('에러 --- ', error);
        throw new error(error);
    }
}

async function fetchLikeProject(projectId) {
    try {
        const response = await fetch(`http://localhost:3000/project-like/${projectId}`, {
            method: 'GET',
        });

        const data = await response.json();

        return data;
    } catch (error) {
        console.error('에러 --- ', error);
        throw new error(error);
    }
}

async function fetchMyLike() {
    try {
        const response = await fetch(`http://localhost:3000/project-like/myLike`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const data = await response.json();

        return data;
    } catch (error) {
        console.error('에러 --- ', error);
        throw new error(error);
    }
}

async function fetchMyApplicant() {
    try {
        const response = await fetch(`http://localhost:3000/project-post/myProjectApplicant`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const data = await response.json();
        console.log(data);

        return data;
    } catch (error) {
        console.error('에러 --- ', error);
        throw new error(error);
    }
}

async function getRecentProject() {
    const getProjectData = await fetchProject();

    const recentProjectBox = document.querySelector('.recentProjectBox');

    console.log(getProjectData, '길이');

    for (let i = 0; i < getProjectData.length; i++) {
        const getLikeProjectData = await fetchLikeProject(getProjectData[i].id);

        const recentProject = document.createElement('div');
        recentProject.className = 'box1 recentProject';

        recentProject.innerHTML = `  
            <div class="imgBox">
                <img src=${getProjectData[i].image} alt="" />
            </div>
            <div class="posts">
                <div class="post">
                    <div class="title">${getProjectData[i].title}</div>
                    <div class='memberBtn'>프로젝트 멤버</div>
                    <div class="applicantsBtn">지원자 목록</div>
                    <div class="likeAndview">
                        <div class="like">
                            <div>
                                <img src="./images/like.png" />
                            </div>
                            <div>
                                ${getLikeProjectData}
                            </div>
                        </div>
                        <div class="view">
                            <div>
                                <img src="./images/view.png" />
                            </div>
                            <div>
                               ${getProjectData[i].hitCount}
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

        recentProjectBox.appendChild(recentProject);
        const memberBtn = document.querySelectorAll('.memberBtn');

        memberBtn[i].addEventListener('click', (event) => {
            event.stopPropagation();
            const memberModalBox = document.querySelector('.memberModalBox');

            memberModalBox.style.display = 'block';
        });

        const applicantsBtn = document.querySelectorAll('.applicantsBtn');

        applicantsBtn[i].addEventListener('click', (event) => {
            event.stopPropagation();
            const applicantModalBox = document.querySelector('.applicantModalBox');

            applicantModalBox.style.display = 'block';
        });

        const closeModalBtn = document.querySelectorAll('.closeModalBtn');

        for (let i = 0; i < closeModalBtn.length; i++) {
            closeModalBtn[i].addEventListener('click', () => {
                document.querySelector('.applicantModalBox').style.display = 'none';
                document.querySelector('.memberModalBox').style.display = 'none';
            });
        }

        recentProject.addEventListener('click', () => {
            // window.location.href = `../projectPost/projectPostDetail.html?id=${getProjectData[i].id}`;
        });
    }
}

async function getLikeProject() {
    const getMyLikeData = await fetchMyLike();

    const likeProjectBox = document.querySelector('.likeProjectBox');

    for (let i = 0; i < getMyLikeData.length; i++) {
        const getLikeProjectData = await fetchLikeProject(getMyLikeData[i].id);

        const likeProject = document.createElement('div');
        likeProject.className = 'box1 likeProject';

        likeProject.innerHTML = `  
            <div class="imgBox">
                <img src=${getMyLikeData[i].image} alt="" />
            </div>
            <div class="posts">
                <div class="post">
                    <div class="title">${getMyLikeData[i].title}</div>
                    <div class="likeAndview">
                        <div class="like">
                            <div>
                                <img src="./images/like.png" />
                            </div>
                            <div>
                                ${getLikeProjectData}
                            </div>
                        </div>
                        <div class="view">
                            <div>
                                <img src="./images/view.png" />
                            </div>
                            <div>
                               ${getMyLikeData[i].hitCount}
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

        likeProjectBox.appendChild(likeProject);

        likeProject.addEventListener('click', () => {
            window.location.href = `../projectPost/projectPostDetail.html?id=${getMyLikeData[i].id}`;
        });
    }
}
async function getApplicantProject() {
    const fetchMyApplicantData = await fetchMyApplicant();

    const applicantProjectBox = document.querySelector('.applicantProjectBox');

    for (let i = 0; i < fetchMyApplicantData.length; i++) {
        const getApplicantProjectData = await fetchLikeProject(fetchMyApplicantData[i].id);

        const applicantProject = document.createElement('div');
        applicantProject.className = 'box1 applicantProject';

        applicantProject.innerHTML = `  
            <div class="imgBox">
                <img src=${fetchMyApplicantData[i].image} alt="" />
            </div>
            <div class="posts">
                <div class="post">
                    <div class="title">${fetchMyApplicantData[i].title}</div>
                    <div class="likeAndview">
                        <div class="like">
                            <div>
                                <img src="./images/like.png" />
                            </div>
                            <div>
                                ${getApplicantProjectData}
                            </div>
                        </div>
                        <div class="view">
                            <div>
                                <img src="./images/view.png" />
                            </div>
                            <div>
                               ${fetchMyApplicantData[i].hitCount}
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

        applicantProjectBox.appendChild(applicantProject);

        applicantProject.addEventListener('click', () => {
            window.location.href = `../projectPost/projectPostDetail.html?id=${getApplicantProjectData[i].id}`;
        });
    }
}

async function pageLoading() {
    await getRecentProject();
    await getLikeProject();
    await getApplicantProject();
}

pageLoading();
