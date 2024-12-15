import json
import os

FILE_PATH = 'books_data.json'

# Load books from the JSON file or return an empty list if the file doesn't exist.
def loadBook():
    if os.path.exists(FILE_PATH):
        with open(FILE_PATH,"r")as file:
            return json.load(file)
    return []

# Save the list of books back to the JSON file.
def saveBook(books):
    with open(FILE_PATH,"w")as file:
        json.dump(books,file,indent=4)

# Display books in a nicely formatted table.
def displayBook(books):
    if not books:
        print("No books available.")
    else:
        print(f"{'Title':<31}{'Author':<19}{'Year':<7}{'Genre':<14}")
        print("-" * 75)
        for book in books:
            print(f"{book['title']:<31}{book['author']:<19}{book['year']:<7}{book['genre']:<14}")

# Add a new book to the collection.   
def addBook(books):
    title=input("Enter Title:").strip()
    author=input("Entre Author:").strip()
    year=input("Entre Year:").strip()
    genre=input("Entre Genre:").strip()
    
    if not year.isdigit():
        print("year must be number")
        return
    
    books.append({
        "title":title,
        "author":author,
        "year":year,
        "genre":genre
    })
    
    print("Book added successfully")

# View The Result
def main():
    books=loadBook()
    while True:
        print("\n1. View books")
        print("2. Add book")
        print("3. Exit")
        choice = input("Choose an option: ")
        if choice =="1":
            displayBook(books)
        elif choice == "2":
            addBook(books)
            saveBook(books)
        elif choice =="3":
            break
        else:
            print("Invalid choice.")

if __name__ == "__main__":
    main()

            






        