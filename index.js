let currentData = []
let ratedBooks = JSON.parse(localStorage.getItem('ratedBooks'))

async function call () {
  let content = await fetch(
    'https://openlibrary.org/search.json?q=harry+potter'
  )
  let out = await content.json()
  saveData(out.docs)
}
call()
unratedBooks()
function saveData (data) {
  let books = data.map(book => ({
    title: book.title,
    author: book.author_name,
    reviews: Math.floor(Math.random() * 1000),
    publish: '',
    ratting: null
  }))
  localStorage.setItem('books', JSON.stringify(books))
}

function unratedBooks () {
  let books = JSON.parse(localStorage.getItem('books'))
  let unratedContainer = document.getElementById('unrated-container')
  currentData = books.filter(book => book.ratting === null)
  let cards = currentData
    .map(
      (book, index) => `
      <div class=" card flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 border border-gray-300 rounded-lg gap-4 sm:gap-0">
        <div class="w-full sm:w-auto">
          <h3 class="text-lg font-bold text-gray-800">${book.title}</h3>
          <p class="text-sm text-gray-600">by ${book.author}</p>
        </div>
        <div class="w-full sm:w-auto text-left sm:text-right">
          <label class="block sm:inline">Rate this book:</label>
          <select id="rating-${index}"class="ml-0 sm:ml-2 mt-2 sm:mt-0 border border-gray-300 rounded-lg w-full sm:w-auto">
            <option value="">Select</option>
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
          </select>
          <button onclick="rateBook(${index})" class="bg-gray-500 hover:bg-slate-400 text-white px-4 py-2 rounded-lg md:mt-2 mt-2 sm:mt- sm:ml-2 w-full sm:w-auto">
            Submit
          </button>
        </div>
      </div>
    `
    )
    .join('')
  unratedContainer.innerHTML = cards
}

function rateBook (index) {
  let ratingElement = document.getElementById(`rating-${index}`)
  let rating = ratingElement.value
  if(!rating){
    alert('please rate')
  }
  else{
  let books = JSON.parse(localStorage.getItem('books'))
  books[index].ratting = {date:new Date().toISOString().split('T')[0],ratting:`${rating} Stars`}
  console.log(books[index].ratting.date)
  ratedBooks.unshift(books[index])
  books.splice(index, 1)
  localStorage.setItem('books', JSON.stringify(books))
  localStorage.setItem('ratedBooks', JSON.stringify(ratedBooks));
  unratedBooks()
}
}
function displayRatedBooks (books = ratedBooks) {
  let ratedContainer = document.getElementById('rated-container')
  let cards = books
    .map(
      book => `
      <div class="card flex justify-between items-center  bg-white p-4 border border-gray-300 rounded-lg">
        <div>
          <h3 class="text-lg font-bold text-gray-800">${book.title}</h3>
          <p class="text-sm text-gray-600">by ${book.author}</p>
        </div>
        <div class="text-right">
          <p class="text-sm text-gray-700">Rating: ${book.ratting.ratting}</p>
          <p class="text-sm text-gray-700">Date: ${book.ratting.date}</p>
        </div>
      </div>
    `
    )
    .join('')
  ratedContainer.innerHTML = cards
}

let check = document.getElementById('check-ratings');

let isCheckingRatings = true;

check.addEventListener('click', () => {
  if (isCheckingRatings) {
    document.getElementById('unrated-section').classList.add('hidden')
    document.getElementById('rated-section').classList.remove('hidden')
    check.textContent = 'Give Rating'
    displayRatedBooks()
  } else {
    document.getElementById('unrated-section').classList.remove('hidden');
    document.getElementById('rated-section').classList.add('hidden')
    check.textContent = 'Check Rating'
    unratedBooks()
  }

  isCheckingRatings = !isCheckingRatings;
});

let data= JSON.parse(localStorage.getItem('ratedBooks'))

let searchValue = document.getElementById('search-input')

searchValue.addEventListener('keyup', () => {
  let searchValue = document.getElementById('search-input')
if(searchValue !==''){
  let searchValue = document.getElementById('search-input').value.toLowerCase()
  let filteredBooks = data.filter(book =>
    book.title.toLowerCase().includes(searchValue)
  )
  displayRatedBooks(filteredBooks) 

}
else{

  displayRatedBooks(data)
}
})

// let clear_button = document.getElementById('clear-button')
// clear_button.addEventListener('click', () => {
//   let searchValue = document.getElementById('search-input')
//   if(searchValue!==""){
//   let search = document.getElementById('search-input')
//   search.value = ''
 
// }})

