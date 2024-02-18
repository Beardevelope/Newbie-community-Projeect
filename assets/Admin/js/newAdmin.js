const USER_API = '/user';
const userList = document.querySelector('.userList');
const TOKEN =
    sessionStorage.getItem('accessToken') ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoibWluaGVlQHlhaG9vLmNvbSIsImlkIjoxLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzA4MTAzMjA1LCJleHAiOjE3MDgxMDY4MDV9.X50IZi7lQUdoUi5etg7n5s5fDqhhVZg1Goj-r68jk54';

const getUserList = async () => {
    const response = await fetch(`${USER_API}/list`, {
        method: 'GET',
    });
    const responseData = await response.json();
    if (!response.ok) {
        alert(`${responseData.message}`);
        throw new Error('서버 에러');
    }
    return responseData;
};

const modifyUserInfo = async (userId) => {
    const response = await fetch(`http://localhost:3000/warning/banUser/${userId}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${TOKEN}`,
        },
    });
    const responseData = await response.json();
    if (!response.ok) {
        alert(`${responseData.message}`);
        throw new Error('서버 에러');
    }
    if (response.ok) {
        alert(`${responseData.message}`);
    }
    window.location.reload();
    return responseData;
};

const modifyUserInfoWarning = async (userId) => {
    const response = await fetch(`http://localhost:3000/warning/warningUser/${userId}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${TOKEN}`,
        },
    });
    const responseData = await response.json();
    if (!response.ok) {
        alert(`${responseData.message}`);
        throw new Error('서버 에러');
    }
    if (response.ok) {
        alert(`${responseData.message}`);
    }
    window.location.reload();
    return responseData;
};

const listUser = async () => {
    try {
        const users = await getUserList();
        if (users.length > 0) {
            const userTable = document.createElement('table');
            userTable.className = 'userTable';

            userTable.innerHTML = `
            <caption>
                Developers Rating
            </caption>
            <thead id="">
                <tr>
                    <th>image</th>
                    <th>EMAIL</th>
                    <th>NICKNAME</th>
                    <th>WARNING COUNT</th>
                    <th>WARNING</th>
                    <th>Control</th>
                </tr>
            </thead>
            <tbody></tbody>
            <tfoot>
                <tr>
                    <td colspan="5" class="tablefoot"></td>
                </tr>
            </tfoot>
        `;

            const tbody = userTable.querySelector('tbody');

            users.forEach((user) => {
                const row = document.createElement('tr');
                row.style.borderBottom = '1px solid #000';
                if (user.isBan) {
                    row.classList.add('banned-user');
                }
                row.innerHTML = `
                <td>
                    <img src="${user.image}" alt="img" onerror="this.src='https://i.postimg.cc/yYYd1HV1/katara.jpg'" />
                </td>
                <td>${user.email}</td>
                <td>${user.nickname}</td>
                <td>${user.warningCount}</td>
                <td><button class="warn" data-userid="${user.id}">Warn</button></td>
                <td>
                    ${user.isBan ? '<span class="banned-label">Banned</span>' : `<button class="view" data-userid="${user.id}">Banned</button>`}
                </td>
            `;
                tbody.appendChild(row);
            });

            userTable.addEventListener('click', async (event) => {
                const targetButton = event.target.closest('button.warn');
                if (targetButton) {
                    const userId = targetButton.getAttribute('data-userid');
                    console.log(`Button with userId ${userId} clicked.`);
                    await modifyUserInfoWarning(userId);
                }
            });

            userTable.addEventListener('click', async (event) => {
                const targetButton = event.target.closest('button.view');
                if (targetButton) {
                    const userId = targetButton.getAttribute('data-userid');
                    console.log(`Button with userId ${userId} clicked.`);
                    await modifyUserInfo(userId);
                }
            });

            userList.appendChild(userTable);
        }
    } catch (error) {
        console.error(error);
    }
};

const display = async () => {
    await listUser();
};

display();
