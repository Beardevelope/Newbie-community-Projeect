async function fetchProject(page) {
    try {
        const response = await fetch(`http://localhost:3000/project-post?page=${page}`, {
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
        const response = await fetch(`http://localhost:3000/need-info/${projectPostId}`, {
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
        const response = await fetch(`http://localhost:3000/like/${projectPostId}`, {
            method: 'GET',
        });

        const data = await response.json();
        console.log(data, '라이크입니다');

        return data.length;
    } catch (error) {
        console.error('에러 --- ', error);
        throw new error(error);
    }
}

async function getProject() {
    try {
        const data = await fetchProject(1);

        await getPages(data);

        const { sortPost } = data;

        console.log(data);
        for (let i = 0; i < sortPost.length; i++) {
            const stack = await fetchStack(sortPost[i].id);
            const like = await fetchLike(sortPost[i].id);

            console.log(like);

            const project = document.createElement('div');
            project.className = 'project';

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
            <div class="period">기간 : ${sortPost[i].startDate} ~ ${sortPost[i].dueDate}</div>
            <div class="deadLine">마감일 : ~${sortPost[i].applicationDeadLine}</div>
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

            for (let j = 0; j < stack.length; j++) {
                const getStack = document.createElement('div');
                getStack.className = 'stack';

                getStack.innerHTML = `${stack[j].stack}`;

                const stackBox = document.querySelector('.stackBox');

                stackBox.appendChild(getStack);
            }

            const projects = document.querySelector('.projects');

            projects.appendChild(project);
        }
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
                pageNum[i].className += 'active';
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
}

getProject();
