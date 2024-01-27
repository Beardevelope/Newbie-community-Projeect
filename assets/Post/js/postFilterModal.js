// 모달 열기
function openModal() {
    const modal = document.getElementById('filterModal');
    modal.style.display = 'flex';
}

// 모달 닫기
function closeModal() {
    const modal = document.getElementById('filterModal');
    modal.style.display = 'none';
}

// filterButton 클릭 시 모달 열기
const filterButtonModal = document.getElementById('filterButton');
filterButtonModal.addEventListener('click', openModal);

function openFilterModal() {
    document.getElementById('filterModal').style.display = 'flex';
}

// // 이곳부터는 필터를 위한 로직들
// // 필터를 위한 버튼들
// newestButton.addEventListener('click', function () {
//     questionsList.innerHTML = '';
//     foundPosts = [];
//     currentPage = 1;
//     postList('?order=createdAt');
// });

// answeredButton.addEventListener('click', function () {
//     questionsList.innerHTML = '';
//     foundPosts = [];
//     currentPage = 1;
//     postList('?order=createdAt&tab=answered');
// });

// unAnsweredButton.addEventListener('click', function () {
//     questionsList.innerHTML = '';
//     foundPosts = [];
//     currentPage = 1;
//     postList('?order=createdAt&tab=unAnswered');
// });

// // filter버튼을 활용한 다중 필터링 order(정렬)
// let orderFilter = ''; // 초기화
// // newest
// orderNewestButton.addEventListener('click', function (event) {
//     orderFilter = 'createdAt';
//     inputOrderFilter(orderFilter);
// });
// // highest like
// orderLikeButton.addEventListener('click', function (event) {
//     orderFilter = 'likes';
//     inputOrderFilter(orderFilter);
// });
// // most frequent
// orderHitButton.addEventListener('click', function (event) {
//     orderFilter = 'hitCount';
//     inputOrderFilter(orderFilter);
// });

// let tabStatus = '';

// tabUnAnswered.addEventListener('click', function (event) {
//     tabStatus += '&tab=unAnswered';
//     inputOrderFilter(tabStatus);
// });

// statusDone.addEventListener('click', function (event) {
//     tabStatus += '&filter=done';
//     inputOrderFilter(tabStatus);
// });

// statusUnfinished.addEventListener('click', function (event) {
//     tabStatus += '&filter=unfinished';
//     inputOrderFilter(tabStatus);
// });

// // 비동기적 작업으로 인한 함수 설정
// function inputOrderFilter(orderFilter) {
    
// }

// // // 비동기적 작업으로 인한 함수 설정
// // function inputOrderFilter(orderFilter) {
// //     questionsList.innerHTML = '';
// //     foundPosts = [];
// //     currentPage = 1;
// //     postList(`?order=${orderFilter}${tabStatus}`);
// //     tabStatus = '';
// // }

// 필터 모달 닫기
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