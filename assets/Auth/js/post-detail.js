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
                        <button class="arrow-up"></button>
                        <div class="vote-count">${post.likes}</div>
                        <button class="arrow-down"></button>
                </div>
            </div>
            <div id="post-cell">
                <div id="post-body">${marked(post.content)}</div>
            </div>
    `;
        tags.forEach((tag) => {
            postLayout.innerHTML += `<button type="button" id="${tag.name}" class="tagButton" onclick="location.href='./postList.html?tagName=${tag.name}'">${tag.name}</button>`;
        });

        /**좋아요 싫어요 api 없는 거 같아서 우선 안했습니다. */
        const voteUp = document.querySelector('.arrow-up');
        const voteDown = document.querySelector('.arrow-down');

        const listComments = async (comments) => {
            commentList.innerHTML = ``;
            const ul = document.createElement('ul');
            comments.forEach((comment) => {
                const li = document.createElement('li');
                li.textContent = ``;
                ul.appendChild(li);
                li.id = `comment-id-${comment.id}`
                li.innerHTML = `
                ${comment.userId}: ${comment.content}
                <button class="commentButton" id="${comment.id}">Write a Comment</button>
                <form class="commentForm" id="form-${comment.id}">
                  <textarea class="commentText" rows="4" cols="50" placeholder="Type your comment here..."></textarea>
                  <button type="button" onclick="submitComment()">Submit</button>
                </form>`

            });

            commentList.appendChild(ul);
        };
        listComments(comments);

        const writeComment = async () => {
            const commentInput = document.getElementById('commentInput');
            const comment = commentInput.value.trim();
            if (comment) {
                registerComment(comment);
            } else {
                alert('항목이 비어 있습니다.');
            }
        };

        commentSubmitBtn.addEventListener('click', writeComment);

        const registerComment = async (comment) => {
            const response = await fetch(`${COMMENT_API}/${POST_ID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${TOKEN}`
                },
                body: JSON.stringify({
                    userId: USER_ID,
                    postId: POST_ID,
                    content: comment,
                }),
            });

            const newComment = await response.json();
            if (!response.ok) {
                alert(`${newComment.message}`);
                throw new Error('서버 오류');
            }
            comments.push(newComment.comment);
            alert('댓글 작성 완료');
            commentTextArea.value = '';
            listComments(comments);
        };
    } catch (error) {
        alert('해당 페이지가 존재하지 않습니다.');
        window.location.href = '/error-page';
        console.error(error);
    }
};

function toggleCommentForm(id) {
    const commentList = document.querySelector(".comment-list ul")
    console.log(id)
    const commentForm = commentList.querySelector(`#form-${id}`)
    commentForm.style.display = (commentForm.style.display === "none") ? "block" : "none"
}

document.addEventListener('DOMContentLoaded', async () => {
    await listDetailPageOfPost();
    document.querySelectorAll('.comment-list ul li .commentButton').forEach((button) => {
        button.addEventListener('click', () => toggleCommentForm(button.id))
    })
});


