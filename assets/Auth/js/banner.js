c
window.addEventListener('scroll', function () {
    var sideBanner = document.querySelector('.sideBanner');
    var scrollPosition = window.scrollY;

    // 배너가 화면 위에 고정되도록 설정합니다.
    sideBanner.style.top = (5 + scrollPosition) + 'px';
});

// 배너 클릭시 조회수 증가
async function handleClickBanner(bannerId) {
    try {
        const response = await fetch(`/banner/click/${bannerId}`, {
            method: 'POST',
        });
        if (response.ok) {
            console.log('조회수 +1');
        } else {
            console.error('Failed to record banner click.');
        }
    } catch (error) {
        console.error('Error recording banner click:', error);
    }
}

// 배너 랜덤 출력 및 광고 페이지 연결
async function displayRandomBanner() {

    const response = await fetch('/banner/random');
    const data = await response.json();

    const bannerId = data.id;
    const bannerImageSrc = data.file;
    const pageUrl = data.pageUrl;

    const bannerImageElement = document.createElement('img');
    bannerImageElement.src = bannerImageSrc;

    const bannerContainer = document.querySelector('.sideBanner');
    bannerContainer.innerHTML = '';
    bannerContainer.appendChild(bannerImageElement);

    bannerContainer.addEventListener('click', function () {
        handleClickBanner(bannerId);
        window.open(pageUrl, '_blank');
    });
}

displayRandomBanner();