const USER_API = '/user'
const userList = document.querySelector('.userList')

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

const displayBannedUsers = async () => {
    try {
        const users = await getUserList()
        const userBanned = users.filter((user) => {
            return user.isBan === true 
        })
        const userTable = document.createElement('table')
        userTable.className = 'userTable'
        console.log(users)
        userTable.innerHTML = `
            <caption>
                Developers Rating
            </caption>
            <thead>
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

        userBanned.forEach((user) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${user.image}" alt="img" onerror="this.src='https://i.postimg.cc/yYYd1HV1/katara.jpg'" />
                </td>
                <td>${user.email}</td>
                <td>${user.nickname}</td>
                <td>${user.warningCount}</td>
                <td>
                    <span class="banned-label">Banned</span>
                </td>
            `;
            tbody.appendChild(row);
        });

        userList.appendChild(userTable);
    } catch (error) {
        console.error(error)
    }

}
displayBannedUsers()