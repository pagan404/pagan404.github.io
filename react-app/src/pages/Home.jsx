import { Link } from "react-router-dom";
import articles from "../data/articles";
import ArticleCard from "../components/ArticleCard";

function Home() {
  return (
    <div>
      <h1 className="read-my-blog">
        I've written some blogs, feel free to check them out!
      </h1>

      {articles.map((article) => (
        <ArticleCard key={article.url} {...article} />
      ))}
    </div>
  );
}

export default Home;
