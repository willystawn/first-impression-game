
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import DisplayPage from './components/DisplayPage';
import SubmitPage from './components/SubmitPage';

function App(): React.ReactNode {
  return (
    <HashRouter>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black antialiased">
        <Routes>
          <Route path="/" element={<DisplayPage />} />
          <Route path="/submit" element={<SubmitPage />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
