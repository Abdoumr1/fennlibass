import { useState } from "react";
import { ShoppingBag, Search, Menu, X, UserRound } from "lucide-react";

function Ex() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <header className="navbar">
            <div className="nav-container">
                {/* Logo */}
                <a href="/" className="logo">
                    MODA<span>.</span>
                </a>

                {/* Desktop Navigation */}
                <nav className={`nav-links ${menuOpen ? "active" : ""}`}>
                    <a href="/">Home</a>
                    <a href="#offers">Offers</a>
                    <a href="#products">Products</a>
                    <a href="#about">About us</a>
                </nav>

                {/* Navigation Actions */}
                <div className="nav-actions">
                    <button className="icon-btn" onClick={() => setSearchOpen(!searchOpen)} aria-label="Search">
                        <Search size={21} />
                    </button>

                    <button className="icon-btn" aria-label="Account">
                        <UserRound size={21} />
                    </button>

                    <button className="icon-btn cart-btn" aria-label="Shopping cart">
                        <ShoppingBag size={21} />
                        <span className="cart-count">0</span>
                    </button>

                    <button className="icon-btn menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {searchOpen && (
                <div className="search-panel">
                    <input type="search" placeholder="Search for products..." />
                </div>
            )}
        </header>
    );
}

export default Ex;