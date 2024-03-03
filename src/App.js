import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import TuneFeed from './components/TuneFeed/TuneFeed';
import TuneProfile from './components/TuneProfile/TuneProfile';
import TuneStudio from './components/TuneStudio/TuneStudio';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TuneFeed />} />
        <Route path="/profile" element={<TuneProfile />} />
        <Route path="/studio" element={<TuneStudio />} />
        {/* Você pode adicionar mais rotas conforme necessário */}
      </Routes>
    </Router>
  );
}

export default App;
