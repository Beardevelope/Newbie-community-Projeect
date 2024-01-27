const tag = document.querySelector('#tag');
const searchButton = document.querySelector('.searchButton');
const input = document.querySelector(".input");
let tagInfo = [];
// 포스터 붙이기
async function tagList() {
    try {
        const response = await fetch(`http://localhost:3000/tag`, {
            accept: 'application/json',
        });
        const jsonData = await response.json();
        const tags = jsonData.tags;
        tags.forEach((tag) => {
            tagInfo.push(tag);
            tagListReading(tag);
        });
    } catch (error) {
        console.log(error.message);
        alert(error.message);
    }
}
tagList();

// 게시글 화면에 띄우는 함수
function tagListReading(data) {
    let tagForm = ` <div class="col" id="${data.id}">
                      <div style ="margin: auto 10px; auto 5px; border-radius: 20px; border-color: blue" class="tag h-100">
                             <div class="tagBody">
                                <button class="tagName" onclick="location.href='../html/postList.html?tagName=${data.name}'">${data.name}</button>
                             </div>
                      </div>
                  </div>`;
    tag.innerHTML += `${tagForm}`;
}

// 엔터키로 검색하기
function onClick() {
    add();
}

// 마우스로 클릭하여 검색하기
searchButton.addEventListener('click', () => {
    add();
});

// 검색 인풋으로 관련 영화 출력하기
function tagSearch(userInput) {
    tag.innerHTML = ``;
    console.log(userInput)
    tagInfo.forEach(function (tag) {
        if (tag.name.toLowerCase().includes(userInput.toLowerCase())) {
            tagListReading(tag);
        }
    });
}

function add() {
    tagSearch(input.value);
}