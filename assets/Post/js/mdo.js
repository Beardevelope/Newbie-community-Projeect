const AccessToken = sessionStorage.getItem('accessToken');
const dropdown = document.querySelector('.dropdown');

// userId를 추출하는 함수
function extractUserId(AccessToken) {
    if (!AccessToken) {
        console.error('토큰이 없습니다.');
        return null;
    }
    try {
        // 토큰의 페이로드(payload)를 디코딩하여 사용자 정보를 추출합니다.
        const payload = AccessToken.split('.')[1];
        const decodedPayload = atob(payload);
        const userInfo = JSON.parse(decodedPayload);
        const userId = userInfo.id;
        return userId;
    } catch (error) {
        console.error('토큰에서 사용자 ID를 추출하는 중 에러 발생:', error);
        return null;
    }
}

const USER_ID = extractUserId(AccessToken);

async function findByUserId() {
    try {
        const response = await fetch(`/user/by-userId/${USER_ID}`, {
            accept: 'application/json',
        });
        const jsonData = await response.json();

        dropdown.innerHTML = `<a
                        href="#"    
                        class="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        >
                            <img
                                src="${jsonData.profileImage}"
                                alt=""
                                width="32"
                                height="32"
                                class="rounded-circle me-2"
                            />
                            <strong>${jsonData.nickname}</strong>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-dark text-small shadow">
                            <li><a class="dropdown-item" href="#">New project...</a></li>
                            <li><a class="dropdown-item" href="#">Settings</a></li>
                            <li><a class="dropdown-item" href="../../Auth/mypage.html">Profile</a></li>
                            <li><hr class="dropdown-divider" /></li>
                            <li><a class="dropdown-item" id="signOut">Sign out</a></li>
                        </ul>`;
        addEventListenerSignOut();
    } catch (error) {
        console.log(error.message);
        alert(error.message);
    }
}
if (USER_ID) {
    findByUserId();
}

function addEventListenerSignOut() {
    const signOut = document.getElementById('signOut');

    signOut.addEventListener('click', function () {
        sessionStorage.removeItem('accessToken');
        loginButton.style.display = 'inline-block';
        signupButton.style.display = 'inline-block';
        logoutButton.style.display = 'none';
        alert('로그아웃 하였습니다.');
        window.location.reload();
    });
}
