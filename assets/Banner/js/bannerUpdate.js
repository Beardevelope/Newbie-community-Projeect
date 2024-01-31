function updateBannerDetails(banner) {
    // title
    document.getElementById('bannerTitle').innerText = banner.title;

    // file
    const bannerImage = document.getElementById('bannerImage');
    bannerImage.src = banner.file;
}

async function getBannerIdFromUrl() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const bannerId = urlParams.get('bannerId');

    return bannerId;
}

async function loadBannerData() {
    const bannerId = getBannerIdFromUrl();

    // 기존 데이터 가져오기
    const response = await fetch(`http://localhost:3000/baner/${bannerId}`);
    const banner = await response.json();
    console.log(banner);

    // 가져온 데이터를 폼에 채워넣기
    document.getElementById('title').value = banner.title;
    document.getElementById('file').value = banner.file;

    // 파일 업로드의 경우 미리보기 제공
    const fileInput = document.getElementById('image');
    const filePreview = document.getElementById('file-preview');

    fileInput.addEventListener('change', function () {
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onloadend = function () {
            filePreview.src = reader.result;
        };

        if (file) {
            reader.readAsDataURL(file);
        } else {
            filePreview.src = "";
        }
    });

    // 프리뷰 초기화
    filePreview.src = banner.file;
}

async function updateBanner(bannerId) {
    const title = document.getElementById('title').value;
    const fileInput = document.getElementById('image');
    const file = fileInput.files[0];

    // FormData를 사용하여 파일과 데이터를 함께 전송
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);

    const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE3MDY2NDMzMjYsImV4cCI6MTcwNjY0MzYyNn0.Lm-whKn-bQAagVN8qhQP7eoRFhw3TivA65ZM5e_h--A","refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsInR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNzA2NjQzMzI2LCJleHAiOjE3MDY2NDY5MjZ9.SoZYQbcUIikSAPrdUJssRtG79SFr1PRqhxW2Pcynlgk";

    // 백엔드에 수정 요청 보내기
    const response = await fetch(`http://localhost:3000/baner/${bannerId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
    });

    // 응답 처리
    if (response.ok) {
        const result = await response.json();
        console.log('배너 수정 완료:', result);
    } else {
        console.error('배너 수정 실패. 관리자에 문의하세요.');
    }
}

// 초기 로딩 시 데이터 로드
loadBannerData();