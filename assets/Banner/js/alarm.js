const TOKEN = sessionStorage.getItem('accessToken');
// const TOKEN = "토큰"

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

// 사용자 ID를 가져온 후에 SSE를 초기화하는 함수를 정의합니다.
const userId = extractUserId(TOKEN);

async function initializeSSE(userId) {
    try {
        // SSE를 초기화합니다.
        const eventSource = new EventSource(`/alarm/${userId}`, {
            headers: { Authorization: `Bearer ${TOKEN}` },
        });

        // SSE 이벤트 수신 및 드롭다운에 출력
        eventSource.onmessage = function (event) {
            const data = JSON.parse(event.data);
            addNotificationToDropdown(data.title, data.description);
            showAlarm(data.title, data.description);
        };
    } catch (error) {
        console.error('에러:', error);
    }
}

// 알림을 화면에 출력
function showAlarm(title, description) {
    console.log(`새 알람: ${title} - ${description}`);
}

// 알림을 드롭다운 메뉴에 추가하는 함수입니다.
function addNotificationToDropdown(title, description) {
    const notificationList = document.getElementById('notificationList');
    const newNotification = document.createElement('li');
    newNotification.innerHTML = `<strong>${title}</strong>: ${description}`;
    notificationList.appendChild(newNotification);
    // 드롭다운 메뉴 표시
    document.getElementById('notificationDropdown').classList.add('show');
}

// 사용자 ID를 가져온 후에 SSE를 초기화합니다.
if (userId) {
    initializeSSE(userId);
}
