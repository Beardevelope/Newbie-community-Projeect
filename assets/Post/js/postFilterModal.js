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

// function closeFilterModal() {
//     document.getElementById('filterModal').style.display = 'none';
// }