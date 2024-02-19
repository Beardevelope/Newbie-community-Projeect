const user = document.querySelector('#user');
const searchButton = document.querySelector('.searchButton');
const nameButton = document.querySelector('.nameButton');
const newButton = document.querySelector('.newButton');
const input = document.querySelector('.input');
let userInfo = [];
let currentPage = 1;
const itemsPerPage = 8; // 페이지당 보여줄 아이템 수
const pagesToShow = 5; // 페이지네이션에 표시할 페이지 수

// 페이지네이션 컨테이너
const paginationContainer = document.getElementById('pagination-container');

// 유저 붙이기
async function userList() {
    try {
        const response = await fetch(`/user/list`, {
            accept: 'application/json',
        });
        const jsonData = await response.json();
        jsonData.forEach((user) => {
            userInfo.push(user);
            userListReading(user);
        });
        // 페이지네이션 업데이트
        updatePagination();
    } catch (error) {
        console.log(error.message);
        alert(error.message);
    }
}

// 유저를 화면에 띄우는 함수
function userListReading(data) {
    let userForm = ` <div class="col" id="${data.id}">
                      <div style ="margin: auto 10px; auto 5px; border-radius: 20px; border-color: blue" class="tag h-100">
                             <div class="tagBody">
                                <button class="tagName" onclick="location.href=''">${data.nickname}</button>
                             </div>
                      </div>
                  </div>`;
    user.innerHTML += `${userForm}`;
}

// 엔터키로 검색하기
function onClick() {
    add();
}

// 마우스로 클릭하여 검색하기
searchButton.addEventListener('click', () => {
    add();
});

// 검색 인풋으로 관련 유저 출력하기
function tagSearch(userInput) {
    user.innerHTML = ``;
    console.log(userInput);
    console.log(userInfo);
    userInfo.forEach(function (user) {
        if (user.nickname.toLowerCase().includes(userInput.toLowerCase())) {
            userListReading(user);
        }
    });
}

function add() {
    tagSearch(input.value);
}

// 필터
nameButton.addEventListener('click', function () {
    user.innerHTML = ``;
    userInfo = [];
    userList('?order=name');
});

newButton.addEventListener('click', function () {
    user.innerHTML = ``;
    userInfo = [];
    userList('?order=createdAt');
});

// 페이지네이션을 업데이트하는 함수
function updatePagination() {
    const totalPages = Math.ceil(userInfo.length / itemsPerPage);
    const maxPagesToShow = 5; // 화면에 보이는 최대 페이지 수
    paginationContainer.innerHTML = ''; // 페이지네이션 컨테이너 초기화

    // 시작 페이지와 끝 페이지 계산
    let startPage, endPage;
    if (totalPages <= maxPagesToShow) {
        // 전체 페이지 수가 최대 페이지 수 이하인 경우
        startPage = 1;
        endPage = totalPages;
    } else {
        // 전체 페이지 수가 최대 페이지 수보다 많은 경우
        const halfPagesToShow = Math.floor(maxPagesToShow / 2);
        if (currentPage <= halfPagesToShow) {
            // 현재 페이지가 시작 부분에 가까운 경우
            startPage = 1;
            endPage = maxPagesToShow;
        } else if (currentPage + halfPagesToShow >= totalPages) {
            // 현재 페이지가 끝 부분에 가까운 경우
            startPage = totalPages - maxPagesToShow + 1;
            endPage = totalPages;
        } else {
            // 현재 페이지가 중간에 위치한 경우
            startPage = currentPage - halfPagesToShow;
            endPage = currentPage + halfPagesToShow;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('a');
        pageButton.href = '#';
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => goToPage(i));

        const listItem = document.createElement('li');
        listItem.appendChild(pageButton);

        if (i === currentPage) {
            pageButton.classList.add('activeBtn');
        }

        pageButton.style.color = 'black';
        pageButton.style.marginRight = '20px';
        pageButton.style.textDecoration = 'none';

        paginationContainer.appendChild(listItem);
    }

    // 현재 페이지에 해당하는 태그 목록을 표시
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageTags = userInfo.slice(startIndex, endIndex);
    user.innerHTML = '';
    currentPageTags.forEach((user) => userListReading(user));
}

// 페이지 변경 함수
function goToPage(page) {
    currentPage = page;
    updatePagination();
}

// 초기 페이지 로드 시 태그 목록 불러오기
userList();
