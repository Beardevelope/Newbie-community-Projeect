const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('id');

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
        console.log(responseData, '유저');

        return responseData;
    } catch (error) {
        console.error('에러 --- ', error);
        throw new error(error);
    }
}

async function fetchProjectDetail(projectId) {
    try {
        const response = await fetch(`/project-post/${projectId}`, {
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
        const response = await fetch(`/need-info/${projectId}`, {
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
            `/project-post/${projectId}/increaseHitCount`,
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
        const response = await fetch(`/project-like/${projectId}`, {
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
    try {
        const responseProject = await fetch(`/project-post/${projectId}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
        });
    } catch (error) {
        console.error('에러 --- ', error);
        throw new Error(error);
    }
}

async function removeStack(projectId, stackId) {
    try {
        const response = await fetch(`/need-info/${projectId}/${stackId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const data = response.json();

        return data;
    } catch (error) {
        console.error('에러 --- ', error);
        throw new Error(error);
    }
}

async function removeQuestion(projectId, questionId) {
    try {
        const response = await fetch(`/question/${projectId}/${questionId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const data = response.json();

        return data;
    } catch (error) {
        console.error('에러 --- ', error);
        throw new Error(error);
    }
}

async function editProjectForm(projectId) {
    const getProject = await fetchProjectDetail(projectId);
    const getStack = await fetchStack(projectId);
    const getQuestion = await fetchQuestion(projectId);

    const mainWrap = document.querySelector('.mainWrap');

    mainWrap.innerHTML = ` 
    <form id='dataForm'> 
        <div class="mainBox">
            <div class="imageBox">
                <div>
                    <img src="${getProject.image}" class='projectImg' alt="">
                </div>
            </div>

            <div class="detailBox">
                <input type="text" id="title" class="title" placeholder='${getProject.title}'></input>
                <div class="needStackBox">
                    <div class='needStack'>
                        <div class='stackTitleBox'>
                            <div class="stackTitle">요구 기술</div>
                            <div class="needPeopleTitle">모집 인원</div>
                        </div>
                        <div class='stackInfoBox'>
                            <div class='stackInfo'>
                                <div class="stacks"></div>
                                <div class="needPeoples"></div>
                                <div class='removeStackBox'></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="dateBox">
                    <div class="date">
                        <div>
                            <label for='deadLine' class="dateTitle">마감일</label>
                        </div>
                        <div>
                            <input type="date" id="deadLine" class="deadLine" required></input>
                        </div>
                    </div>
                    <div class="date">
                        <div>
                            <label for='startDate' class="dateTitle">시작일</label>
                        </div>
                        <div>
                            <input type="date" id="startDate" class="startDate" required></input>
                        </div>
                    </div>
                    <div class="date">
                        <div>
                            <label for='dueDate' class="dateTitle">종료일</label>
                        </div>
                        <div>
                            <input type="date" id="dueDate" class="dueDate" required></input>
                        </div>
                    </div>
                </div>
                <div class='editQuestionBox'>
                        
                </div>
                <div class= 'recruitBox'>
                    <div>
                        <input
                            type="radio"
                            id='recruiting'
                            class="recruitStatus"
                            name="status"
                            value="모집중"
                        />
                        <label for="recruiting">모집중</label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            id='recruitDone'
                            class="recruitStatus"
                            name="status"
                            value="모집완료"
                        />
                        <label for="recruitDone">모집완료</label>
                    </div>
                </div>
                <div class="editBox">
                    <label for="editCompleteBtn" class='editBtn'>완료</label>
                    <input type="submit" id="editCompleteBtn" class='editCompleteBtn'></input>
                    <div class='deleteBtn'>삭제</div>
                </div>
                <div class="applicantBox">
                    <div class="likeBtn">좋아요</div>
                    <div class="openModalBtn">지원하기</div>
                </div>  
            </div>
            <div class="contentBox">
                <div class='content'>
                    <input type="text" id="contentInput" class="contentInput" placeholder='${getProject.content}'></input>
                </div>
            </div>
        </div>
    </form>`;

    const recruitStatus = document.querySelectorAll('.recruitStatus');

    for (let k = 0; k < recruitStatus.length; k++) {
        if (getProject.status === recruitStatus[k].value) {
            recruitStatus[k].checked = true;
        }
    }

    const stacks = document.querySelector('.stacks');

    const needPeoples = document.querySelector('.needPeoples');

    const removeStackBox = document.querySelector('.removeStackBox');

    for (let i = 0; i < getStack.length; i++) {
        const stack = document.createElement('div');
        stack.className = 'stack';
        const needPeople = document.createElement('div');
        needPeople.className = 'needPeople';
        const removeStackBtn = document.createElement('div');
        removeStackBtn.className = 'removeStackBtn';

        stack.innerHTML = `${getStack[i].stack}`;
        needPeople.innerHTML = `<input type="text" id="needPeopleInput" class="needPeopleInput" placeholder='${getStack[i].numberOfPeople}'></input>`;
        removeStackBtn.innerHTML = `삭제`;

        stacks.appendChild(stack);
        needPeoples.appendChild(needPeople);
        removeStackBox.appendChild(removeStackBtn);

        removeStackBtn.addEventListener('click', async () => {
            if (getStack.length === 1) {
                return alert('스택은 하나 이상 있어야합니다');
            }
            const removeStackData = await removeStack(projectId, getStack[i].id);
            alert(removeStackData.message);
        });
    }

    const editQuestionBox = document.querySelector('.editQuestionBox');

    for (let j = 0; j < getQuestion.length; j++) {
        const editQuestion = document.createElement('div');
        editQuestion.className = 'editQuestion';

        editQuestion.innerHTML = `
        <div>
            <div>질문 ${j + 1}</div>
            <div>
                <input type="text" id="questionInput" class="questionInput" placeholder='${getQuestion[j].question}'></input>
            </div>
        </div>
        <div class="removeQuestionBtn">삭제</div>
        `;

        editQuestionBox.appendChild(editQuestion);

        const removeQuestionBtn = document.querySelectorAll('.removeQuestionBtn');

        removeQuestionBtn[j].addEventListener('click', async () => {
            const removeQuestionData = await removeQuestion(projectId, getQuestion[j].id);
            alert(removeQuestionData.message);
            window.location.reload();
        });
    }

    const dataForm = document.querySelector('#dataForm');

    dataForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        let title = document.querySelector('.title').value;
        let content = document.querySelector('.contentInput').value;
        let applicationDeadLine = document.querySelector('.deadLine').value;
        let startDate = document.querySelector('.startDate').value;
        let dueDate = document.querySelector('.dueDate').value;
        let status = document.querySelector('input[name="status"]:checked').value;

        if (!title) {
            title = getProject.title;
        }

        if (!content) {
            content = getProject.content;
        }
        if (!applicationDeadLine) {
            applicationDeadLine = getProject.applicationDeadLine.split('T')[0];
        }
        if (!startDate) {
            startDate = getProject.startDate.split('T')[0];
        }
        if (!dueDate) {
            dueDate = getProject.dueDate.split('T')[0];
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('applicationDeadLine', applicationDeadLine);
        formData.append('startDate', startDate);
        formData.append('dueDate', dueDate);
        formData.append('status', status);

        await updateProjectDetail(formData, projectId);

        const getNeedPeoples = document.querySelectorAll('.needPeople input');

        for (let i = 0; i < getNeedPeoples.length; i++) {
            let numberOfPeople = parseInt(getNeedPeoples[i].value);

            if (!numberOfPeople) {
                numberOfPeople = getStack[i].numberOfPeople;
            }

            const responseStack = await fetch(
                `/need-info/${projectId}/${getStack[i].id}`,
                {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ numberOfPeople }),
                },
            );
        }

        const editQuestions = document.querySelectorAll('.editQuestion input');

        for (let j = 0; j < editQuestions.length; j++) {
            let editQuestion = editQuestions[j].value;

            if (!editQuestion) {
                editQuestion = getQuestion[j].question;
            }

            const responseQuestion = await fetch(
                `/question/${projectId}/${getQuestion[j].id}`,
                {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ question: editQuestion }),
                },
            );
        }
        alert('수정 완료');

        window.location.href = `projectPostDetail.html?id=${projectId}`;
    });
}

async function deleteProjectPost(projectId) {
    try {
        const response = await fetch(`/project-post/${projectId}`, {
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

async function postStack(projectId, questionId, selectStack, answer) {
    try {
        const answerJSON = { answer, stack: selectStack };

        const stack = await fetch(`/answer/${projectId}/${questionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(answerJSON),
        });

        const stackData = await stack.json();

        return stackData;
    } catch (error) {
        console.error('에러 --- ', error);
        throw new error(error);
    }
}

async function postApplicant(projectId) {
    try {
        const applicant = await fetch(
            `/project-post/${projectId}/projectApplicant`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );

        const applicantData = await applicant.json();

        alert(applicantData.message);
    } catch (error) {
        console.error('에러 --- ', error);
        throw new error(error);
    }
}

async function projectApplicant(projectId) {
    const fetchStackData = await fetchStack(projectId);

    const selectStackBox = document.querySelector('.selectStackBox');

    for (let i = 0; i < fetchStackData.length; i++) {
        if (fetchStackData[i].numberOfPeople !== 0) {
            const selectStack = document.createElement('div');
            selectStack.className = 'selectStack';

            selectStack.innerHTML = `<input
                                    type="radio"
                                    id=${fetchStackData[i].stack}
                                    name="options"
                                    value="${fetchStackData[i].stack}"
                                />
                                <label class="radio-label" for="${fetchStackData[i].stack}">${fetchStackData[i].stack}</label>`;

            selectStackBox.appendChild(selectStack);
        }
    }

    const fetchQuestionData = await fetchQuestion(projectId);

    const questionBox = document.querySelector('.questionBox');

    for (let j = 0; j < fetchQuestionData.length; j++) {
        const question = document.createElement('div');
        question.className = 'question';

        question.innerHTML = `<label for="${fetchQuestionData[j].question}">${fetchQuestionData[j].question}</label>
        <input type="text" id="${fetchQuestionData[j].question}" name="question" class="answer" required />`;

        questionBox.appendChild(question);
    }

    const closeModalBtn = document.querySelector('.closeModalBtn');

    closeModalBtn.addEventListener('click', () => {
        document.querySelector('.modalBox').style.display = 'none';
    });

    const applicantBtn = document.querySelector('.applicantBtn');

    applicantBtn.addEventListener('click', async () => {
        const selectedRadioButton = document.querySelector('input[name="options"]:checked');
        const inputValue = document.querySelectorAll('.answer');

        if (selectedRadioButton) {
            const selectStack = selectedRadioButton.value;
            for (let k = 0; k < fetchQuestionData.length; k++) {
                const answer = inputValue[k].value;

                if (!answer) {
                    return alert(`${k + 1}번째 질문에 답변해주세요`);
                }

                await postStack(projectId, fetchQuestionData[k].id, selectStack, answer);
            }
        } else {
            return alert('라디오 버튼이 선택되지 않았습니다.');
        }

        await postApplicant(projectId);
        document.querySelector('.modalBox').style.display = 'none';
    });
}

async function getProjectDetail() {
    try {
        const data = await fetchProjectDetail(projectId);
        const getStack = await fetchStack(projectId);
        const userInfo = await fetchUserInfo();
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
                            <div class='needStack'>
                                <div class='stackTitleBox'>
                                    <div class="stackTitle">요구 기술</div>
                                    <div class="needPeopleTitle">모집 인원</div>
                                </div>
                                <div class='stackInfoBox'>
                                    <div class='stackInfo'>
                                        <div class="stacks"></div>
                                        <div class="needPeoples"></div>
                                    </div>
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
                        <div class="editBox">
                            <div class='editBtn'>수정</div>
                            <div class='deleteBtn'>삭제</div>
                        </div>
                        <div class="applicantBox">
                            <div class="likeBtn">좋아요</div>
                            <div class="openModalBtn">지원하기</div>
                        </div>
                    </div>
                    <div class="contentBox">
                        <div class ='content'>${data.content}</div>
                    </div>
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

        if (userInfo.id !== data.userId) {
            const editBox = document.querySelector('.editBox');
            editBox.className = 'editBox hide';
        }

        editBtn.addEventListener('click', () => {
            editProjectForm(projectId);
        });

        const deleteBtn = document.querySelector('.deleteBtn');

        deleteBtn.addEventListener('click', () => {
            deleteProjectPost(projectId);
            // window.location.href = './projectPostMain.html';
        });

        const likeBtn = document.querySelector('.likeBtn');

        likeBtn.addEventListener('click', () => {
            if (!userInfo.isVerified) {
                alert('이메일 인증을 먼저 해주세요');
                return (window.location.href = '../Auth/mypage.html');
            }

            postLike(projectId);
        });

        await projectApplicant(projectId);

        const openModalBtn = document.querySelector('.openModalBtn');

        openModalBtn.addEventListener('click', async () => {
            if (!userInfo.isVerified) {
                alert('이메일 인증을 먼저 해주세요');
                return (window.location.href = '../Auth/mypage.html');
            }

            document.querySelector('.modalBox').style.display = 'block';
        });
    } catch (error) {
        console.error('에러 --- ', error);
        throw new error(error);
    }
}

getProjectDetail();
