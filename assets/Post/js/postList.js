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
const itemsPerPage = 5; // 페이지당 아이템 수
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

        const response = await fetch(`http://localhost:3000/post?order=createdAt`, {
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
        questionElement.classList.add('question');
        questionElement.innerHTML = `<h2 style="cursor: pointer" class="post" id="${post.id}"><a href="./detail.html?id=${post.id}">${post.title}</a></h2><p>${post.content.slice(0, 20)}...</p>`;
        tags.forEach((tag) => {
            questionElement.innerHTML += `<button id="${tag.name}" class="tagButton">${tag.name}</button>`;
        });
        questionElement.innerHTML += `<h5 class="commentHitLike">댓글: 조회수: ${post.hitCount} 좋아요: ${post.likes}</h5>`;
        questionsList.appendChild(questionElement);
    });

    // 새로운 태그 버튼에 이벤트 리스너 추가
    addEventListenersToTagButtons();

    // addEventListenersToPost();
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

// 이곳부터는 필터를 위한 로직들
// 필터를 위한 버튼들
newestButton.addEventListener('click', function () {
    questionsList.innerHTML = '';
    foundPosts = [];
    currentPage = 1;
    postList('?order=createdAt');
});

answeredButton.addEventListener('click', function () {
    questionsList.innerHTML = '';
    foundPosts = [];
    currentPage = 1;
    postList('?order=createdAt&tab=answered');
});

unAnsweredButton.addEventListener('click', function () {
    questionsList.innerHTML = '';
    foundPosts = [];
    currentPage = 1;
    postList('?order=createdAt&tab=unAnswered');
});

// filter버튼을 활용한 다중 필터링 order(정렬)
let orderFilter = ''; // 초기화
// newest
orderNewestButton.addEventListener('click', function (event) {
    orderFilter = 'createdAt';
    inputOrderFilter(orderFilter);
});
// highest like
orderLikeButton.addEventListener('click', function (event) {
    orderFilter = 'likes';
    inputOrderFilter(orderFilter);
});
// most frequent
orderHitButton.addEventListener('click', function (event) {
    orderFilter = 'hitCount';
    inputOrderFilter(orderFilter);
});

let tabStatus = '';

tabUnAnswered.addEventListener('click', function (event) {
    tabStatus += '&tab=unAnswered';
    inputOrderFilter(orderFilter);
});

statusDone.addEventListener('click', function (event) {
    tabStatus += '&filter=done';
    inputOrderFilter(orderFilter);
});

statusUnfinished.addEventListener('click', function (event) {
    tabStatus += '&filter=unfinished';
    inputOrderFilter(orderFilter);
});

// 비동기적 작업으로 인한 함수 설정
function inputOrderFilter(orderFilter) {
    questionsList.innerHTML = '';
    foundPosts = [];
    currentPage = 1;
    postList(`?order=${orderFilter}${tabStatus}`);
    tabStatus = '';
}

function closeFilterModal() {
    document.getElementById('filterModal').style.display = 'none';
}

// 태크를 눌렀을 때 태그 필터 적용
function addEventListenersToTagButtons() {
    const tagButtons = document.querySelectorAll('.tagButton');
    tagButtons.forEach((tagButton) => {
        tagButton.addEventListener('click', function (event) {
            const tagName = event.target.id;
            questionsList.innerHTML = '';
            foundPosts = [];
            currentPage = 1;
            postList(`?order=createdAt&tagName=${tagName}`);
        });
    });
}
// 여기까지가 필터 관련 로직

// // 게시글 제목을 클릭하면 상세조회페이지로 이동
// function addEventListenersToPost() {
//     const posts = document.querySelectorAll('.post');
//     posts.forEach((post) => {
//         post.addEventListener('click', function (event) {
//             const clickedPostId = event.target.id;
//             alert(`${clickedPostId}`);
//         });
//     });
// }

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    let StringTagName = window.location.search;
    const tagName = StringTagName.substr(9);
    if (tagName) {
        postList(`?order=createdAt&tagName=${tagName}`);
    } else {
        postList();
    }
});