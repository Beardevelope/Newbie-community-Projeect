const post_API = 'http://localhost:3000/warning';
const userList = document.querySelector('.userList');
const TOKEN =
    sessionStorage.getItem('accessToken') ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoibWluaGVlQHlhaG9vLmNvbSIsImlkIjoxLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzA4MTIxNjM3LCJleHAiOjE3MDgxMjUyMzd9.aOp-Qtbt6LwF7biGVKw_PgLYyztyDqNNQXoNmT1l3R4';
let StringPostId = window.location.search;
const POST_ID = StringPostId.substr(4);

const getWarning = async () => {
const response = await fetch(`${post_API}/${POST_ID}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${TOKEN}`,
        },
    });
    const responseData = await response.json();
    const responseWarnings = responseData.warnings;
    if (!response.ok) {
        alert(`${responseData.message}`);
        throw new Error('서버 에러');
    }
    return responseWarnings;
};

const getUserByUserId = async () => {
    const responseWarnings = await getWarning();
    const responseUsersPromises = responseWarnings.map(async (warning) => {
        const response = await fetch(`http://localhost:3000/user/by-userId/${warning.userId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${TOKEN}`,
            },
        });
        const responseUser = response.json();
        return responseUser;
    });

    const responseUsers = await Promise.all(responseUsersPromises);

    return responseUsers;
};

const listuser = async () => {
    try {
        const responseWarnings = await getWarning();
        const responseUsers = await getUserByUserId();
        console.log(responseWarnings);
        console.log('--------------------------');
        console.log(responseUsers);
        const userTable = document.createElement('table');
        userTable.innerHTML = `
            <caption>
                Developers Rating
            </caption>
            <thead id="">
                <tr>
                    <th>image</th>
                    <th>EMAIL</th>
                    <th>NICKNAME</th>
                    <th>WARNING HITCOUNT</th>
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
        for (let i = 0; i < responseWarnings.length; i++) {
            const row = document.createElement('tr');
            row.style.borderBottom = '1px solid #000';
            row.innerHTML = `
                <td>
                    <img src="${responseUsers[i].profileImage}" alt="img" onerror="this.src='https://i.postimg.cc/yYYd1HV1/katara.jpg'" />
                </td>
                <td>${responseUsers[i].email}</td>
                <td>${responseUsers[i].nickname}</td>
                <td>${responseWarnings[i].count}</td>
            `;
            tbody.appendChild(row);
        }

        userList.appendChild(userTable);
    } catch (error) {
        console.error(error);
    }
};

const display = async () => {
    await listuser();
};

display();
