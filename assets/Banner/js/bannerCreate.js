async function saveBanner() {
    const title = document.getElementById('title').value;
    const pageUrl = document.getElementById('pageUrl').value;
    const image = document.getElementById('image').files[0];

    const TOKEN = sessionStorage.getItem('accessToken');
    // const TOKEN = "토큰"

    // 필수값 설정
    if (!title || !image || !pageUrl) {
        alert('제목,이미지, URL은 필수 입력 항목입니다.');
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('pageUrl', pageUrl);
    formData.append('file', image);

    try {
        const response = await fetch('http://localhost:3000/banner/create', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${TOKEN}`,
            },
            body: formData,
            mode: 'cors',
        })


        if (response.ok) {
            alert('배너가 생성되었습니다.');
            window.location.href = '../html/bannerList.html';
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error);
        alert('배너 생성에 실패했습니다. 관리자에 문의하세요.');
    }
}

// 목록으로 이동
function goToList() {
    document.location.href = '../html/bannerList.html'
}