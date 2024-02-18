const POST_API = '/post';
const COMMENT_API = '/comment';
const TOKEN = sessionStorage.getItem('accessToken');
let StringPostId = window.location.search;
const POST_ID = StringPostId.substr(4);

import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';

const headline = document.getElementById('headline');
const mainbar = document.getElementById('mainbar');
const postLayout = document.getElementById('post-layout');
const sidebar = document.getElementById('sidebar');
const commentList = document.querySelector('.comment-list');
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

const getCommentsByPostId = async () => {
    const response = await fetch(`${COMMENT_API}/${POST_ID}`, {
        method: 'GET',
    });
    const data = await response.json();
    if (!response.ok) {
        alert(`${data.message}`);
        throw new Error('서버 오류');
    }
    return data;
};

const updateComment = async (comment) => {
    const response = await fetch(`${COMMENT_API}/${POST_ID}/${comment.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify({ content: comment.content }),
    });

    const updatedComment = await response.json();
    if (!response.ok) {
        alert(`${updatedComment.message}`);
        throw new Error('서버 오류');
    }
    alert('댓글 수정 완료');
    location.reload();
};

const listDetailPageOfPost = async () => {
    try {
        const post = await getPost();
        const comments = await getCommentsByPostId();
        console.log(post);
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
                    <div class="commentBox">
                        <div class="comment-content">
                        <p id="userId_${comment.id}">${comment.user.nickname}: </p>
                        <p id="commentText_${comment.id}">${comment.content}</p>
                    </div>

                    <textarea id="editCommentInput_${comment.id}" hidden>${comment.content}</textarea>
                    <form class="commentForm" id="form-${comment.id}">
                        <textarea class="commentText" rows="4" cols="50" placeholder="댓글 작성란"></textarea>
                        <button class="submitButton" id="${comment.id}" type="button">댓글 제출</button>
                    </form>

                    <div class="comment-buttons"> 
                        <button class="commentButton" id="write-${comment.id}">댓글 작성</button>
                        <button class="deleteButton" id="delete-${comment.id}">댓글 삭제</button>
                        <button class="editButton" id="edit-${comment.id}">댓글 수정</button>
                    </div>

                    
                    <button class="confirmButton" id="confirm-${comment.id}" hidden>댓글 완료</button>
                    <button class="cancelButton" id="cancel-${comment.id}" hidden>댓글 취소</button>


                        </div>
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
    commentForm.style.display = commentForm.style.display === 'none' ? 'block' : 'none';
}

const submitButton = async (id) => {
    const textArea = document.querySelector(`#form-${id} textarea`);
    console.log(textArea);
    const comment = {
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
    alert('댓글  삭제 완료');
    commentTextArea.value = '';
    location.reload();
};
const editComment = async (commentId) => {
    const editInput = document.querySelector(`#edit-${commentId}`);
    const commentText = document.querySelector(`#commentText_${commentId}`);
    const writeButton = document.querySelector(`#write-${commentId}`);
    const deleteButton = document.querySelector(`#delete-${commentId}`);
    const confirmButton = document.querySelector(`#confirm-${commentId}`);
    const cancelButton = document.querySelector(`#cancel-${commentId}`);
    const editCommentInput = document.querySelector(`#editCommentInput_${commentId}`);

    editInput.hidden = true;
    commentText.hidden = true;
    writeButton.hidden = true;
    deleteButton.hidden = true;
    editInput.hidden = true;
    editCommentInput.hidden = false;

    confirmButton.hidden = false;
    cancelButton.hidden = false;

    editCommentInput.value = commentText.textContent;
};

document.addEventListener('DOMContentLoaded', async () => {
    await listDetailPageOfPost();
    document.querySelectorAll('.comment-list ul li .commentButton').forEach((button) => {
        const commentId = button.id.split('-').pop();
        button.addEventListener('click', () => toggleCommentForm(commentId));
    });

    document.querySelectorAll('.comment-list ul li .submitButton').forEach((button) => {
        const commentId = button.id.split('-').pop();
        button.addEventListener('click', () => submitButton(commentId));
    });

    document.querySelectorAll('.comment-list ul li .deleteButton').forEach((button) => {
        const commentId = button.id.split('-').pop();

        button.addEventListener('click', () => deleteComment(commentId));
    });

    document.querySelectorAll('.comment-list ul li .editButton').forEach((button) => {
        const commentId = button.id.split('-').pop();
        button.addEventListener('click', () => editComment(commentId));
    });

    document.querySelectorAll('.comment-list ul li .confirmButton').forEach((button) => {
        const commentId = button.id.split('-').pop();
        button.addEventListener('click', async () => {
            const editedCommentText = document.querySelector(
                `#editCommentInput_${commentId}`,
            ).value;
            console.log(editedCommentText);
            const comment = {
                id: commentId,
                content: editedCommentText,
            };
            await updateComment(comment);
        });
    });

    document.querySelectorAll('.comment-list ul li .cancelButton').forEach((button) => {
        const commentId = button.id.split('-').pop();

        const editInput = document.querySelector(`#edit-${commentId}`);
        const commentText = document.querySelector(`#commentText_${commentId}`);
        const writeButton = document.querySelector(`#write-${commentId}`);
        const deleteButton = document.querySelector(`#delete-${commentId}`);
        const confirmButton = document.querySelector(`#confirm-${commentId}`);
        const cancelButton = document.querySelector(`#cancel-${commentId}`);
        const editCommentInput = document.querySelector(`#editCommentInput_${commentId}`);
        button.addEventListener('click', async () => {
            editInput.hidden = false;
            commentText.hidden = false;
            writeButton.hidden = false;
            deleteButton.hidden = false;
            editCommentInput.hidden = true;

            confirmButton.hidden = true;
            cancelButton.hidden = true;
        });
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
        const response = await fetch(`/post-like/${currentPostId}`, {
            method: 'post',
            headers: {
                Authorization: `Bearer ${TOKEN}`,
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
const statusButton = document.getElementById('statusButton');
statusButton.addEventListener('click', () => {
    clickStatusButton();
});
console.log(statusButton);

async function clickStatusButton() {
    try {
        const response = await fetch(`${POST_API}/${currentPostId}/status`, {
            method: 'put',
            headers: {
                Authorization: `Bearer ${TOKEN}`,
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
