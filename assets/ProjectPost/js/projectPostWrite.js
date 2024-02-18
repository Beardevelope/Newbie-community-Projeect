const accessToken = sessionStorage.getItem('accessToken');

async function projectPost(formData) {
    try {
        const responseProject = await fetch('http://localhost:3000/project-post', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
        });

        const createdProjectPost = await responseProject.json();

        return createdProjectPost;
    } catch (error) {
        console.error('오류:', error);
        throw new error(error);
    }
}

document.getElementById('dataForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('content', document.getElementById('content').value);
    formData.append('image', document.getElementById('image').files[0]);
    formData.append('applicationDeadLine', document.getElementById('applicationDeadLine').value);
    formData.append('startDate', document.getElementById('startDate').value);
    formData.append('dueDate', document.getElementById('dueDate').value);

    const projectPostData = await projectPost(formData);

    const projectId = projectPostData.id;

    const stacks = document.querySelectorAll('#stack');
    const numberOfPeoples = document.querySelectorAll('#numberOfPeople');
    for (let i = 0; i < stacks.length; i++) {
        const stack = stacks[i].value;
        const numberOfPeople = parseInt(numberOfPeoples[i].value);

        try {
            const responseStack = await fetch(`http://localhost:3000/need-info/${projectId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ stack, numberOfPeople }),
            });
        } catch (error) {
            console.error('오류:', error);
            alert('데이터 전송 중 오류가 발생했습니다.');
        }
    }

    const questions = document.querySelectorAll('#question');

    for (let j = 0; j < questions.length; j++) {
        const question = questions[j].value;

        try {
            const responseQuestion = await fetch(`http://localhost:3000/question/${projectId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question }),
            });
        } catch (error) {
            console.error('오류:', error);
            alert('데이터 전송 중 오류가 발생했습니다.');
        }
    }

    alert('데이터가 성공적으로 전송되었습니다.');
    window.location.href = 'projectPostMain.html';
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
