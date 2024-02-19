let StringPostId = window.location.search;
const postId = StringPostId.substr(4);
const accessToken = sessionStorage.getItem('accessToken');

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

let editor;

// 위지위그 옵션
ClassicEditor.create(document.querySelector('#editor'), {
    toolbar: {
        items: ['bold', 'italic', 'bulletedlist', 'numberedlist', '|', 'undo', 'redo'],
    },
})
    .then((createdEditor) => {
        editor = createdEditor;
    })
    .catch((error) => {
        console.error(error);
    });

async function putPost() {
    try {
        const form = document.getElementById('putForm');

        // 현재 코드
        const formData = new FormData(form);
        formData.append('content', editor.getData());
        const response = await fetch(`/post/${postId}`, {
            method: 'put',
            headers: {
                Authorization:
                    `Bearer ${accessToken}`,
            },
            body: formData,
        });
        const information = await response.json();

        if (response.status === 401) {
            window.location.reload();
            throw new Error(`로그인 후 이용해주세요`);
        }

        if (response.status === 403) {
            window.location.reload();
            throw new Error(`접근 권한이 없습니다.`);
        }

        if (response.status === 406) {
            window.location.reload();
            throw new Error(`정지 기간에는  사용하실 수 없습니다.`);
        }

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
        const response = await fetch(`/post/${postId}`);
        const postData = await response.json();

        // 폼에 기존 게시글 내용 채우기
        document.getElementById('title').value = postData.post.title;
        document.getElementById('editor').value = editor.setData(postData.post.content);
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
        const response = await fetch(`/post/${postId}`, {
            method: 'delete',
            headers: {
                Authorization:
                    `Bearer ${accessToken}`,
            },
        });

        if (response.status === 401) {
            throw new Error(`로그인 후 이용해주세요`);
        }

        if (response.status === 403) {
            throw new Error(`접근 권한이 없습니다.`);
        }

        if (response.status === 406) {
            throw new Error(`정지 기간에는  사용하실 수 없습니다.`);
        }

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
