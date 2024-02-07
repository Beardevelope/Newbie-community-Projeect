// 배너 랜덤으로 출력하기
async function displayRandomBanner() {
    try {
        const response = await fetch('http://localhost:3000/banner/random'); // 랜덤 배너를 가져오는 API 엔드포인트 호출
        const data = await response.json(); // JSON 형태로 변환

        const bannerImageSrc = data.file; // 배너 이미지 URL
        const bannerImageElement = document.createElement('img'); // img 엘리먼트 생성
        bannerImageElement.src = bannerImageSrc; // 이미지 소스 설정
        bannerImageElement.alt = 'Random Banner Image'; // 대체 텍스트 설정
        bannerImageElement.classList.add('banner-image'); // CSS 클래스 추가

        const bannerContainer = document.querySelector('.sideBanner'); // 배너가 표시될 컨테이너 선택
        bannerContainer.innerHTML = ''; // 컨테이너 초기화
        bannerContainer.appendChild(bannerImageElement); // 배너 이미지를 컨테이너에 추가
    } catch (error) {
        console.error('Error fetching random banner:', error);
    }
}

displayRandomBanner();


window.addEventListener('scroll', function () {
    var sideBanner = document.querySelector('.sideBanner');
    var scrollPosition = window.scrollY;

    // 배너가 화면 위에 고정되도록 설정합니다.
    sideBanner.style.top = (5 + scrollPosition) + 'px';
});