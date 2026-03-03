import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header, Footer } from "./components/layout";
import { Home, Workshop } from "./pages";

// Placeholder pages - we'll build these in later phases
function Articles() {
  return (
    <div className="read-my-blog">
      <h1>Articles Page</h1>
      <p>Coming soon...</p>
    </div>
  );
}

function Encodings() {
  return (
    <div className="read-my-blog">
      <h1>Encodings Page</h1>
      <p>Coming soon...</p>
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
