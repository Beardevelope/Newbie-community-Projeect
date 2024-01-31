function updateBannerDetails(banner) {
    document.getElementById('bannerId').innerText = banner.id;
    document.getElementById('bannerTitle').innerText = banner.title;
    const bannerImage = document.getElementById('bannerImage');
    bannerImage.src = banner.file;
    bannerImage.style.maxWidth = '30%'; // 이미지 크기 조절
}

// bannerId 가져오는 함수
function getBannerIdFromUrl() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const bannerId = urlParams.get('bannerId');

    return bannerId;
}

// 배너 상세 정보
async function getBannerById() {
    const bannerId = getBannerIdFromUrl();
    try {
        const response = await fetch(`http://localhost:3000/banner/${bannerId}`);
        const data = await response.json();

        updateBannerDetails(data);
    } catch (error) {
        console.error('Error fetching banner details:', error);
    }
}
getBannerById();

// 수정 페이지로 이동
function editBanner() {
    const bannerId = getBannerIdFromUrl();
    document.location.href = `bannerModify.html?bannerId=${bannerId}`;
}

// 배너 삭제
async function deleteBanner() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const bannerId = urlParams.get('bannerId');

    const accessToken = "토큰";
    // const accessToken = localStorage.getItem('accessToken');

    try {
        const response = await fetch(`http://localhost:3000/banner/${bannerId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (response.ok) {
            alert('배너가 삭제되었습니다.');
            window.location.href = '../html/bannerList.html';
        } else {
            alert('삭제에 실패했습니다. 관리자에 문의하세요.');
            console.error('Failed to delete the banner.');
        }
    } catch (error) {
        console.error('Error deleting the banner:', error);
    }
}

// 목록으로 이동
function goToList() {
    document.location.href = '../html/bannerList.html'
}