let latest = document.getElementById('latest')
latest.addEventListener('click', () => {
  let todayDate= new Date().toISOString().split('T')[0]; 
  let lastest2 = ratedBooks.filter(book => (todayDate == book.ratting.date));
data = lastest2;

  displayRatedBooks(data)
  
})

let last_month = document.getElementById('last_month')
last_month.addEventListener('click', () => {
  let current=new Date()
  let last=new Date()
  last.setMonth(current.getMonth()-1)
  let formatted = current.toISOString().split('T')[0];
  let lastDate = last.toISOString().split('T')[0];
  console.log(lastDate)
  let month = ratedBooks
    .filter(book => {
      let bookDate = new Date(book.ratting.date).toISOString().split('T')[0];
      console.log(bookDate)
      return bookDate > lastDate  && bookDate<formatted
    })
    .sort((a, b) => b.reviews - a.reviews)
    data=month
  displayRatedBooks(data)
})

let six_month = document.getElementById('last_six')
six_month.addEventListener('click', () => {
  let current=new Date()
  let last_six=new Date()
  last_six.setMonth(current.getMonth()-6)
  let formatted = current.toISOString().split('T')[0]
  let lastDate = last_six.toISOString().split('T')[0]
  let sixMonthBooks = ratedBooks
    .filter(book => {
      let bookDate = new Date(book.ratting.date).toISOString().split('T')[0]
      return bookDate > lastDate  && bookDate<formatted
    })
    .sort((a, b) => b.reviews - a.reviews)
    data=sixMonthBooks
  displayRatedBooks(data)
})

let highest_rated = document.getElementById('highest_rated')
highest_rated.addEventListener('click', () => {
  let current=new Date()
  let last=new Date()
  last.setMonth(current.getMonth()-1)
  let formatted = current.toISOString().split('T')[0];
  let lastDate = last.toISOString().split('T')[0];
  console.log(lastDate)
  let month = ratedBooks
    .filter(book => {
      let bookDate = new Date(book.ratting.date).toISOString().split('T')[0];
      console.log(bookDate)
      return bookDate > lastDate  && bookDate<formatted
    })
    .sort((a, b) => parseInt(b.ratting.ratting) - parseInt(a.ratting.ratting))
    data=month
  displayRatedBooks(data)
})

let highest = document.getElementById('highest_six_month')
highest.addEventListener('click', () => {
  let current=new Date()
  let last_six=new Date()
  last_six.setMonth(current.getMonth()-6)
  let formatted = current.toISOString().split('T')[0]
  let lastDate = last_six.toISOString().split('T')[0]
  let sixMonthBooks = ratedBooks
    .filter(book => {
      let bookDate = new Date(book.ratting.date).toISOString().split('T')[0]
      return bookDate > lastDate  && bookDate<formatted
    })
    .sort((a, b) =>  parseInt(b.ratting.ratting) - parseInt(a.ratting.ratting))
    data=sixMonthBooks
  displayRatedBooks(data)
})


let hardcodedBooks = [
  {
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    reviews: 923,
    publish: "2024-07-26", // Random date in the last 6 months
    ratting: { date: "2024-07-26", ratting: "5 Stars" },
  },
  {
    title: "Harry Potter and the Chamber of Secrets",
    author: "J.K. Rowling",
    reviews: 821,
    publish: "2023-12-15", // A date last month
    ratting: { date: "2024-12-25", ratting: "4 Stars" },
  },
  {
    title: "Harry Potter and the Prisoner of Azkaban",
    author: "J.K. Rowling",
    reviews: 704,
    publish: "2024-01-10", // A date this month
    ratting: { date: "2024-12-28", ratting: "3 Stars" },
  },
  {
    title: "Harry Potter and the Goblet of Fire",
    author: "J.K. Rowling",
    reviews: 980,
    publish: "2024-06-01", // 7 months ago
    ratting: { date: "2024-06-01", ratting: "5 Stars" },
  },
  {
    title: "Harry Potter and the Order of the Phoenix",
    author: "J.K. Rowling",
    reviews: 600,
    publish: "2023-11-20", // 2 months ago
    ratting: { date: "2024-11-20", ratting: "4 Stars" },
  },
  {
    title: "Harry Potter and the Half-Blood Prince",
    author: "J.K. Rowling",
    reviews: 780,
    publish: "2023-07-01", // 6+ months ago
    ratting: { date: "2024-07-01", ratting: "5 Stars" },
  },
  {
    title: "Harry Potter and the Deathly Hallows",
    author: "J.K. Rowling",
    reviews: 500,
    publish: "2024-01-15", // A date very recent
    ratting: { date: "2024-01-15", ratting: "4 Stars" },
  },
];

// Save the data to localStorage for testing
localStorage.setItem('ratedBooks', JSON.stringify(hardcodedBooks));
