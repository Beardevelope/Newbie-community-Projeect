let StringPostId = window.location.search;
const postId = StringPostId.substr(4);

document.addEventListener('DOMContentLoaded', function () {
    const putBtn = document.getElementById('putBtn');

    putBtn.addEventListener('click', function () {
        // 모달 요소 생성
        const modal = new bootstrap.Modal(document.getElementById('putModal'));

        // 모달 열기
        modal.show();
    });
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

        // // 수정된 코드
        // const formData = new FormData();
        // formData.append('title', document.getElementById('title').value);
        // formData.append('content', document.getElementById('content').value);
        // formData.append('tag', document.getElementById('tag').value);
        // formData.append('image', document.getElementById('image').files[0]);

        const response = await fetch(`http://localhost:3000/post/${postId}`, {
            method: 'put',
            headers: {
                Authorization:
                    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwidHlwZSI6ImFjY2VzcyIsImlhdCI6MTcwNjcxNjkxNiwiZXhwIjoxNzA2NzE3MjE2fQ.vtMv_w2rqKI8qf16PHsD_5CiyYlrfG70n4hL4nKV1oI',
            },
            body: formData,
        });
        const information = await response.json();
        console.log(information.message);
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

// 게시글 삭제

// 마우스로 클릭하여 정보수정완료하기
deleteBtn.addEventListener('click', () => {
    console.log('안녕하세요 ');
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
