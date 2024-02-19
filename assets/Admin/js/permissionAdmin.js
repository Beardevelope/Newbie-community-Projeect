const USER_API = '/user';
const accessToken = sessionStorage.getItem('accessToken');
const adminPage = document.getElementById('adminPage');

// userId를 추출하는 함수
function extractUserId(token) {
    if (!token) {
        console.error('토큰이 없습니다.');
        return null;
    }
    try {
        // 토큰의 페이로드(payload)를 디코딩하여 사용자 정보를 추출합니다.
        const payload = token.split('.')[1];
        const decodedPayload = atob(payload);
        const userInfo = JSON.parse(decodedPayload);
        const userId = userInfo.id;
        return userId;
    } catch (error) {
        console.error('토큰에서 사용자 ID를 추출하는 중 에러 발생:', error);
        return null;
    }
}

const userId = extractUserId(accessToken);

const getUserList = async () => {
    const response = await fetch(`${USER_API}/by-userId/${userId}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const responseData = await response.json();
    if (!response.ok) {
        alert(`${responseData.message}`);
        throw new Error('서버 에러');
    }
    return responseData;
};

async function showAdminPage() {
    const user = await getUserList(userId);
    const userIsAdmin = user.isAdmin;

    if (userIsAdmin) {
        adminPage.style.display = 'inline-block';
    }
}
if (accessToken) {
    showAdminPage();
}
