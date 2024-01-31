const { error } = require("console");

async function saveBanner() {
    const title = document.getElementById('title').value;
    const image = document.getElementById('image').files[0];

    // 저장된 토큰을 가져오기
    const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE3MDY2NDM2MTYsImV4cCI6MTcwNjY0MzkxNn0.5eFIdSOyZLONZe_kpncDroSb96p5ynK7RXpv921Bqy4";
    // const accessToken = localStorage.getItem('accessToken');

    // 필수값 설정
    if (!title || !image) {
        alert('제목과 이미지는 필수 입력 항목입니다.');
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', image);

    try {
        const response = await fetch('http://localhost:3000/banner/create', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            body: formData,
        });
        if (response.ok) {
            alert('배너가 생성되었습니다.');
            window.location.href = '../html/bannerList.html';
        } else {
            alert('배너 생성에 실패했습니다. 관리자에 문의하세요.');
            console.error({ error })
        }

        const result = await response.json();
    } catch (error) {
        console.error(error);
    }
}