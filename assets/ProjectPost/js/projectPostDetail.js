const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('id');

const accessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiOTg4NzZAbmF2ZXIuY29tIiwiaWQiOjEsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE3MDY3NjQ5NTYsImV4cCI6MTcwNjc2ODU1Nn0.8ObMgUPNb3LT8KHenW7qtgWnH7fdIbvGVvSGe_gudPg`;

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

        return data.message;
    } catch (error) {
        console.error('에러 --- ', error);
        throw new Error(error);
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
            <div class="mainWrap">
                <div class="mainBox">
                    <div class="imageBox">
                        <div>
                            <img src="${data.image}" alt="">
                        </div>
                    </div>
                    <div class="detailBox">
                        <div class="title">${data.title}</div>
                        <div class="needStackBox">
                            <div>
                                <div class="stackTitle">요구 기술</div>
                                <div class="stacks">
                                </div>
                            </div>
                            <div>
                                <div class="needPeopleTitle">모집 인원</div>
                                <div class="needPeoples">
                                </div>
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
                        <div class="applicantBox">
                            <div class="likeBtn">좋아요</div>
                            <div class="applicantBtn">지원하기</div>
                        </div>
                    </div>
                </div>
                <div class="contentBox">
                    <div>${data.content}</div>
                </div>
            </div>`;

        const main = document.querySelector('.main');

        main.appendChild(mainWrap);

        const likeBtn = document.querySelector('.likeBtn');

        likeBtn.addEventListener('click', () => {
            postLike(projectId);
        });

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
    } catch (error) {
        console.error('에러 --- ', error);
        throw new error(error);
    }
}

getProjectDetail();
