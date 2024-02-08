// bannerId 가져오는 함수
function getBannerIdFromUrl() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const bannerId = urlParams.get('bannerId');

    return bannerId;
}

// 배너 상세 정보 업데이트
async function updateBannerDetails() {
    const bannerId = getBannerIdFromUrl();
    try {
        const response = await fetch(`http://localhost:3000/banner/${bannerId}`);
        const banner = await response.json();

        const clickResponse = await fetch(`http://localhost:3000/banner/click/${bannerId}`, {
            method: 'POST'
        });
        const Click = await clickResponse.json();

        document.getElementById('bannerId').innerText = `배너 ID : ${banner.id}`;
        document.getElementById('bannerTitle').innerText = `배너 제목 : ${banner.title}`;
        document.getElementById('bannerPageUrl').innerText = `홈페이지 주소 : ${banner.pageUrl}`;
        document.getElementById('bannerClick').innerText = `조회수 : ${Click.clickCount}`;

        const bannerImage = document.getElementById('bannerImage');
        bannerImage.src = banner.file;
        bannerImage.style.maxWidth = '30%'; // 이미지 크기 조절
    } catch (error) {
        console.error('Error fetching banner details:', error);
    }
}

updateBannerDetails();

// 배너 삭제
async function deleteBanner() {
    const accessToken = "토큰";
    // const accessToken = localStorage.getItem('accessToken');

    const bannerId = getBannerIdFromUrl();
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


// 수정 페이지로 이동
function editBanner() {
    const bannerId = getBannerIdFromUrl();
    document.location.href = `bannerModify.html?bannerId=${bannerId}`;
}

// 목록으로 이동
function goToList() {
    document.location.href = '../html/bannerList.html'
}