document.getElementById('dataForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const accessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidHlwZSI6ImFjY2VzcyIsImlhdCI6MTcwNjY4MzYxOCwiZXhwIjoxNzA2NjgzOTE4fQ.Ioa-hewefEDgMShZwIuaaxf8irWBJ_9qXvMMtmjoUN8';

    const createNeedInfoDto = {
        stack: document.getElementById('stack').value,
        numberOfPeople: parseInt(document.getElementById('numberOfPeople').value),
    };

    const createProjectPostDto = {
        title: document.getElementById('title').value,
        content: document.getElementById('content').value,
        image: document.getElementById('image').files[0], // 이미지 파일
        applicationDeadLine: document.getElementById('applicationDeadLine').value,
        startDate: document.getElementById('startDate').value,
        dueDate: document.getElementById('dueDate').value,
    };

    try {
        const responseProject = await fetch('http://localhost:3000/project-post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(createProjectPostDto),
        });

        const createdProjectPost = await responseProject.json();
        const projectId = createdProjectPost.id; // 새로 생성된 프로젝트 게시물의 ID를 추출

        console.log(projectId, '프로젝트아이디입니다');

        const responseStack = await fetch(`http://localhost:3000/need-info/${projectId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(createNeedInfoDto),
        });

        alert('데이터가 성공적으로 전송되었습니다.');
        window.location.reload(); // 페이지 새로고침
    } catch (error) {
        console.error('오류:', error);
        alert('데이터 전송 중 오류가 발생했습니다.');
    }
});
