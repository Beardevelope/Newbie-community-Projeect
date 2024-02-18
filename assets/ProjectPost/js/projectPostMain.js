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

async function fetchProject(page) {
    try {
        const response = await fetch(`/project-post?page=${page}`, {
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

async function fetchStack(projectPostId) {
    try {
        const response = await fetch(`/need-info/${projectPostId}`, {
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

async function fetchLike(projectPostId) {
    try {
        const response = await fetch(`/project-like/${projectPostId}`, {
            method: 'GET',
        });

        const data = await response.json();

        return data;
    } catch (error) {
        console.error('에러 --- ', error);
        throw new error(error);
    }
}

async function getProject(page) {
    try {
        const data = await fetchProject(page);

        const projects = document.querySelector('.projects');

        projects.innerHTML = '';

        if (page === 1) {
            await getPages(data);
        }
        const { sortPost, pageSize } = data;

        console.log(sortPost.length, '솔페렝');

        for (let i = 0; i < sortPost.length; i++) {
            const stack = await fetchStack(sortPost[i].id);
            console.log(stack, `${i}프로젝트`);
            console.log(stack.length, `${i}프로젝트길이`);
            const like = await fetchLike(sortPost[i].id);

            console.log(stack, '스택입니다');

            const project = document.createElement('div');
            project.className = 'project';
            project.addEventListener('click', () => {
                window.location.href = `projectPostDetail.html?id=${sortPost[i].id}`;
            });

            project.innerHTML = `
            <div class="projectContent">
                <div class="projectImg">
                    <img src="${sortPost[i].image}"/>
                </div>
                <div class="statusBox">
                    <div class="status">${sortPost[i].status}</div>
                    <div class="stackBox">
                    </div>
                </div>
            </div>
            <div class="date">
                <div class="projectTitle">${sortPost[i].title}</div>
                <div class="period">기간 : ${sortPost[i].startDate.split('T')[0]} ~ ${sortPost[i].dueDate.split('T')[0]}</div>
                <div class="deadLine">마감일 : ~${sortPost[i].applicationDeadLine.split('T')[0]}</div>
            </div>
            <div class="countBox">
                <div class="hitCount">
                    <div>👀</div>
                    <div class="hitCounts">${sortPost[i].hitCount}</div>
                </div>
                <div class="like">
                    <div>❤</div>
                    <div class="likeCounts">${like}</div>
                </div>
            </div>
            `;

            projects.appendChild(project);

            for (let j = 0; j < stack.length; j++) {
                const getStack = document.createElement('div');
                getStack.className = 'stack';

                getStack.innerHTML = `${stack[j].stack}`;

                console.log(getStack.innerHTML, '추출한 스택입니다');

                const stackBox = document.querySelectorAll('.stackBox');

                stackBox[i].appendChild(getStack);
            }

            const status = document.querySelector('.status');

            if (status.innerHTML === '모집완료') {
                status.className = 'status done';
            } else {
                status.className = 'status';
            }
        }

        const writeBtn = document.querySelector('.writeBtn');
        const userInfo = await fetchUserInfo();

        writeBtn.addEventListener('click', () => {
            if (!userInfo.isVerified) {
                alert('이메일 인증을 먼저 해주세요');
                return (window.location.href = '../Auth/mypage.html');
            }

            window.location.href = 'projectPostWrite.html';
        });
    } catch (error) {
        console.error('에러 --- ', error);
        throw new error(error);
    }
}

async function getPages(data) {
    try {
        const { lastPage } = data;

        console.log(lastPage, '라스트페이지입니다');

        for (let i = 1; i < lastPage + 1; i++) {
            const pageNum = document.createElement('div');
            pageNum.className = 'pageNum';

            if (i === 1) {
                pageNum.className = 'pageNum active';
            }

            pageNum.onclick = function (event) {
                movePage(event.target);
            };

            pageNum.innerHTML = i;

            const pageBox = document.querySelector('.pageBox');

            pageBox.appendChild(pageNum);
        }
    } catch (error) {
        console.error('에러 --- ', error);
        throw new error(error);
    }
}

async function movePage(clickedDiv) {
    const pageNum = document.querySelectorAll('.pageNum');
    for (let i = 0; i < pageNum.length; i++) {
        pageNum[i].className = 'pageNum';
    }
    clickedDiv.className += ' active';

    console.log(clickedDiv);

    await getProject(clickedDiv.innerHTML);
}

getProject(1);
