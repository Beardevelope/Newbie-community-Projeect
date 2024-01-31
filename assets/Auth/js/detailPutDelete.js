let StringPostId = window.location.search;
const postId = StringPostId.substr(4);

document.addEventListener('DOMContentLoaded', function () {
    const putBtn = document.getElementById('putBtn');

    putBtn.addEventListener('click', async function () {
        // 모달 요소 생성
        const modal = new bootstrap.Modal(document.getElementById('putModal'));

        // 게시글 상세 정보 가져오기
        await getPostDetail();

        // 모달 열기
        modal.show();
    });
});

const cancelBtn = document.getElementById('cancelBtn');
cancelBtn.addEventListener('click', () => {
    const putModal = document.getElementById('putModal');
    putModal.style.display = 'none';
    window.location.reload();
});

const putData = document.getElementById('putData');
putData.addEventListener('click', function () {
    const putModal = document.getElementById('putModal');
    putModal.style.display = 'none';
    putPost();
});

async function putPost() {
    try {
        const form = document.getElementById('putForm');

        // 현재 코드
        const formData = new FormData(form);

        const response = await fetch(`http://localhost:3000/post/${postId}`, {
            method: 'put',
            headers: {
                Authorization:
                    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwidHlwZSI6ImFjY2VzcyIsImlhdCI6MTcwNjcyNTcxOCwiZXhwIjoxNzA2NzI2MDE4fQ.gGQsNfaE7lipeaxvvBmHJ_U4vC_D4xUGPqH4fRLRMtQ',
            },
            body: formData,
        });
        const information = await response.json();
        if (response.status !== 200) {
            //cry catch 구문에서 throw는 에러가 발생했을 때 catch에다가 error를 던져준다.
            window.location.reload();
            throw new Error('게시글 수정에 실패하였습니다.');
        }
        alert(`게시글을 성공적으로 수정하였습니다.`);
        window.location.reload();
    } catch (err) {
        console.log(err);
        alert(err.message);
    }
}

async function getPostDetail() {
    try {
        const response = await fetch(`http://localhost:3000/post/${postId}`);
        const postData = await response.json();

        // 폼에 기존 게시글 내용 채우기
        document.getElementById('title').value = postData.post.title;
        document.getElementById('content').value = postData.post.content;
        const tags = postData.post.tags;
        for (let i = 0; i < tags.length; i++) {
            if (i === tags.length - 1) {
                document.getElementById('tag').value += `${tags[i].name}`;
                return;
            }
            document.getElementById('tag').value += `${tags[i].name},`;
        }
        // 이미지 업로드를 위한 코드는 필요에 따라 추가
    } catch (err) {
        console.error(err);
    }
}

// 게시글 삭제

deleteBtn.addEventListener('click', () => {
    deletePost();
});

async function deletePost() {
    try {
        const response = await fetch(`http://localhost:3000/post/${postId}`, {
            method: 'delete',
            headers: {
                Authorization:
                    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwidHlwZSI6ImFjY2VzcyIsImlhdCI6MTcwNjcxNTMwNCwiZXhwIjoxNzA2NzE1NjA0fQ.SqioTkSXOx7iWNMH7-687OHtZGbRJhGUK7hwwtdGD_g',
            },
        });
        if (response.status !== 200) {
            //cry catch 구문에서 throw는 에러가 발생했을 때 catch에다가 error를 던져준다.
            throw new Error('게시글 삭제에 실패하였습니다.');
        }
        alert(`게시글을 성공적으로 삭제하였습니다.`);
        window.location.href = `../Post/html/postList.html`;
    } catch (err) {
        console.log(err);
        alert(err.message);
    }
}
