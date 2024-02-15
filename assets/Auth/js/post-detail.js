const POST_API = 'http://localhost:3000/post';
const COMMENT_API = 'http://localhost:3000/comment';
const USER_ID = 1;
const TOKEN = sessionStorage.getItem('accessToken');
let StringPostId = window.location.search;
const POST_ID = StringPostId.substr(4);

import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';

const headline = document.getElementById('headline');
const mainbar = document.getElementById('mainbar');
const postLayout = document.getElementById('post-layout');
const sidebar = document.getElementById('sidebar');
const commentList = document.querySelector('.comment-list');
const commentEditor = document.querySelector('.comment-editory');
const commentSubmitBtn = document.querySelector('.commentSubmit');
const commentTextArea = document.querySelector('#commentInput');

const getPost = async () => {
    const response = await fetch(`${POST_API}/${POST_ID}`, {
        method: 'GET',
    });
    const data = await response.json();
    if (!response.ok) {
        alert(`${data.message}`);
        throw new Error('서버 오류');
    }
    return data.post;
};

const listDetailPageOfPost = async () => {
    try {
        const post = await getPost();
        const comments = post.comments;

        const timeDifferent = (initialDate) => {
            const date = new Date(initialDate);
            const currentDate = new Date();

            const timeDifference = currentDate - date;

            return Math.floor(timeDifference / 1000);
        };

        const minute = 60;
        const hour = 60 * minute;
        const day = 24 * hour;
        const week = 7 * day;
        const month = 30 * day;
        const year = 365 * day;

        function formatRelativeTime(seconds) {
            if (seconds < minute) {
                return 'just now';
            } else if (seconds < 2 * minute) {
                return 'a minute ago';
            } else if (seconds < hour) {
                return `${Math.floor(seconds / minute)}분`;
            } else if (seconds < 2 * hour) {
                return 'an hour ago';
            } else if (seconds < day) {
                return `${Math.floor(seconds / hour)}시`;
            } else if (seconds < 2 * day) {
                return 'yesterday';
            } else if (seconds < week) {
                return `${Math.floor(seconds / day)}일`;
            } else if (seconds < 2 * week) {
                return 'a week ago';
            } else if (seconds < month) {
                return `${Math.floor(seconds / week)}주`;
            } else if (seconds < 2 * month) {
                return 'a month ago';
            } else if (seconds < year) {
                return `${Math.floor(seconds / month)}달`;
            } else if (seconds < 2 * year) {
                return 'a year ago';
            } else {
                return `${Math.floor(seconds / year)}년`;
            }
        }

        // Format the relative time
        const createdAt = formatRelativeTime(timeDifferent(post.createdAt));
        const updatedAt = formatRelativeTime(timeDifferent(post.updatedAt));

        const tags = post.tags;

        headline.innerHTML = `
        <div class="first-headline">
            <h1 id="headline-title">${post.title}</h1>
            <div id="headline-question">
            </div>
        </div>
        <div class="sub-headline">
            <div id="sub-headline-created">
                <span id="createdAt">${createdAt} 전에 생성</span>
            </div>
            <div id="sub-headline-updatedAt"> 
                <span class="updatedAt">${updatedAt} 전에 수정</span>
            </div>
            <div id="sub-headline-hitcounts">
                <span class="hitCounts">조회수 ${post.hitCount}</span>
            </div>
        </div>
    `;
        postLayout.innerHTML = `
            <div class="vote-bar">
                <div class="vote-buttons">
                        <div id="arrowUp" style="cursor: pointer">👍</div>
                        <div class="vote-count">${post.likes}</div>
                </div>
            </div>
            <div id="post-cell">
                <div id="post-body">${marked(post.content)}</div>
            </div>
    `;
        tags.forEach((tag) => {
            postLayout.innerHTML += `<button type="button" id="${tag.name}" class="tagButton" onclick="location.href='../Post/html/postList.html?tagName=${tag.name}'">${tag.name}</button>`;
        });

        const listComments = async (comments) => {
            commentList.innerHTML = ``;
            const ul = document.createElement('ul');

            const commentsMap = new Map();

            comments.forEach((comment) => {
                const parentId = comment.parentId || 0;
                if (!commentsMap.has(parentId)) {
                    commentsMap.set(parentId, []);
                }
                commentsMap.get(parentId).push(comment);
            });

            const generateCommentList = (parentComments, parentElement) => {
                parentComments.forEach((comment) => {
                    const li = document.createElement('li');
                    parentElement.appendChild(li);
                    li.id = `comment-id-${comment.id}`;
                    li.innerHTML = `
                        ${comment.userId}: ${comment.content}
                        <button class="commentButton" id="${comment.id}">댓글 작성</button>
                        <form class="commentForm" id="form-${comment.id}">
                            <textarea class="commentText" rows="4" cols="50" placeholder="댓글 작성란"></textarea>
                            <button class="submitButton" id="${comment.id}" type="button">댓글 제출</button>
                        </form>
                        <button class="deleteButton" id="${comment.id}">댓글 삭제</button>
                        `;
                        

                    if (commentsMap.has(comment.id)) {
                        const childUl = document.createElement('ul');
                        li.appendChild(childUl);
                        generateCommentList(commentsMap.get(comment.id), childUl);
                    }
                });
            };

            generateCommentList(commentsMap.get(0) || [], ul);

            commentList.appendChild(ul);
        };
        listComments(comments);

        const writeComment = async () => {
            const commentInput = document.getElementById('commentInput');
            const content = commentInput.value.trim();
            const comment = {
                userId: USER_ID,
                postID: POST_ID,
                content: content,
            };
            if (comment) {
                registerComment(comment);
            } else {
                alert('항목이 비어 있습니다.');
            }
        };

        commentSubmitBtn.addEventListener('click', writeComment);
    } catch (error) {
        alert('해당 페이지가 존재하지 않습니다.');
        window.location.href = '/error-page';
        console.error(error);
    }
};

