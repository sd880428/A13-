const BASE_URL = 'https://lighthouse-user-api.herokuapp.com/'
const INDEX_URL = BASE_URL + 'api/v1/users/'
const FRIEND_PER_PAGE = 16
let keyword = ''

const Friends_Card = document.querySelector('#friends-box')
const searchFrom = document.querySelector('#search-from')
const searchInput = document.querySelector('#search-input')
const pagination = document.querySelector('.pagination')

const friendList = []
let filtedFriend = []

axios
  .get(INDEX_URL)
  .then(function (Response) {
    friendList.push(...Response.data.results)
    showFriendsByPage(1)
    randerPagination(friendList)
  })
  .catch(function (error) {
    console.log(error);
  })



Friends_Card.addEventListener('click', function onClick_Friends_Card(event) {
  const target = event.target
  const targetID = Number(target.dataset.id)
  if (target.matches('.card-img-top')  ) {
    popUpModle(targetID) 
  } else if (target.matches('.btn-addfavoriet')) {
    addInfavoriteList(targetID)
    changeButtonStyle(target)
  }
})
  
searchFrom.addEventListener('input', function searchFriend(event) {
  keyword = searchInput.value.trim().toLowerCase()

  filtedFriend = friendList.filter((friend) => 
    friend.name.toLowerCase().includes(keyword)
  )

  randerPagination(filtedFriend)
  showFriendsByPage(1)
  highLightCurrentPage('1')
})

pagination.addEventListener('click', function onClick_pagination(event) {
  const page = event.target.dataset.page
  if (!page) {//避免點到其他區塊
    return
  } 
  showFriendsByPage(page)
  highLightCurrentPage(page)
})
//functions
function randerFriendList(data) {
  const addedFriend = JSON.parse(localStorage.getItem('favoriteList')) || []
  let htmlcontent = ''
  if (!data.length) {
    htmlcontent = `<div><p class="fst-italic text-center text-white">找不到任何人.</p>`
  }
  data.forEach(data => {
    htmlcontent += `
      <div class="card m-3 p-0" style="width: 11rem; " >
      <a href="#"><img src="${data.avatar}" class="card-img-top border border-3 rounded-top" data-id="${data.id}" data-bs-toggle="modal" data-bs-target=#Information alt=""></a>
      <div class="card-body ">
        <p class="card-text text-center">${data.name}</p>
        <div class='d-grid gap-2'>
    `
    if (addedFriend.some(friends => friends.id === data.id)) {
      htmlcontent += `
        <button data-id='${data.id}' type="button" class="btn-addfavoriet btn btn-danger">♥</button>
      `
    } else {
      htmlcontent += `
       <button data-id='${data.id}' type="button" class="btn-addfavoriet btn btn-danger">+</button>
      `
    }
    htmlcontent += `     
          </div>
        </div>
      </div>
    ` 
  });
  Friends_Card.innerHTML = htmlcontent
} 

function popUpModle(id) {
  const modletitle = document.querySelector('#informationModalLabel')
  const modlebody = document.querySelector('.modal-body')

  axios.get(INDEX_URL + id)
  .then((Response) => {
    const data = Response.data
    modletitle.textContent = data.name
    modlebody.innerHTML = `
      <img src="${data.avatar}" class="mx-auto d-block rounded-circle" alt="">
          <div class="mt-5">
            <pre>
              name: ${data.name}
              surname: ${data.surname}
              email: ${data.email}
              gender: ${data.gender}
              age: ${data.age}
              region: ${data.region}
              birthday: ${data.birthday}
            </pre>
          </div>
    `
  })
}

function addInfavoriteList(id) {
  const favoriteList = JSON.parse(localStorage.getItem('favoriteList')) || []
  const targetFriend = friendList.find((friend) => friend.id === id)
  if (favoriteList.some((friend) => friend.id === id)) {
    return alert('此好友已經在你的最愛名單內了!')
  }
  favoriteList.push(targetFriend)
  localStorage.setItem('favoriteList', JSON.stringify(favoriteList))
}

function showFriendsByPage(page) {
  const statIndex = (page - 1) * FRIEND_PER_PAGE
  const endIndex = statIndex + FRIEND_PER_PAGE
  const data =  keyword.length ? filtedFriend : friendList
  randerFriendList(data.slice(statIndex, endIndex))
}

function randerPagination(data) {
  const total_PAGE = Math.ceil(data.length / FRIEND_PER_PAGE)
  let htmlcontent = ``
  for (let i = 1; i <= total_PAGE; i++) {
    htmlcontent += `
      <li class="page-item"><a class="page-link" href="#" data-page='${i}'>${i}</a></li>
    `
  }

  pagination.innerHTML = htmlcontent
  highLightCurrentPage('1')
}

function highLightCurrentPage(currentPage) {
  const totalPages = [...pagination.children]

  totalPages.forEach((pageElm) => {
    if (pageElm.firstElementChild.dataset.page === currentPage) {
      pageElm.classList.add('active')
    } 
    else {
      pageElm.classList.remove('active')
    }
  })
}

function changeButtonStyle(target) {
  if (target.matches('.btn-danger')) {
    target.textContent = '♥'
  }
}