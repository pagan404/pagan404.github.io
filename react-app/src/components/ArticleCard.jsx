function ArticleCard({ title, date, image, alt, url, summary }) {
  return (
    <article className="article-intro">
      <a className="article-links" href={url}>
        <section className="article-content">
          <div className="article-image-container">
            <img className="article-image" src={image} alt={alt} />
          </div>
          <div className="article-text-content">
            <h1 className="article-title">{title}</h1>
            <h3 className="article-date">{date}</h3>
            <p className="article-intro-paragraph">{summary}</p>
          </div>
        </section>
      </a>
    </article>
  );
}

export default ArticleCard;
