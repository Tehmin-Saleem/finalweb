there are three routes
books, authors, borrowers
book can be delted, updated, and added
authors can be created, updated,delted and the outher path of exceeding-limit is also present displaying the athors with books more than 5 if any
Borrowers can be added, updated
the /borrow endpoint and /return endpoint are implemented that deceases the availableCopies when the book is borrowed and increases avaliableCopies when a book is returned 
error handling of email, phonenumber and unique isbn number is implemented
A book can not be borrowed when no avilabale copies presnet and a memeber with standard membership can not borrow more than five books
Borrowedbooks array is updated when a new book is borrowed, a book is removed when a book is retured
a borrower can not borrow book if they have borrowed 5 books(standard) and more than 5 in (premium) member ship 