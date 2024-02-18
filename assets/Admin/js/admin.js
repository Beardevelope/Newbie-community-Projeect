const USER_API = '/user'
const userList = document.querySelector('.userList')
const TOKEN = sessionStorage.getItem('accessToken') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImVtYWlsIjoidGVzdDAxQHRlc3QuY29tIiwiaWQiOjIsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE3MDc5MTQ1NjEsImV4cCI6MTcwNzkxODE2MX0.ZxKe_q_QWeez4rZupHypDJeQlq_6CPr938Tzz37_FFk'

const getUserList = async () => {
    const response = await fetch(`${USER_API}/list`, {
        method: 'GET',
    });
    const responseData = await response.json();
    if (!response.ok) {
        alert(`${responseData.message}`);
        throw new Error('서버 에러')
    }
    return responseData
}

const modifyUserInfo = async (userId) => {
    const response = await fetch(`${USER_API}/${userId}/banned`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${TOKEN}`,
        },
    });
    const responseData = await response.json();
    if (!response.ok) {
        alert(`${responseData.message}`);
        throw new Error('서버 에러')
    }
    if (response.ok) {
        alert(`${responseData.message}`)
    }
    return responseData
}

const listUser = async () => {
    try {
        const users = await getUserList();
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
                <td>
                    ${user.isBan ? '<span class="banned-label">Banned</span>' : `<button class="view" data-userid="${user.id}">Banned</button>`}
                </td>
            `;
            tbody.appendChild(row);
        });

        userTable.addEventListener('click', async (event) => {
            const targetButton = event.target.closest('button.view');
            if (targetButton) {
                const userId = targetButton.getAttribute('data-userid');
                console.log(`Button with userId ${userId} clicked.`);
                await modifyUserInfo(userId)
            }
        });

        userList.appendChild(userTable);
    } catch (error) {
        console.error(error);
    }
};

const display = async () => {
    await listUser()

}

display()