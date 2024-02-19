const TOKEN = sessionStorage.getItem('accessToken');

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

const userId = extractUserId(TOKEN);

async function initializeSSE(userId) {
    try {
        // 이전 알람을 가져오기
        await fetchAlarms(userId);

        // SSE를 초기화합니다.
        const eventSource = new EventSource(`/alarm/${userId}`, {
            headers: { Authorization: `Bearer ${TOKEN}` },
        });

        // SSE 이벤트 수신 및 화면에 출력
        eventSource.onmessage = function (event) {
            const data = JSON.parse(event.data);
            addNotificationToDropdown(data.title, data.description);
            showAlarm(data.title, data.description);
        };
    } catch (error) {
        console.error('에러:', error);
    }
}

// 알람 내역 가져오기
async function fetchAlarms(userId) {
    try {
        const response = await fetch(`/alarm/storage/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${TOKEN}`,
            }
        });
        if (response.ok) {
            const alarms = await response.json();
            alarms.forEach(alarm => {
                addNotificationToDropdown(alarm.title, alarm.description);
            });
        } else {
            console.error('알람을 불러오는 데 실패했습니다.');
        }
    } catch (error) {
        console.error('알람을 불러오는 중 에러 발생:', error);
    }
}

// 알림을 화면에 출력
function showAlarm(title, description) {
    console.log(`새 알람: ${title} - ${description}`);
}

// 알림 내역 드롭다운에 출력
function addNotificationToDropdown(title, description) {
    const notificationList = document.getElementById("notificationList");
    const newNotification = document.createElement("li");
    newNotification.innerHTML = `<strong>${title}</strong>: ${description}`;
    notificationList.appendChild(newNotification);
    // 드롭다운 메뉴 표시
    document.getElementById("notificationDropdown").classList.add("show");
}

initializeSSE(userId);