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
            try {
                if (genreRepository.findByGenreType(name).isEmpty()) {
                    Genre genre = new Genre();
                    genre.setGenreType(name);
                    genreRepository.save(genre);
                }
            } catch (Exception e) {
                // Manejo de error y logs
                System.out.println("Error al crear género: " + name);
                e.printStackTrace();
            }
        }


        Book theBellJar = addBook("The Bell Jar", "Sylvia Plath", "Faber & Faber",
                "5820192437850", getGenres("Psychology", "Fiction"), "https://keledicionesb2c.vtexassets.com/arquivos/ids/253286/9780571081783.jpg?v=638035126535270000",
                7, "Mental Health, Depression", "A novel about mental illness and the societal expectations placed on women.");
        addCopies(theBellJar, 2);

        Book theBookThief = addBook("The Book Thief", "Markus Zusak", "Picador",
                "0375831002", getGenres("Historical", "Fiction"), "https://upload.wikimedia.org/wikipedia/en/thumb/8/8f/The_Book_Thief_by_Markus_Zusak_book_cover.jpg/250px-The_Book_Thief_by_Markus_Zusak_book_cover.jpg",
                8, "World War II, Death, Books", "The story of a young girl in Nazi Germany and her relationship with books.");
        addCopies(theBookThief, 3);

        Book janeAusten = addBook("Emma", "Jane Austen", "Collectable Classics, Complete & Unabridged",
                "3876492189461", getGenres("Fiction", "Historical"), "https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781787556997/emma-9781787556997_hr.jpg",
                2, "Love, Social Class", "A story about the adventures of Emma Woodhouse and her matchmaking efforts.");
        addCopies(janeAusten, 2);

        Book theHungerGames = addBook("The Hunger Games", "Suzanne Collins", "Scholastic",
                "34987510873", getGenres("Science Fiction", "Fiction", "Fantasy", "Romance"), "https://http2.mlstatic.com/D_947084-MLA78813080597_082024-C.jpghttps://keledicionesb2c.vtexassets.com/arquivos/ids/260164-1200-auto?v=638870787908400000&width=1200&height=auto&aspect=true",
                3, "Survival, War, Revolution", "A dystopian novel about children forced to fight to the death in a televised competition.");
        addCopies(theHungerGames, 3);

        Book theMazeRunner = addBook("The Maze Runner", "James Dashner", "Delacorte Press",
                "6782303198540", getGenres("Science Fiction", "Fantasy", "Fiction"), "https://m.media-amazon.com/images/I/71wOTfg+U+L._AC_UF894,1000_QL80_.jpg",
                4, "Escape, Survival, Mystery", "A group of teenagers must navigate a deadly maze to escape a terrifying world.");
        addCopies(theMazeRunner, 4);

        Book rebecca = addBook("Rebecca", "Daphne Du Maurier", "Back Bay Books",
                "1874620016745", getGenres("Fiction", "Mystery", "Romance", "Historical", "Thriller", "Horror"), "https://keledicionesb2c.vtexassets.com/arquivos/ids/257825-1200-auto?v=638466818582530000&width=1200&height=auto&aspect=true",
                2, "Mystery, Romance, Guilt", "A psychological thriller about a woman haunted by the memory of her husband's first wife.");
        addCopies(rebecca, 2);

        Book LittleWoman = addBook("Little Woman", "Louisa May Alcott", "Bantam", "9780553212754", getGenres("Fiction", "Romance"), "https://keledicionesb2c.vtexassets.com/arquivos/ids/253968-800-auto?v=638077496123600000&width=800&height=auto&aspect=true", 2, "Sisters, Little, Woman", "A Story of 5 sisters who lost their father. Sisterhood, friendship and love");
        addCopies(LittleWoman, 2);


        Book HappyPlace = addBook("Happy Place", "Emily Henry", "Penguin", "9780241995365", getGenres("Fiction", "Romance"), "https://keledicionesb2c.vtexassets.com/arquivos/ids/258590-1200-auto?v=638826568421400000&width=1200&height=auto&aspect=true", 4,
                "Exes","Two exes. One pact. Could this holiday change everything?");
        addCopies(HappyPlace, 4);

        Book FunnyStory = addBook("Funny Story", "Emily Henry", "Penguin", "9780241624142", getGenres("Fiction", "Romance"), "https://keledicionesb2c.vtexassets.com/arquivos/ids/259175-1200-auto?v=638826567739930000&width=1200&height=auto&aspect=true", 4, "Love", "Two heartbroken exes become unlikely roommates and fake a summer romance" );
        addCopies(FunnyStory, 4);

        Book TheCousins = addBook("The Cousins", "Karen M. MacManus", "Penguin UK", "9780241376942", getGenres("Fiction", "Mystery"),"https://keledicionesb2c.vtexassets.com/arquivos/ids/258288-1200-auto?v=638597269615200000&width=1200&height=auto&aspect=true", 5, "Secrets, Family, Thriller", "Three cousins spend a summer uncovering deadly family secrets on a mysterious island." );
        addCopies(TheCousins, 5);

        Book CaribbeanMystery = addBook("Caribbean Mystery", "Agatha Christie", "Harper", "9780008196608", getGenres("Fiction", "Mystery", "Classics"), "https://keledicionesb2c.vtexassets.com/arquivos/ids/253016-1200-auto?v=638035124921930000&width=1200&height=auto&aspect=true", 6, "Mystery, Murder, Caribbean", "Miss Marple’s Caribbean holiday turns deadly when a retired major is mysteriously killed.");
        addCopies(CaribbeanMystery, 6);

        Book AnneOfGreenGables = addBook("Anne of Green Gables", "Lucy Maud Montogomery", "Puffin Classics", "9780241734186", getGenres("Fiction", "Classics"), "https://keledicionesb2c.vtexassets.com/arquivos/ids/260151-1200-auto?v=638864739862270000&width=1200&height=auto&aspect=true", 5, "Imagination, Friendship, Coming-of-age", "A spirited red-haired girl turns life upside down at Green Gables with her imagination and charm." );
        addCopies(AnneOfGreenGables, 5);

        Book AnneOfAvonlea = addBook("Anne of Avonlea", "Lucy Maud Montogomery", "Puffin Classics", "9780241736425", getGenres("Fiction", "Classics"), "https://keledicionesb2c.vtexassets.com/arquivos/ids/259255-1200-auto?v=638703550452070000&width=1200&height=auto&aspect=true", 5, "Imagination, Friendship, Coming-of-age", "Anne returns to Avonlea as a teacher, facing spirited students and new adventures." );
        addCopies(AnneOfAvonlea, 5);

        Book AnneOfTheIsland = addBook("Anne Of The Island", "Lucy Maud Montogomery", "Puffin Classics", "9780241736630", getGenres("Fiction", "Classics", "Romance"), "https://keledicionesb2c.vtexassets.com/arquivos/ids/259679-1200-auto?v=638745891646300000&width=1200&height=auto&aspect=true", 5, "Teaching, Avonlea, Adventure", "At college, Anne finds new friendships, romance, and a jealous Gilbert as she grows into adulthood." );
        addCopies(AnneOfTheIsland, 5);

        Book AnnesHouseOfDreams = addBook("Anne's House Of Dreams", "Lucy Maud Montogomery", "Puffin Classics", "9780241736722", getGenres("Fiction", "Classics"), "https://keledicionesb2c.vtexassets.com/arquivos/ids/259680-1200-auto?v=638745891655330000&width=1200&height=auto&aspect=true", 5, "Marriage, Heartache, Hope", "Anne begins married life in her seaside dream home, facing joy, sorrow, and new beginnings." );
        addCopies(AnnesHouseOfDreams, 5);

        Book AnneOfIngleside = addBook("Anne of Ingleside", "Lucy Maud Montogomery", "Puffin Classics", "9780241736715", getGenres("Fiction", "Classics"), "https://keledicionesb2c.vtexassets.com/arquivos/ids/259256-1200-auto?v=638703550481530000&width=1200&height=auto&aspect=true", 5, "Family, Motherhood, Marriage", "Now a mother of six, Anne juggles family chaos, village life, and her ever-spirited heart." );
        addCopies(AnneOfIngleside, 5);

        Book FourthWing = addBook("Fourth Wing", "Rebecca Yarros", "Piatkus", "9780349436999", getGenres("Fiction", "Fantasy"), "https://keledicionesb2c.vtexassets.com/arquivos/ids/256891-1200-auto?v=638272411853300000&width=1200&height=auto&aspect=true", 2, "Dragons, Survival, War college", "Forced into a deadly war college for dragon riders, fragile Violet must fight to survive where graduation means life—or death");
        addCopies(FourthWing, 2);

        Book IronFlame = addBook("Iron Flame", "Rebecca Yarros", "Piatkus", "9780349437026", getGenres("Fiction", "Fantasy"), "https://keledicionesb2c.vtexassets.com/arquivos/ids/257375-1200-auto?v=638345028130170000&width=1200&height=auto&aspect=true", 2, "Dragons, Survival, War college", "Violet faces brutal new trials, deadly secrets, and impossible choices in her second year at Basgiath War College.");
        addCopies(IronFlame, 2);

        Book OnyxStorm = addBook("Onyx Storm", "Rebecca Yarros", "Piatkus", "9780349437064", getGenres("Fiction", "Fantasy"), "https://keledicionesb2c.vtexassets.com/arquivos/ids/258641-1200-auto?v=638639623773500000&width=1200&height=auto&aspect=true", 2, "Dragons, Survival, War college", "As war looms, Violet must seek allies and uncover the truth to save her world—no matter the cost.");
        addCopies(OnyxStorm, 2);



    }

    private List<Genre> getGenres(String... names) {
        List<Genre> genreList = new ArrayList<>();
        for (String name : names) {
            Optional<Genre> genre = genreRepository.findByGenreType(name.trim());
            genre.ifPresent(genreList::add);
        }
        return genreList;
    }

    private Book addBook(String title, String author, String publisher, String isbn, List<Genre> genres, String imageUrl,
                         int copiesCount, String keywords, String description) {
        Optional<Book> existingBook = bookRepository.findByIsbn(isbn);
        if (existingBook.isEmpty()) {
            Book book = new Book(title, author, publisher, isbn, genres, imageUrl, keywords, description);
            bookRepository.save(book);
            return book;
        }
        return existingBook.get();
    }

    private void addCopies(Book book, int copiesCount) {
        for (int i = 0; i < copiesCount; i++) {
            String copyCode = book.getIsbn() + "-" + (i + 1);
            BookCopy bookCopy = new BookCopy(book, copyCode, true);
            bookCopyRepository.save(bookCopy);
        }
    }
}
