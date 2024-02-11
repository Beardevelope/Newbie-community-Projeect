const questionsList = document.getElementById('questionsList');
const paginationContainer = document.getElementById('pagination-container');
const newestButton = document.getElementById('newestButton');
const answeredButton = document.getElementById('answeredButton');
const unAnsweredButton = document.getElementById('unAnsweredButton');
const filterButton = document.getElementById('filterButton');
const orderNewestButton = document.getElementById('orderNewestButton');
const orderLikeButton = document.getElementById('orderLikeButton');
const orderHitButton = document.getElementById('orderHitButton');
const manyFilterButton = document.getElementById('manyFilterButton');
const tabUnAnswered = document.getElementById('tabUnAnswered');
const statusDone = document.getElementById('statusDone');
const statusUnfinished = document.getElementById('statusUnfinished');

let foundPosts = [];

// 페이지와 관련된 변수
const itemsPerPage = 3; // 페이지당 아이템 수
let currentPage = 1;
const maxPagesToShow = 5; // 표시할 최대 페이지 수

// 포스트 데이터 불러오기
async function postList(orderAndFilter) {
    try {
        // 이전에 추가한 코드는 유지
        if (orderAndFilter) {
            const response = await fetch(`http://localhost:3000/post${orderAndFilter}`, {
                accept: 'application/json',
            });
            const jsonData = await response.json();
            let posts = jsonData.posts;

            posts.forEach((post) => {
                foundPosts.push(post);
            });
            updatePagination();
            return;
        }

        const response = await fetch(`http://localhost:3000/post`, {
            accept: 'application/json',
        });
        const jsonData = await response.json();
        let posts = jsonData.posts;

        posts.forEach((post) => {
            foundPosts.push(post);
        });

        // 페이지네이션을 업데이트
        updatePagination();
    } catch (error) {
        console.log(error.message);
        alert(error.message);
    }
}

// 포스트 데이터를 페이지에 표시
function displayPosts(posts) {
    questionsList.innerHTML = '';
    posts.forEach((post) => {
        const tags = post.tags;

        const questionElement = document.createElement('div');
        questionElement.style.width = '820px';
        questionElement.classList.add('question');
        questionElement.innerHTML = `<h2 style="cursor: pointer" class="post" id="${post.id}">${post.title}</h2><p>${post.content.slice(0, 20)}...</p>`;
        for (let i = 0; i < tags.length; i++) {
            if (i > 3) {
                break;
            }
            // continue를 사용하면 쓸데없는 반복문을 실행한다.
            // if (i > 3) {
            //     continue;
            // }
            questionElement.innerHTML += `<button id="${tags[i].name}" class="tagButton">${tags[i].name}</button>`;
           
        }
        questionElement.innerHTML += `<h5 class="commentHitLike">댓글: ${post.comments.length} 조회수: ${post.hitCount} 좋아요: ${post.likes}</h5>`;
        questionsList.appendChild(questionElement);
    });

    // 새로운 태그 버튼에 이벤트 리스너 추가
    addEventListenersToTagButtons();

    addEventListenersToPost();
}

// 페이지네이션을 업데이트
function updatePagination() {
    const totalPages = Math.ceil(foundPosts.length / itemsPerPage);

    // 표시할 최대 페이지 수 제한
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    const pagination = generatePagination(startPage, endPage, currentPage, totalPages);
    paginationContainer.innerHTML = '';
    paginationContainer.appendChild(pagination);

    // 현재 페이지에 해당하는 포스트 표시
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPagePosts = foundPosts.slice(startIndex, endIndex);
    displayPosts(currentPagePosts);
}

// 페이지네이션을 생성
function generatePagination(startPage, endPage, currentPage, totalPages) {
    const paginationUl = document.createElement('ul');
    paginationUl.classList.add('pagination');

    for (let i = startPage; i <= endPage; i++) {
        const pageLink = document.createElement('a');
        pageLink.href = '#';
        pageLink.textContent = i;
        pageLink.addEventListener('click', () => goToPage(i));

        const listItem = document.createElement('li');
        listItem.appendChild(pageLink);

        if (i === currentPage) {
            pageLink.classList.add('active');
        }

        paginationUl.appendChild(listItem);
    }

    return paginationUl;
}

// 페이지 변경 함수
function goToPage(page) {
    currentPage = page;
    updatePagination();
}

// 조회수 늘리는 함수
async function addHit(clickedPostId) {
    try {
        const newInformation = {
            id: clickedPostId,
        };
        const response = await fetch(`http://localhost:3000/post/${clickedPostId}/hit`, {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newInformation),
        });
        const information = await response.json();
        if (response.status !== 200) {
            throw new Error(information.message);
        }
    } catch (error) {
        console.log(error.message);
    }
}

// 게시글 제목 클릭했을 때 실행되는 로직
function addEventListenersToPost() {
    const posts = document.querySelectorAll('.post');
    posts.forEach((post) => {
        post.addEventListener('click', function (event) {
            const clickedPostId = event.target.id;
            // 조회수 늘리는 함수 실행
            addHit(clickedPostId);
            // 상세 조회 페이지 URL을 생성하여 이동
            // const detailPageURL = `./detail.html?id=${clickedPostId}`;
            const detailPageURL = `../../Auth/post-detail.html?id=${clickedPostId}`;
            window.location.href = detailPageURL;
        });
    });
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    let StringTagName = window.location.search;
    const tagName = StringTagName.substr(9);
    if (tagName) {
        postList(`?tagName=${tagName}`);
        tag.push(tagName)
    } else {
        postList();
    }
});
