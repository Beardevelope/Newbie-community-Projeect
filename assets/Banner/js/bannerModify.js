function getBannerIdFromUrl() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const bannerId = urlParams.get('bannerId');

    return bannerId;
}

async function modifyBanner() {
    const bannerId = getBannerIdFromUrl();
    const title = document.getElementById('title').value;
    const pageUrl = document.getElementById('pageUrl').value;
    const fileInput = document.getElementById('file');

    try {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('pageUrl', pageUrl);
        formData.append('file', fileInput.files[0]);

        const TOKEN = sessionStorage.getItem('accessToken');
        // const TOKEN = "토큰"

        const response = await fetch(`/banner/${bannerId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${TOKEN}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`서버 응답이 실패하였습니다. 상태 코드: ${response.status}`);
        }

        if (response.ok) {
            const result = await response.json();
            alert('배너가 수정되었습니다.');
            window.location.href = `bannerDetail.html?bannerId=${bannerId}`;
        }
    } catch (error) {
        console.error('배너 수정 중 오류 발생:', error);
        alert('배너 수정 중 오류가 발생했습니다. 관리자에 문의하세요.');
    }
}

async function getBannerDetails(bannerId) {
    try {
        const TOKEN = sessionStorage.getItem('accessToken');
        // const TOKEN = "토큰"

        const response = await fetch(`/banner/${bannerId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${TOKEN}`,
            },
        });

        if (!response.ok) {
            throw new Error(`서버 응답이 실패하였습니다. 상태 코드: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('배너 정보 가져오기 중 오류 발생:', error);
        alert('배너 정보를 가져오는 중 오류가 발생했습니다. 관리자에 문의하세요.');
        return null;
    }
}

async function populateBannerDetails() {
    const bannerId = getBannerIdFromUrl();
    const bannerDetails = await getBannerDetails(bannerId);
    console.log({ bannerDetails });

    if (bannerDetails) {
        document.getElementById('title').value = bannerDetails.title;
        document.getElementById('pageUrl').value = bannerDetails.pageUrl;

        const bannerImage = document.getElementById('bannerImage');
        bannerImage.src = bannerDetails.file;
        bannerImage.style.maxWidth = '30%';
    }
}

populateBannerDetails();

// 취소 버튼 : 상세페이지로 이동
function cancelModify() {
    const bannerId = getBannerIdFromUrl();
    document.location.href = `bannerDetail.html?bannerId=${bannerId}`;
}
