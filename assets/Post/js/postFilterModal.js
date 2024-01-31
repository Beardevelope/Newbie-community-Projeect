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

function applyFilters() {
    const orderOption = document.querySelector('input[name="orderOption"]:checked');
    const tabOption = document.querySelector('input[name="tabOption"]:checked');
    const filterOptions = document.querySelector('input[name="filterOption"]:checked');
    // const filterOptions = document.querySelectorAll('input[name="filterOption"]:checked');

    const selectedOrder = orderOption ? orderOption.value : null;
    const selectedTab = tabOption ? tabOption.value : undefined;
    const selectedFilter = filterOptions ? filterOptions.value : undefined;
    // const selectedFilters = filterOptions ? Array.from(filterOptions).map((option) => option.value) : null;

    console.log(selectedOrder, selectedTab, selectedFilter);

    if (!selectedOrder) {
        alert('정렬값을 선택해주세요');
        return;
    }

    questionsList.innerHTML = '';
    foundPosts = [];
    currentPage = 1;

    if (!selectedTab && selectedFilter) {
        postList(`?order=${selectedOrder}&filter=${selectedFilter}`);
        return;
    }

    if (!selectedFilter && selectedTab) {
        postList(`?order=${selectedOrder}&tab=${selectedTab}`);
        return;
    }

    if(!selectedFilter && !selectedTab) {
        postList(`?order=${selectedOrder}`);
        return;
    }

    postList(`?order=${selectedOrder}&tab=${selectedTab}&filter=${selectedFilter}`);
}

// 필터 모달 닫기
function closeFilterModal() {
    applyFilters();
    document.getElementById('filterModal').style.display = 'none';
}
