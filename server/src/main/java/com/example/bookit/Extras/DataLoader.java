package com.example.bookit.Extras;

import com.example.bookit.Entities.Book;
import com.example.bookit.Entities.BookCopy;
import com.example.bookit.Entities.Genre;
import com.example.bookit.Repository.BookCopyRepository;
import com.example.bookit.Repository.BookRepository;
import com.example.bookit.Repository.GenreRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
public class DataLoader {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private GenreRepository genreRepository;

    @Autowired
    private BookCopyRepository bookCopyRepository;

    @PostConstruct
    public void init() {

        List<String> genres = List.of(
                "Psychology", "Historical", "Romance",
                "Sci-Fi", "Non-Fiction", "Horror",
                "Thriller", "Fantasy", "Mystery", "Fiction"
        );

        for (String name : genres) {
            if (genreRepository.findByGenreType(name).isEmpty()) {
                Genre genre = new Genre();
                genre.setGenreType(name);
                genreRepository.save(genre);
            }
        }


        Book anneFrank = addBook("Anne Frank, The Diary of a young girl", "Anne Frank", "Mass Market Paperback",
                "5620582213794", getGenres("Non-Fiction"),
                "https://m.media-amazon.com/images/I/51Eyjz65gyL._AC_UF1000,1000_QL80_.jpg", 5);
        addCopies(anneFrank, 5);

        Book theBellJar = addBook("The Bell Jar", "Sylvia Plath", "Faber & Faber",
                "5820192437850", getGenres("Psychology", "Fiction"),
                "https://keledicionesb2c.vtexassets.com/arquivos/ids/253286/9780571081783.jpg?v=638035126535270000", 7);
        addCopies(theBellJar, 7);

        Book theBookThief = addBook("The Book Thief", "Markus Zusak", "Picador",
                "0375831002", getGenres("Historical", "Fiction"),
                "https://upload.wikimedia.org/wikipedia/en/thumb/8/8f/The_Book_Thief_by_Markus_Zusak_book_cover.jpg/250px-The_Book_Thief_by_Markus_Zusak_book_cover.jpg", 8);
        addCopies(theBookThief, 8);

        Book janeAusten = addBook("Emma", "Jane Austen", "Collectable Classics, Complete & Unabridged",
                "3876492189461", getGenres("Fiction", "Historical"),
                "https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781787556997/emma-9781787556997_hr.jpg", 2);
        addCopies(janeAusten, 2);

        Book theHungerGames = addBook("The Hunger Games", "Suzanne Collins", "Scholastic",
                "34987510873", getGenres("Science Fiction", "Fiction", "Fantasy", "Romance"),
                "https://http2.mlstatic.com/D_947084-MLA78813080597_082024-C.jpg", 3);
        addCopies(theHungerGames, 3);

        Book theMazeRunner = addBook("The Maze Runner", "James Dashner", "Delacorte Press",
                "6782303198540", getGenres("Science Fiction", "Fantasy", "Fiction"),
                "https://m.media-amazon.com/images/I/71wOTfg+U+L._AC_UF894,1000_QL80_.jpg", 4);
        addCopies(theMazeRunner, 4);

        Book rebecca = addBook("Rebecca", "Daphne Du Maurier", "Back Bay Books",
                "1874620016745", getGenres("Fiction", "Mystery", "Romance", "Historical", "Thriller", "Horror"),
                "https://http2.mlstatic.com/D_943522-MLA83275168376_042025-C.jpg", 2);
        addCopies(rebecca, 2);
    }

    private List<Genre> getGenres(String... names) {
        List<Genre> genreList = new ArrayList<>();
        for (String name : names) {
            Optional<Genre> genre = genreRepository.findByGenreType(name.trim());
            genre.ifPresent(genreList::add);
        }
        return genreList;
    }

    private Book addBook(String title, String author, String publisher, String isbn, List<Genre> genres, String imageUrl, int copiesCount) {
        Optional<Book> existingBook = bookRepository.findByIsbn(isbn);
        if (existingBook.isEmpty()) {
            Book book = new Book(title, author, publisher, isbn, genres, imageUrl);
            bookRepository.save(book);
            return book;
        }
        return existingBook.get();
    }

    private void addCopies(Book book, int copiesCount) {
        for (int i = 0; i < copiesCount; i++) {
            String copyCode = book.getISBN() + "-" + (i + 1);
            BookCopy bookCopy = new BookCopy(book, copyCode, true);
            bookCopyRepository.save(bookCopy);
        }

    }
}
