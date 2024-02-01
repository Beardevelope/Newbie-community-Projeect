document.getElementById('dataForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const accessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiOTg4NzZAbmF2ZXIuY29tIiwiaWQiOjEsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE3MDY3ODY0NzcsImV4cCI6MTcwNjc5MDA3N30.RQ0VPbPO9xwRPeYo--vGyuoHW8vc8U-3ZfP6_NePfgw';

    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('content', document.getElementById('content').value);
    formData.append('image', document.getElementById('image').files[0]);
    formData.append('applicationDeadLine', document.getElementById('applicationDeadLine').value);
    formData.append('startDate', document.getElementById('startDate').value);
    formData.append('dueDate', document.getElementById('dueDate').value);

    try {
        const responseProject = await fetch('http://localhost:3000/project-post', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
        });

        const createdProjectPost = await responseProject.json();
        const projectId = createdProjectPost.id;

        console.log(projectId, '프로젝트아이디입니다');

        const stack = document.getElementById('stack').value;
        const numberOfPeople = parseInt(document.getElementById('numberOfPeople').value);

        // stack과 numberOfPeople을 백엔드로 전송하여 처리합니다.
        const responseStack = await fetch(`http://localhost:3000/need-info/${projectId}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json', // JSON 형식의 데이터를 전송합니다.
            },
            body: JSON.stringify({ stack, numberOfPeople }), // stack과 numberOfPeople을 JSON 형식으로 변환하여 전송합니다.
        });

        alert('데이터가 성공적으로 전송되었습니다.');
        window.location.reload();
    } catch (error) {
        console.error('오류:', error);
        alert('데이터 전송 중 오류가 발생했습니다.');
    }
});
