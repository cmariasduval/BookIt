import React from "react";
import "./Home.css";
import AddBook from "./AddBook"

const Home = () => {
    return (
        <div className="home-container">
            <div className="folders-container">
                <a href="your">Your books</a>
                <ul>
                    <li>Read</li>
                    <li>Wishlist</li>
                </ul>
            </div>

            <div className="right-section">
                {/* Top Section */}
                <div className="top-section">
                    {/* Goal */}
                    <div className="goal-card">
                        <div>Monthly Goal</div>
                        <div className="goal-number">5</div>
                    </div>

                    {/* What's New */}
                    <div className="whats-new">
                        <div className="whats-text">
                            <div className="label">What’s New?</div>
                            <div className="book-title">New General College "Chemistry" book edition</div>
                        </div>
                        <img className="whats-image" src="/chemistry-book.jpg" alt="New book" />
                    </div>

                    {/* Stats */}
                    <div className="stats">
                        <div className="stat-box">
                            <div>Debt</div>
                            <div className="stat-number">$10.00</div>
                        </div>
                        <div className="stat-box">
                            <div>Violations</div>
                            <div className="stat-number">1</div>
                        </div>
                    </div>
                </div>

                {/* Reserved Books */}
                <div className="reserved-books">
                    <h2>My Reserved Books</h2>
                    <div className="books-grid">
                        {[
                            { title: "The Lady in Gold", img: "/book1.jpg" },
                            { title: "Steve Jobs", img: "/book2.jpg" },
                            { title: "The Hunger Games", img: "/book3.jpg" },
                            { title: "LOTR", img: "/book4.jpg" },
                            { title: "Green Book", img: "/book5.jpg" },
                        ].map((book, i) => (
                            <div className="book-card" key={i}>
                                <img className="book-img" src={book.img} alt={book.title} />
                                <div className="reserved-badge">Reserved</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Admin Section: Add Book */}
                <div className="admin-section">
                    <h2>Add a Book</h2>
                    <AddBook />
                </div>
            </div>
        </div>
    );
};

export default Home;
