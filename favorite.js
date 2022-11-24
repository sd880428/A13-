const FRIEND_PER_PAGE = 16

const Friends_Card = document.querySelector('#friends-box')
const searchFrom = document.querySelector('#search-from')
const searchInput = document.querySelector('#search-input')
const pagination = document.querySelector('.pagination')

const friendList = JSON.parse(localStorage.getItem('favoriteList')) || []

let page = 1
randerPagination(friendList)
showFriendsByPage(1)

Friends_Card.addEventListener('click', function getTargetID(event) {
  const targetID = Number(event.target.dataset.id)
  if (event.target.matches('.card-img-top')) {
    popUpModle(targetID)
  } else if (event.target.matches('.btn-removefavoriet')) {
    removefriend(targetID)
  }
})

searchFrom.addEventListener('input', function searchFriend(event) {
  const keyword = searchInput.value.trim().toLowerCase()
  let filtedFriend = []

  if (!keyword.length) {
    randerFriendList(friendList)
  }

  filtedFriend = friendList.filter((friend) =>
    friend.name.toLowerCase().includes(keyword)
  )

  randerFriendList(filtedFriend)
  randerPagination(filtedFriend)
})

pagination.addEventListener('click', function onClick_pagination(event) {
  page = event.target.dataset.page
    showFriendsByPage(page)
   highLightCurrentPage(page)
})
//functions
function randerFriendList(data) {
  const Friends_Box = document.querySelector('#friends-box')
  let htmlcontent = ''
  if (!data || !data.length) {
    htmlcontent = `<div><p class="fst-italic text-center text-white">找不到任何人.</p>`
  } else {
    data.forEach(data => {
      htmlcontent += `
          <div class="card m-3 p-0" style="width: 11rem; " >
          <a href="#"><img src="${data.avatar}" class="card-img-top border border-3 rounded-top" data-id="${data.id}" data-bs-toggle="modal" data-bs-target=#Information alt=""></a>
          <div class="card-body">
            <p class="card-text text-center">${data.name}</p>
            <div class='d-grid gap-2'>
              <button data-id='${data.id}' type="button" class="btn-removefavoriet btn btn-danger">-</button>
            </div>
          </div>
        </div>
        `
    });
  }
  Friends_Box.innerHTML = htmlcontent
}

function popUpModle(id) {
  const modletitle = document.querySelector('#informationModalLabel')
  const modlebody = document.querySelector('.modal-body')

  const data = friendList.find((friend) => friend.id === id)
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
    
}

function removefriend(id) {
  friendID = friendList.findIndex((friend) => friend.id === id)
  friendList.splice(friendID, 1)
  localStorage.setItem('favoriteList', JSON.stringify(friendList))
  randerPagination(friendList)
  showFriendsByPage(page) 
}

function showFriendsByPage(page) {
  const statIndex = (page - 1) * FRIEND_PER_PAGE
  const endIndex = statIndex + FRIEND_PER_PAGE
  const sliceFriendList = friendList.slice(statIndex, endIndex)
  if (!sliceFriendList.length && page !== 1) {
    page -= 1
    console.log(page)
    showFriendsByPage(page)
  } else {
    randerFriendList(sliceFriendList)
}
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