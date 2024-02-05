const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('id');

const accessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiOTg4NzZAbmF2ZXIuY29tIiwiaWQiOjEsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE3MDY3OTQyODcsImV4cCI6MTcwNjc5Nzg4N30.L_6Ex8XH9D1HCcxFbVQILQB6u_4zMTU_FMwwg9nwgxU`;

async function fetchProjectDetail(projectId) {
    try {
        const response = await fetch(`http://localhost:3000/project-post/${projectId}`, {
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

async function fetchStack(projectId) {
    try {
        const response = await fetch(`http://localhost:3000/need-info/${projectId}`, {
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

async function increaseHitCount(projectId) {
    try {
        const response = await fetch(
            `http://localhost:3000/project-post/${projectId}/increaseHitCount`,
            {
                method: 'PATCH',
            },
        );
    } catch (error) {
        console.error('에러 --- ', error);
        throw new error(error);
    }
}

async function postLike(projectId) {
    try {
        const response = await fetch(`http://localhost:3000/like/${projectId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const data = await response.json();

        alert(data.message);
    } catch (error) {
        console.error('에러 --- ', error);
        throw new Error(error);
    }
}

async function updateProjectDetail(formData, projectId) {
    const responseProject = await fetch(`http://localhost:3000/project-post/${projectId}`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
    });
}

async function editProjectForm(projectId) {
    const title = document.querySelector('.title');
    const projectImg = document.querySelector('.projectImg');
    const content = document.querySelector('.content');

    const mainWrap = document.querySelector('.mainWrap');

    mainWrap.innerHTML = ` 
    <form id='dataForm'> 
        <div class="mainBox">
            <div class="imageBox">
                <div>
                    <img src="${projectImg.src}" class='projectImg' alt="">
                </div>
            </div>
            <div class="detailBox">
                <input type="text" id="title" class="title" placeholder='${title.textContent}'></input>
                <div class="needStackBox">
                    <div>
                        <div class="stackTitle">요구 기술</div>
                        <div class="stacks"></div>
                    </div>
                    <div>
                        <div class="needPeopleTitle">모집 인원</div>
                        <div class="needPeoples"></div>
                    </div>
                </div>
                <div class="dateBox">
                    <div class="date">
                        <label for='deadLine' class="dateTitle">마감일</label>
                        <input type="date" id="deadLine" class="deadLine" required></input>
                    </div>
                    <div class="date">
                        <label for='startDate' class="dateTitle">시작일</label>
                        <input type="date" id="startDate" class="startDate" required></input>
                    </div>
                    <div class="date">
                        <label for='dueDate' class="dateTitle">종료일</label>
                        <input type="date" id="dueDate" class="dueDate" required></input>
                    </div>
                </div>
                <div class="editBox">
                    <label for="editCompleteBtn" class='editBtn'>완료</label>
                    <input type="submit" id="editCompleteBtn" class='editCompleteBtn'></input>
                    <div class='deleteBtn'>삭제</div>
                </div>
                <div class="applicantBox">
                    <div class="likeBtn">좋아요</div>
                    <div class="applicantBtn">지원하기</div>
                </div>
            </div>
        </div>
        <div class="contentBox">
            <div class='content'>${content.textContent}</div>
        </div>
    </form>`;

    const stack = document.querySelectorAll('.stack');

    const needPeople = document.querySelectorAll('.needPeople');

    const stacks = document.querySelector('.stacks');

    const needPeoples = document.querySelector('.needPeoples');

    for (let i = 0; i < stack.length; i++) {
        stacks.appendChild(stack[i]);
        needPeoples.appendChild(needPeople[i]);
    }

    const dataForm = document.querySelector('#dataForm');

    dataForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('title', document.querySelector('.title').value);
        formData.append('content', document.querySelector('.content').textContent);
        formData.append('applicationDeadLine', document.querySelector('.deadLine').value);
        formData.append('startDate', document.querySelector('.startDate').value);
        formData.append('dueDate', document.querySelector('.dueDate').value);

        await updateProjectDetail(formData, projectId);
        window.location.href = `projectPostDetail.html?id=${projectId}`;
    });
}

async function deleteProjectPost(projectId) {
    try {
        const response = await fetch(`http://localhost:3000/project-post/${projectId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const data = await response.json();

        alert(data.message);
    } catch (error) {
        console.error('에러 --- ', error);
        throw new error(error);
    }
}

async function getProjectDetail() {
    try {
        const data = await fetchProjectDetail(projectId);
        const getStack = await fetchStack(projectId);
        await increaseHitCount(projectId);

        const mainWrap = document.createElement('div');
        mainWrap.className = 'mainWrap';

        mainWrap.innerHTML = `
                <div class="mainBox">
                    <div class="imageBox">
                        <div>
                            <img class='projectImg' src="${data.image}" alt="">
                        </div>
                    </div>
                    <div class="detailBox">
                        <div class="title">${data.title}</div>
                        <div class="needStackBox">
                            <div>
                                <div class="stackTitle">요구 기술</div>
                                <div class="stacks"></div>
                            </div>
                            <div>
                                <div class="needPeopleTitle">모집 인원</div>
                                <div class="needPeoples"></div>
                            </div>
                        </div>
                        <div class="dateBox">
                            <div class="date">
                                <div class="dateTitle">마감일</div>
                                <div class="deadLine">${data.applicationDeadLine.split('T')[0]}</div>
                            </div>
                            <div class="date">
                                <div class="dateTitle">시작일</div>
                                <div class="startDate">${data.startDate.split('T')[0]}</div>
                            </div>
                            <div class="date">
                                <div class="dateTitle">종료일</div>
                                <div class="dueDate">${data.dueDate.split('T')[0]}</div>
                            </div>
                        </div>
                        <div class="editBox">
                            <div class='editBtn'>수정</div>
                            <div class='deleteBtn'>삭제</div>
                        </div>
                        <div class="applicantBox">
                            <div class="likeBtn">좋아요</div>
                            <div class="applicantBtn">지원하기</div>
                        </div>
                    </div>
                </div>
                <div class="contentBox">
                    <div class ='content'>${data.content}</div>
                </div>
          `;

        const main = document.querySelector('.main');

        main.appendChild(mainWrap);

        const stacks = document.querySelector('.stacks');
        const needPeoples = document.querySelector('.needPeoples');

        for (let i = 0; i < getStack.length; i++) {
            const stack = document.createElement('div');
            stack.className = 'stack';

            stack.innerHTML = `${getStack[i].stack}`;

            stacks.appendChild(stack);

            const needPeople = document.createElement('div');
            needPeople.className = 'needPeople';

            needPeople.innerHTML = `${getStack[i].numberOfPeople} 명`;

            needPeoples.appendChild(needPeople);
        }

        const editBtn = document.querySelector('.editBtn');

        editBtn.addEventListener('click', () => {
            editProjectForm(projectId);
        });

        const deleteBtn = document.querySelector('.deleteBtn');

        deleteBtn.addEventListener('click', () => {
            deleteProjectPost(projectId);
            window.location.href = './projectPostMain.html';
        });

        const likeBtn = document.querySelector('.likeBtn');

        likeBtn.addEventListener('click', () => {
            postLike(projectId);
        });
    } catch (error) {
        console.error('에러 --- ', error);
        throw new error(error);
    }
}

getProjectDetail();
