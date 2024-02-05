document.getElementById('dataForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const accessToken =
        sessionStorage.getItem('accessToken') ||
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiOTg4NzZAbmF2ZXIuY29tIiwiaWQiOjEsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE3MDcxMjE3MTEsImV4cCI6MTcwNzEyNTMxMX0.eOxDhUyZ6A2dLYyRTDw_El8KYRC81eQ0yNbjW_0wc40';

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

        const stacks = document.querySelectorAll('#stack');
        const numberOfPeoples = document.querySelectorAll('#numberOfPeople');
        for (let i = 0; i < stacks.length; i++) {
            const stack = stacks[i].value;
            const numberOfPeople = parseInt(numberOfPeoples[i].value);

            const responseStack = await fetch(`http://localhost:3000/need-info/${projectId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ stack, numberOfPeople }),
            });
        }

        const questions = document.querySelectorAll('#question');

        for (let j = 0; j < questions.length; j++) {
            const question = questions[j].value;

            const responseQuestion = await fetch(`http://localhost:3000/question/${projectId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question }),
            });
        }

        alert('데이터가 성공적으로 전송되었습니다.');
        window.location.href = 'projectPostMain.html';
    } catch (error) {
        console.error('오류:', error);
        alert('데이터 전송 중 오류가 발생했습니다.');
    }
});

const addStackBtn = document.querySelector('.addStackBtn');

addStackBtn.addEventListener('click', () => {
    const stackBox = document.querySelector('.stackBox');

    const stack = document.createElement('div');
    stack.className = 'stack';

    stack.innerHTML = ` <label for="stack">스택:</label><br />
    <input type="text" id="stack" name="stack" required /><br /><br />

    <label for="numberOfPeople">인원 수:</label><br />
    <input
        type="number"
        id="numberOfPeople"
        name="numberOfPeople"
        required
    /><br /><br />`;

    stackBox.appendChild(stack);
});

const addQuestionBtn = document.querySelector('.addQuestionBtn');

addQuestionBtn.addEventListener('click', () => {
    const questionBox = document.querySelector('.questionBox');

    const question = document.createElement('div');
    question.className = 'question';

    question.innerHTML = `<label for="question">질문:</label><br />
    <input
        type="text"
        id="question"
        name="question"
        required
    /><br /><br />`;

    questionBox.appendChild(question);
});
