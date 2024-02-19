const questionsList = document.getElementById('questionsList');
const searchList = document.getElementById('searchList');
const paginationContainer = document.getElementById('pagination-container');
const newestButton = document.getElementById('newestButton');
const newestButtonSearch = document.getElementById('newestButtonSearch');
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
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const TOKEN_ACCESS_POST = sessionStorage.getItem('accessToken');


let foundPosts = [];
let metaData = [];

// 페이지와 관련된 변수
let currentPage = 1;
const maxPagesToShow = 5; // 표시할 최대 페이지 수

// 포스트 데이터 불러오기
async function postList(orderAndFilter) {
    try {
        // 이전에 추가한 코드는 유지
        if (orderAndFilter) {
            const response = await fetch(`/post${orderAndFilter}`, {
                accept: 'application/json',
            });
            const jsonData = await response.json();
            let posts = jsonData.posts.data;
            let meta = jsonData.posts.meta;

            metaData.push(meta);

            posts.forEach((post) => {
                foundPosts.push(post);
            });
            updatePagination();
            return;
        }

        const response = await fetch(`/post?page=1`, {
            accept: 'application/json',
        });
        const jsonData = await response.json();
        let posts = jsonData.posts.data;
        let meta = jsonData.posts.meta;

        metaData.push(meta);

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

// 엘라스틱 서치
// 포스트 데이터 불러오기
async function searchPost(text) {
    try {
        // 이전에 추가한 코드는 유지
        if (text) {
            const response = await fetch(`/search?text=${text}`, {
                accept: 'application/json',
            });
            const jsonData = await response.json();
            let posts = jsonData.data;
            let meta = jsonData.meta;

            metaData.push(meta);

            posts.forEach((post) => {
                foundPosts.push(post);
            });
            updatePagination();
            return;
        }
    } catch (error) {
        console.log(error.message);
        alert(error.message);
    }
}
// 엘라스틱 서치

// 포스트 데이터를 페이지에 표시
function displayPosts(posts) {
    questionsList.innerHTML = '';
    posts.forEach((post) => {
        const tags = post.tags;

        const questionElement = document.createElement('div');
        questionElement.style.width = '100%';
        questionElement.classList.add('question');
        questionElement.innerHTML = `<h2 style="cursor: pointer; width: 550px;" class="post" id="${post.id}">${post.title}</h2>`;
        if (post.status === 'unfinished') {
            questionElement.innerHTML += `<p>상세내용은 해당 게시글에서 확인하세요<a id="statusPost">미해결</a><button id="${post.id}" class="warningPostButton btn btn-outline-light">게시글 신고</button></p>`;
        } else if (post.status === 'finished') {
            questionElement.innerHTML += `<p>상세내용은 해당 게시글에서 확인하세요<a class="statusPost">해결</a><button id="${post.id}" class="warningPostButton btn btn-outline-light">게시글 신고</button></p>`;
        }
        for (let i = 0; i < tags.length; i++) {
            if (i > 3) {
                break;
            }
            questionElement.innerHTML += `<button id="${tags[i].name}" class="tagButton btn btn-outline-light">${tags[i].name}</button>`;
        }
        questionElement.innerHTML += `<h5 class="commentHitLike">댓글: ${post.comments.length} 조회수: ${post.hitCount} 좋아요: ${post.likes}</h5>`;
        questionsList.appendChild(questionElement);
    });

    // 엘라스틱 서치
    searchList.innerHTML = '';
    posts.forEach((post) => {
        const tags = post.tags;

        const questionElement = document.createElement('div');
        questionElement.style.width = '100%';
        questionElement.classList.add('question');
        questionElement.innerHTML = `<h2 style="cursor: pointer; width: 550px;" class="post" id="${post.id}">${post.title}</h2>`;
        if (post.status === 'unfinished') {
            questionElement.innerHTML += `<p>상세내용은 해당 게시글에서 확인하세요<a id="statusPost">미해결</a><button id="${post.id}" class="warningPostButton btn btn-outline-light">게시글 신고</button></p>`;
        } else if (post.status === 'finished') {
            //questionElement.innerHTML += `<p>${post.content.slice(0, 10)}<a class="statusPost">해결</a><button id="${post.id}" class="warningPostButton btn btn-outline-light">게시글 신고</button></p>`;
            questionElement.innerHTML += `<p>상세내용은 해당 게시글에서 확인하세요<a class="statusPost">해결</a><button id="${post.id}" class="warningPostButton btn btn-outline-light">게시글 신고</button></p>`;
        }
        for (let i = 0; i < tags.length; i++) {
            if (i > 3) {
                break;
            }
            questionElement.innerHTML += `<button id="${tags[i].name}" class="tagButton btn btn-outline-light">${tags[i].name}</button>`;
        }
        questionElement.innerHTML += `<h5 class="commentHitLike">조회수: ${post.hitCount} 좋아요: ${post.likes}</h5>`;
        //questionElement.innerHTML += `<h5 class="commentHitLike">댓글: ${post.comments.length} 조회수: ${post.hitCount} 좋아요: ${post.likes}</h5>`;
        searchList.appendChild(questionElement);
    });
    // 엘라스틱 서치/

    // 새로운 태그 버튼에 이벤트 리스너 추가
    addEventListenersToTagButtons();

    addEventListenersToWarningButton();

    addEventListenersToPost();
}

// 페이지네이션을 업데이트
function updatePagination() {
    let totalPost = metaData[metaData.length - 1].total;
    let itemsPerPage = metaData[metaData.length - 1].itemsPerPage;

    const totalPages = Math.ceil(totalPost / itemsPerPage);

    // 표시할 최대 페이지 수 제한
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    const pagination = generatePagination(startPage, endPage, currentPage, totalPages);
    paginationContainer.innerHTML = '';
    paginationContainer.appendChild(pagination);

    const currentPagePosts = foundPosts;
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

const receivedorderAndFilter = [];
const receiveOrderSearch = [];

// 페이지 변경 함수
function goToPage(page) {
    foundPosts = [];
    currentPage = page;
    questionsList.innerHTML = '';
    searchList.innerHTML = '';
    // 엘라스틱 서치
    if (searchInput.value) {
        if (receiveOrderSearch.length > 0) {
            searchPost(
                `${receiveOrderSearch[receiveOrderSearch.length - 1]}&page=${currentPage}`,
            );
            updatePagination();
            return;
        }
        searchPost(`${searchInput.value}&page=${currentPage}`);
        updatePagination();
        return;
    }
    // 엘라스틱 서치

    if (receivedorderAndFilter.length > 0) {
        postList(
            `${receivedorderAndFilter[receivedorderAndFilter.length - 1]}&page=${currentPage}`,
        );
        updatePagination();
        return;
    }
    postList(`?page=${currentPage}`);
    updatePagination();
}

// 조회수 늘리는 함수
async function addHit(clickedPostId) {
    try {
        const newInformation = {
            id: clickedPostId,
        };
        const response = await fetch(`/post/${clickedPostId}/hit`, {
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
            const detailPageURL = `../../Auth/post-detail.html?id=${clickedPostId}`;
            window.location.href = detailPageURL;
        });
    });
}

// 게시글 신고
function addEventListenersToWarningButton() {
    const warningButtons = document.querySelectorAll('.warningPostButton');
    warningButtons.forEach((button) => {
        button.addEventListener('click', function (event) {
            const clickedPostId = event.target.id;
            warningPost(clickedPostId);
        });
    });
}

async function warningPost(clickedPostId) {
    try {
        const response = await fetch(`/warning/${clickedPostId}`, {
            method: 'post',
            headers: {
                Authorization: `Bearer ${TOKEN_ACCESS_POST}`,
            },
        });
        const data = await response.json();
        if (response.status !== 201) {
            alert(`${data.message}`);
            throw new Error(data.message);
        }
        alert('게시글 경고에 성공하였습니다.');
        window.location.reload();
    } catch (error) {
        console.log(error.message);
    }
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    let StringTagName = window.location.search;
    const tagName = StringTagName.substr(9);
    if (tagName) {
        receivedorderAndFilter.push(`?order=createdAt&tagName=${tagName}`);
        postList(`?order=createdAt&tagName=${tagName}&page=1`);
    } else {
        postList();
    }
});

// 엘라스틱 서치
// 검색
searchButton.addEventListener('click', function (event) {
    if (!searchInput.value) {
        alert('검색어를 입력해주세요');
        return;
    }
    searchList.innerHTML = '';
    foundPosts = [];
    questionsList.style.display = 'none';
    newestButton.style.display = 'none';
    answeredButton.style.display = 'none';
    unAnsweredButton.style.display = 'none';
    filterButton.style.display = 'none';
    askButton.style.display = 'none';
    searchList.style.display = 'inline-block';
    newestButtonSearch.style.display = 'inline-block';

    searchPost(`${searchInput.value}&page=1`);
});
// 엘라스틱 서치