function toggleCommentForm(id) {
    const commentList = document.querySelector('.comment-list ul');
    const commentForm = commentList.querySelector(`#form-${id}`);
    console.log(commentList, commentForm)
    commentForm.style.display = commentForm.style.display === 'none' ? 'block' : 'none';
}

const submitButton = async (id) => {
    console.log(id);
    const textArea = document.querySelector(`#form-${id} textarea`);
    console.log(textArea);
    const comment = {
        userId: USER_ID,
        postId: POST_ID,
        content: textArea.value,
        parentId: id,
    };
    await registerComment(comment);
};

const registerComment = async (comment) => {
    const response = await fetch(`${COMMENT_API}/${POST_ID}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify(comment),
    });

    const newComment = await response.json();
    if (!response.ok) {
        alert(`${newComment.message}`);
        throw new Error('서버 오류');
    }
    alert('댓글 작성 완료');
    commentTextArea.value = '';
    location.reload();
};

const deleteComment = async (commentId) => {
    const response = await fetch(`${COMMENT_API}/${POST_ID}/${commentId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
        },
    });
    const newComment = await response.json();

    if (!response.ok) {
        alert(`${newComment.message}`);
        throw new Error('서버 오류');
    }
    alert('댓글 작성 완료');
    commentTextArea.value = '';
    location.reload();
};

document.addEventListener('DOMContentLoaded', async () => {
    await listDetailPageOfPost();
    document.querySelectorAll('.comment-list ul li .commentButton').forEach((button) => {
        button.addEventListener('click', () => toggleCommentForm(button.id));
    });
    document.querySelectorAll('.comment-list ul li .submitButton').forEach((button) => {
        const commentId = button.id;
        button.addEventListener('click', () => submitButton(commentId));
    });

    document.querySelectorAll('.comment-list ul li .deleteButton').forEach((button) => {
        const commentId = button.id;
        button.addEventListener('click', () => deleteComment(commentId));
    });

    const likeButton = document.getElementById('arrowUp'); // 여기서 likeButton을 찾음

    likeButton.addEventListener('click', () => {
        clickLikeButton();
    });
});

// 좋아요 누르기
let pagePostId = window.location.search;
const currentPostId = pagePostId.substr(4);

async function clickLikeButton() {
    try {
        const response = await fetch(`http://localhost:3000/post-like/${currentPostId}`, {
            method: 'post',
            headers: {
                Authorization:
                    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImVtYWlsIjoibWluaGVlMkB5YWhvby5jb20iLCJpZCI6MiwidHlwZSI6ImFjY2VzcyIsImlhdCI6MTcwNzc3NTQ1NCwiZXhwIjoxNzA3Nzc5MDU0fQ.BTHmzDufXCEltpXSuzNMQ0g0irnoBmn6DusIpwRkfog',
            },
        });
        const jsonData = await response.json();
        const like = jsonData.like;
        if (response.status !== 201) {
            //cry catch 구문에서 throw는 에러가 발생했을 때 catch에다가 error를 던져준다.
            throw new Error('게시글 좋아요클릭에 실패하였습니다.');
        }
        if (like === 1) {
            alert(`해당 게시글을 좋아합니다.`);
            window.location.href = `./post-detail.html?id=${currentPostId}`;
            return;
        }
        alert(`해당 게시글의 좋아요를 취소합니다.`);
        window.location.href = `./post-detail.html?id=${currentPostId}`;
    } catch (err) {
        console.log(err);
        alert(err.message);
    }
}

// 게시글 status(해결, 미해결) 바꾸기
const statusButton = document.getElementById('statusButton')
statusButton.addEventListener('click', () => {
    clickStatusButton();
});
console.log(statusButton)

async function clickStatusButton () {
    try {
        const response = await fetch(`http://localhost:3000/post/${currentPostId}/status`, {
            method: 'put',
            headers: {
                Authorization:
                    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoibWluaGVlQHlhaG9vLmNvbSIsImlkIjoxLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzA3Nzc2OTcyLCJleHAiOjE3MDc3ODA1NzJ9.r3pbTSEu749jMAr-g69pQ1XKRcjmr9uS_guhZQ4d3h8',
            },
        });
        const jsonData = await response.json();
        const postStatus = jsonData.postStatus;
        if (response.status !== 200) {
            //cry catch 구문에서 throw는 에러가 발생했을 때 catch에다가 error를 던져준다.
            throw new Error('게시글 상태변경에 실패하였습니다.');
        }
        if (postStatus === 1) {
            alert(`해당 게시글의 상태를 해결로 변경하였습니다.`);
            window.location.href = `./post-detail.html?id=${currentPostId}`;
            return;
        }
        alert(`해당 게시글의 상태를 미해결로 변경하였습니다.`);
        window.location.href = `./post-detail.html?id=${currentPostId}`;
    } catch (err) {
        console.log(err);
        alert(err.message);
    }
}