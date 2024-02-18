let banners = [];

document.addEventListener("DOMContentLoaded", async function () {
    const bannerList = document.getElementById("bannerList");

    const response = await fetch("http://localhost:3000/banner");
    const data = await response.json();

    // 데이터를 테이블에 추가
    data.forEach((banner, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${banner.title}</td>
            <td>${banner.createdAt}</td>
        `;
        // 클릭한 배너의 ID를 이용하여 배너 상세조회로 이동
        row.addEventListener('click', () => {
            goToBannerDetailPage(banner.id);
        });

        bannerList.appendChild(row);
    });
});

// 배너 상세조회 페이지로 이동
function goToBannerDetailPage(bannerId) {
    document.location.href = `bannerDetail.html?bannerId=${bannerId}`;
};

// 배너 생성 페이지로 이동
function goToCreatePage() {
    document.location.href = '../html/bannerCreate.html';
};