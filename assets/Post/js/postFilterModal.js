// 모달 열기
function openModal() {
    const modal = document.getElementById('filterModal');
    modal.style.display = 'flex';
}

// 모달 닫기
function closeModal() {
    const modal = document.getElementById('filterModal');
    modal.style.display = 'inline-block';
}

// filterButton 클릭 시 모달 열기
const filterButtonModal = document.getElementById('filterButton');
filterButtonModal.addEventListener('click', openModal);

function openFilterModal() {
    document.getElementById('filterModal').style.display = 'flex';
}

let tag = [];

// 이곳부터는 필터를 위한 로직들
// 필터를 위한 버튼들
newestButton.addEventListener('click', function () {
    questionsList.innerHTML = '';
    foundPosts = [];
    currentPage = 1;
    if (tag.length > 0) {
        receivedorderAndFilter.push(`?order=createdAt&tagName=${tag[tag.length - 1]}`);
        postList(`?order=createdAt&tagName=${tag[tag.length - 1]}&page=1`);
        return;
    }
    receivedorderAndFilter.push(`?order=createdAt`);
    postList(`?order=createdAt&page=1`);
});

answeredButton.addEventListener('click', function () {
    questionsList.innerHTML = '';
    foundPosts = [];
    currentPage = 1;
    if (tag.length > 0) {
        receivedorderAndFilter.push(`?order=createdAt&tab=answered&tagName=${tag[tag.length - 1]}`);
        postList(`?order=createdAt&tab=answered&tagName=${tag[tag.length - 1]}&page=1`);
        return;
    }
    receivedorderAndFilter.push(`?order=createdAt&tab=answered`);
    postList(`?order=createdAt&tab=answered&page=1`);
});

unAnsweredButton.addEventListener('click', function () {
    questionsList.innerHTML = '';
    foundPosts = [];
    currentPage = 1;
    if (tag.length > 0) {
        receivedorderAndFilter.push(
            `?order=createdAt&tab=unAnswered&tagName=${tag[tag.length - 1]}`,
        );
        postList(`?order=createdAt&tab=unAnswered&tagName=${tag[tag.length - 1]}&page=1`);
        return;
    }
    receivedorderAndFilter.push(`?order=createdAt&tab=unAnswered`);
    postList(`?order=createdAt&tab=unAnswered&page=1`);
});

// 태크를 눌렀을 때 태그 필터 적용
function addEventListenersToTagButtons() {
    const tagButtons = document.querySelectorAll('.tagButton');
    tagButtons.forEach((tagButton) => {
        tagButton.addEventListener('click', function (event) {
            questionsList.style.display = 'inline-block';
            newestButton.style.display = 'inline-block';
            answeredButton.style.display = 'inline-block';
            unAnsweredButton.style.display = 'inline-block';
            filterButton.style.display = 'inline-block';
            askButton.style.display = 'inline-block';
            searchList.style.display = 'none';
            newestButtonSearch.style.display = 'none';
            searchInput.value = '';
            const tagName = event.target.id;
            questionsList.innerHTML = '';
            foundPosts = [];
            currentPage = 1;
            receivedorderAndFilter.push(`?tagName=${tagName}`);
            postList(`?tagName=${tagName}&page=1`);
            tag.push(tagName);
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

    if (!selectedOrder) {
        alert('정렬값을 선택해주세요');
        return;
    }

    questionsList.innerHTML = '';
    foundPosts = [];
    currentPage = 1;

    if (tag.length > 0) {
        if (!selectedTab && selectedFilter) {
            receivedorderAndFilter.push(
                `?order=${selectedOrder}&filter=${selectedFilter}&tagName=${tag}`,
            );
            postList(`?order=${selectedOrder}&filter=${selectedFilter}&tagName=${tag}&page=1`);
            return;
        }

        if (!selectedFilter && selectedTab) {
            receivedorderAndFilter.push(
                `?order=${selectedOrder}&tab=${selectedTab}&tagName=${tag}`,
            );
            postList(`?order=${selectedOrder}&tab=${selectedTab}&tagName=${tag}&page=1`);
            return;
        }

        if (!selectedFilter && !selectedTab) {
            receivedorderAndFilter.push(`?order=${selectedOrder}&tagName=${tag}`);
            postList(`?order=${selectedOrder}&tagName=${tag}&page=1`);
            return;
        }
        receivedorderAndFilter.push(
            `?order=${selectedOrder}&tab=${selectedTab}&filter=${selectedFilter}&tagName=${tag}`,
        );
        postList(
            `?order=${selectedOrder}&tab=${selectedTab}&filter=${selectedFilter}&tagName=${tag}&page=1`,
        );
        return;
    }

    if (!selectedTab && selectedFilter) {
        receivedorderAndFilter.push(`?order=${selectedOrder}&filter=${selectedFilter}`);
        postList(`?order=${selectedOrder}&filter=${selectedFilter}&page=1`);
        return;
    }

    if (!selectedFilter && selectedTab) {
        receivedorderAndFilter.push(`?order=${selectedOrder}&tab=${selectedTab}`);
        postList(`?order=${selectedOrder}&tab=${selectedTab}&page=1`);
        return;
    }

    if (!selectedFilter && !selectedTab) {
        receivedorderAndFilter.push(`?order=${selectedOrder}`);
        postList(`?order=${selectedOrder}&page=1`);
        return;
    }

    receivedorderAndFilter.push(
        `?order=${selectedOrder}&tab=${selectedTab}&filter=${selectedFilter}`,
    );
    postList(`?order=${selectedOrder}&tab=${selectedTab}&filter=${selectedFilter}&page=1`);
    return;
}

// 필터 모달 닫기
function closeFilterModal() {
    applyFilters();
    document.getElementById('filterModal').style.display = 'none';
}

//엘라스틱서치정렬
newestButtonSearch.addEventListener('click', function () {
    searchList.innerHTML = '';
    foundPosts = [];
    currentPage = 1;
    receiveOrderSearch.push(`${searchInput.value}&order=createdAt`);
    searchPost(`${searchInput.value}&page=1&order=createdAt`);
});
