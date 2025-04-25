package com.example.bookit.Extras;

import com.example.bookit.Entities.Book;
import com.example.bookit.Entities.Genre;
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


        addBook("Anne Frank, The Diary of a young girl", "Anne Frank", "Mass Market Paperback",
                "5620582213794", getGenres("Non-Fiction"),
                "https://m.media-amazon.com/images/I/51Eyjz65gyL._AC_UF1000,1000_QL80_.jpg");

        addBook("The Bell Jar", "Sylvia Plath", "Faber & Faber",
                "5820192437850", getGenres("Psychology", "Fiction"),
                "https://keledicionesb2c.vtexassets.com/arquivos/ids/253286/9780571081783.jpg?v=638035126535270000");

        addBook("The Book Thief", "Markus Zusak", "Picador",
                "0375831002", getGenres("Historical", "Fiction"),
                "https://upload.wikimedia.org/wikipedia/en/thumb/8/8f/The_Book_Thief_by_Markus_Zusak_book_cover.jpg/250px-The_Book_Thief_by_Markus_Zusak_book_cover.jpg");

        addBook("Emma", "Jane Austen", "Collectable Classics, Complete & Unabridged",
                "3876492189461", getGenres("Fiction", "Historical"),
                "https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781787556997/emma-9781787556997_hr.jpg");

        addBook("The Hunger Games", "Suzanne Collins", "Scholastic",
                "34987510873", getGenres("Science Fiction", "Fiction", "Fantasy", "Romance"),
                "https://http2.mlstatic.com/D_947084-MLA78813080597_082024-C.jpg");

        addBook("The Maze Runner", "James Dashner", "Delacorte Press",
                "6782303198540", getGenres("Science Fiction", "Fantasy", "Fiction"),
                "https://m.media-amazon.com/images/I/71wOTfg+U+L._AC_UF894,1000_QL80_.jpg");

        addBook("Rebecca", "Daphne Du Maurier", "Back Bay Books",
                "1874620016745", getGenres("Fiction", "Mystery", "Romance", "Historical", "Thriller", "Horror"),
                "https://http2.mlstatic.com/D_943522-MLA83275168376_042025-C.jpg");
    }

    private List<Genre> getGenres(String... names) {
        List<Genre> genreList = new ArrayList<>();
        for (String name : names) {
            Optional<Genre> genre = genreRepository.findByGenreType(name.trim());
            genre.ifPresent(genreList::add);
        }
        return genreList;
    }

    private void addBook(String title, String author, String publisher, String isbn, List<Genre> genres, String imageUrl) {
        if (bookRepository.findAll().stream().noneMatch(book -> book.getISBN().equals(isbn))) {
            Book book = new Book(title, author, publisher, isbn, genres, imageUrl);
            bookRepository.save(book);
        }
    }
}
