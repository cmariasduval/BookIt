import React from "react";
import "./Home.css";
import AddBook from "./AddBook"

const Home = () => {
    return (
        <div className="home-container">
            <div className="top-section">
                <div className="goal">
                    <h2>Monthly Goal</h2>
                    <p>5</p> 
                </div>
                <div className="whats-new">
                    <div className="whats-new-text">
                        <h2>The Midnight Library</h2>
                        <p>Discover a world between life and death. Buy now!</p>
                    </div>
                    <div className="whats-new-image">
                        <img src="https://images-na.ssl-images-amazon.com/images/I/81FryD8NwJL.jpg" alt="The Midnight Library" />
                    </div>
                </div>
                <div className="infractions">
                    <div className="debt-box">
                        <span>Debt: $100</span> {/* Aquí pondrás el valor dinámico más adelante */}
                    </div>
                    <div className="infractions-box">
                        <span>Infractions: 3</span> {/* Aquí pondrás el valor dinámico más adelante */}
                    </div>
                </div>
            </div>
            <div className="lower-section">
                <div className="folders">
                    <ul className="folders-list">
                        <a href="your-books">Your Books</a>
                        <li>Read</li>
                        <li>Borrowed</li>
                        <li>Wishlist</li>
                    </ul>
                </div>
                <div className="reserved">
                    my reserved books
                </div>
            </div>
        </div>
    );
};

export default Home;
