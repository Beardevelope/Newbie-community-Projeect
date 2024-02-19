const accessToken = sessionStorage.getItem('accessToken');

async function fetchUserInfo() {
    try {
        const response = await fetch(`/user/userinfo`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const responseData = await response.json();

        return responseData;
    } catch (error) {
        console.error('에러 --- ', error);
        throw new error(error);
    }
}

async function fetchProjectAnswer(projectId, userId) {
    try {
        const response = await fetch(`/answer/${projectId}/${userId}`, {
            method: 'GET',
        });

        const responseData = await response.json();
        console.log(responseData, '대답');

        return responseData;
    } catch (error) {
        console.error('에러 --- ', error);
        throw new error(error);
    }
}

async function fetchProject() {
    try {
        const response = await fetch(`/project-post/myProject`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const data = await response.json();
        if (data.message === 406) return false;
        console.log(data);

        return data;
    } catch (error) {
        console.error('에러 --- ', error);
        throw new error(error);
    }
}

async function fetchLikeProject(projectId) {
    try {
        const response = await fetch(`/project-like/${projectId}`, {
            method: 'GET',
        });

        const data = await response.json();

        return data;
    } catch (error) {
        console.error('에러 --- ', error);
        throw new error(error);
    }
}

async function fetchQuestion(projectId) {
    try {
        const response = await fetch(`/question/${projectId}`, {
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

async function acceptUser(projectId, userId) {
    try {
        const response = await fetch(`/project-post/${projectId}/projectApplicant`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });

        const data = await response.json();

        return data;
    } catch (error) {
        console.error('에러 --- ', error);
        throw new error(error);
    }
}

async function fetchMember(projectId) {
    try {
        const response = await fetch(`/project-post/${projectId}/acceptApplicant`, {
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

async function fetchMyLike() {
    try {
        const response = await fetch(`/project-like/myLike`, {
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

async function fetchProjectApplicant(projectId) {
    try {
        const response = await fetch(`/project-post/${projectId}/projectApplicant`, {
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
        const response = await fetch(`/project-post/myProjectApplicant`, {
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

async function removeLike(projectId) {
    try {
        const response = await fetch(`/project-like/${projectId}`, {
            method: 'DELETE',
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

async function removeApplicant(projectId) {
    try {
        const response = await fetch(`/project-post/${projectId}/projectApplicant`, {
            method: 'DELETE',
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

async function removeMember(projectId, userId) {
    try {
        const response = await fetch(`/project-post/${projectId}/projectMember`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });

        const data = await response.json();

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
        const userInfo = await fetchProjectAnswer();

        const recentProject = document.createElement('div');
        recentProject.className = 'box1 recentProject';

        recentProject.innerHTML = `  
            <div class="imgBox">
                <img src=${getProjectData[i].image || './images/no-image.png'} alt="" />
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

        memberBtn[i].addEventListener('click', async (event) => {
            event.stopPropagation();
            await getMember(getProjectData[i].id);

            const memberModalBox = document.querySelector('.memberModalBox');

            memberModalBox.style.display = 'block';
        });

        const applicantsBtn = document.querySelectorAll('.applicantsBtn');

        applicantsBtn[i].addEventListener('click', async (event) => {
            event.stopPropagation();
            await getApplicantProjectors(getProjectData[i].id);

            const applicantModalBox = document.querySelector('.applicantModalBox');

            applicantModalBox.style.display = 'block';
        });

        recentProject.addEventListener('click', () => {
            window.location.href = `../projectPost/projectPostDetail.html?id=${getProjectData[i].id}`;
        });
    }
}

async function getMember(projectId) {
    const getMemberData = await fetchMember(projectId);

    const members = document.querySelector('.members');

    members.innerHTML = `<div class="closeModalBtn closeMemeberBtn">❌</div>`;

    for (let i = 0; i < getMemberData.length; i++) {
        const getProjectAnswerData = await fetchProjectAnswer(projectId, getMemberData[i].userId);

        const memberInfo = document.createElement('div');

        memberInfo.className = 'memberInfo';

        memberInfo.innerHTML = `
        <div class="nickName">${getProjectAnswerData[i].user.nickname}</div>
        <div class="stack">${getProjectAnswerData[i].answer.stack}</div>
        <div class="removeMemberBtn">지원자 삭제</div>
        `;

        members.appendChild(memberInfo);

        const removeMemberBtn = document.querySelectorAll('.removeMemberBtn');

        removeMemberBtn[i].addEventListener('click', async () => {
            const removeMemberData = await removeMember(projectId, getProjectAnswerData[i].user.id);
            alert(removeMemberData.message);
            window.location.reload();
        });
    }

    const closeMemeberBtn = document.querySelector('.closeMemeberBtn');

    closeMemeberBtn.addEventListener('click', () => {
        document.querySelector('.memberModalBox').style.display = 'none';
    });
}

async function getApplicantProjectors(projectId) {
    const getProjectApplicantData = await fetchProjectApplicant(projectId);

    const applicant = document.querySelector('.applicant');

    applicant.innerHTML = `<div class="closeModalBtn closeApplicantBtn">❌</div>`;

    for (let i = 0; i < getProjectApplicantData.length; i++) {
        const getQuestionData = await fetchQuestion(projectId);

        const getProjectAnswerData = await fetchProjectAnswer(
            projectId,
            getProjectApplicantData[i].userId,
        );

        const userInfo = getProjectAnswerData[i].user;

        const applicantInfo = document.createElement('div');
        applicantInfo.className = 'applicantInfo';

        applicantInfo.innerHTML = `
        
        <div class="applicantUser">
            <div class="nickName">${userInfo.nickname}</div>
            <div class="stack">${getProjectAnswerData[i].answer.stack}</div>
        </div>
        <div class="applicantAnswerBox"></div>
 
        <div class="pickBtn">수락</div>
        `;

        applicant.appendChild(applicantInfo);

        const applicantAnswerBox = document.querySelectorAll('.applicantAnswerBox');

        for (let j = 0; j < getQuestionData.length; j++) {
            const applicantAnswer = document.createElement('div');
            applicantAnswer.className = 'applicantAnswer';

            applicantAnswer.innerHTML = `
            <div class="question">${getQuestionData[j].question}</div>
            <div class="answer">${getProjectAnswerData[j].answer.answer}</div>
        `;

            applicantAnswerBox[i].appendChild(applicantAnswer);
        }

        const pickBtn = document.querySelectorAll('.pickBtn');

        pickBtn[i].addEventListener('click', async () => {
            const acceptDone = await acceptUser(projectId, userInfo.id);
            alert(acceptDone.message);
            window.location.reload();
        });
    }

    const closeApplicantBtn = document.querySelector('.closeApplicantBtn');

    closeApplicantBtn.addEventListener('click', () => {
        document.querySelector('.applicantModalBox').style.display = 'none';
    });
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
                <img src=${getMyLikeData[i].image || './images/no-image.png'} alt="" />
            </div>
            <div class="posts">
                <div class="post">
                    <div class="title">${getMyLikeData[i].title}</div>
                    <div class='removeLikeBtn'>좋아요 취소</div>
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

        const removeLikeBtn = document.querySelectorAll('.removeLikeBtn');

        removeLikeBtn[i].addEventListener('click', async (event) => {
            event.stopPropagation();
            const removeLikeData = await removeLike(getMyLikeData[i].id);
            alert(removeLikeData.message);
            window.location.reload();
        });

        likeProject.addEventListener('click', () => {
            window.location.href = `../projectPost/projectPostDetail.html?id=${getMyLikeData[i].id}`;
        });
    }
}

async function getApplicantProject() {
    const getMyApplicantData = await fetchMyApplicant();

    const applicantProjectBox = document.querySelector('.applicantProjectBox');

    for (let i = 0; i < getMyApplicantData.length; i++) {
        const getLikeProjectData = await fetchLikeProject(getMyApplicantData[i].id);

        const applicantProject = document.createElement('div');
        applicantProject.className = 'box1 applicantProject';

        applicantProject.innerHTML = `  
            <div class="imgBox">
                <img src=${getMyApplicantData[i].image || './images/no-image.png'} alt="" />
            </div>
            <div class="posts">
                <div class="post">
                    <div class="title">${getMyApplicantData[i].title}</div>
                    <div class="removeApplicantBtn">지원 삭제</div>
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
                               ${getMyApplicantData[i].hitCount}
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

        applicantProjectBox.appendChild(applicantProject);

        const removeApplicantBtn = document.querySelectorAll('.removeApplicantBtn');

        removeApplicantBtn[i].addEventListener('click', async (event) => {
            event.stopPropagation();
            const removeApplicantData = await removeApplicant(getMyApplicantData[i].id);
            alert(removeApplicantData.message);
            window.location.reload();
        });

        applicantProject.addEventListener('click', () => {
            window.location.href = `../projectPost/projectPostDetail.html?id=${getMyApplicantData[i].id}`;
        });
    }
}

async function pageLoading() {
    const fetchUserInfoData = await fetchUserInfo();

    if (!fetchUserInfoData.isVerified) {
        return;
    }

    await getRecentProject();
    await getLikeProject();
    await getApplicantProject();
}

pageLoading();
