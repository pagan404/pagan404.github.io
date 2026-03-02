import Navigation from './Navigation';

function Header() {
  return (
    <header>
      <nav className="topnav">
        <h1 className="branding">Pagan's Blog</h1>
        <Navigation />
      </nav>
    </header>
  );
}

export default Header;