// 폼 데이터 수집
const title = document.querySelector('#title');
const content = document.querySelector('#content');
const image = document.querySelector('#image');
const tags = document.querySelector('#tags');
const TOKEN = sessionStorage.getItem('accessToken')

// askButton에 이벤트 리스너 추가
const askButton = document.getElementById('askButton');
askButton.addEventListener('click', openAskModal);

// 모달 창 열기
function openAskModal() {
    const askModal = document.getElementById('askModal');
    askModal.style.display = 'flex';
}

// 모달 창 닫기
function closeAskModal() {
    const askModal = document.getElementById('askModal');
    askModal.style.display = 'none';
}

// 폼 제출 시 동작할 함수
function submitForm() {
    createPost();
    closeAskModal();
}

// 폼 제출 이벤트 리스너 추가
const submitButton = document.getElementById('submitButton');
submitButton.addEventListener('click', function (event) {
    submitForm();
});

// 게시글 생성
async function createPost() {
    try {
        const form = document.getElementById('askForm');
        const formData = new FormData(form);
        // const refinedTags = tags.value.split(',');
        // const newInformation = {
        //     title: title.value,
        //     content: content.value,
        //     image: image.value,
        //     tag: refinedTags,
        // };
        const response = await fetch(`http://localhost:3000/post`, {
            method: 'post',
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                // 'Content-Type': 'application/json',
            },
            // body: JSON.stringify(newInformation),
            body: formData,
        });
        if (response.status !== 201) {
            //cry catch 구문에서 throw는 에러가 발생했을 때 catch에다가 error를 던져준다.
            throw new Error('게시글 등록에 실패하였습니다.');
        }

        alert('게시글을 성공적으로 등록하였습니다.');
        window.location.reload();
    } catch (err) {
        console.log(err);
        alert(err.message);
    }
}
