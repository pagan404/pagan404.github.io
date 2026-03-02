import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header, Footer } from "./components/layout";

// Placeholder pages - we'll build these next
function Home() {
  return (
    <div className="read-my-blog">
      <h1>Home Page</h1>
    </div>
  );
}

function Articles() {
  return (
    <div className="read-my-blog">
      <h1>Articles Page</h1>
    </div>
  );
}

function Encodings() {
  return (
    <div className="read-my-blog">
      <h1>Encodings Page</h1>
    </div>
  );
}

function Workshop() {
  return (
    <div className="read-my-blog">
      <h1>Workshop Page</h1>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/encodings" element={<Encodings />} />
          <Route path="/workshop" element={<Workshop />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
