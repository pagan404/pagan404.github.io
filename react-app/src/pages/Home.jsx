import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="read-my-blog">
      <h1>Welcome to Pagan's Blog</h1>
      <p>A place for articles, encoding tools, and experiments.</p>

      <div className="home-links">
        <Link to="/articles" className="home-card">
          <h2>📝 Articles</h2>
          <p>Read my latest thoughts and tutorials</p>
        </Link>

        <Link to="/encodings" className="home-card">
          <h2>🔐 Encodings</h2>
          <p>Convert text between different encoding formats</p>
        </Link>

        <Link to="/workshop" className="home-card">
          <h2>🧪 Workshop</h2>
          <p>Try the AI-powered Braille translator</p>
        </Link>
      </div>
    </div>
  );
}

export default Home;
