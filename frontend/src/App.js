import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QuestionIndex } from './components/QuestionIndex';

import Home from './pages/Home';
import Demographics from './pages/Demographics';
import QuestionsPage from './pages/QuestionsPage';
import Thanks from './pages/Thanks';
// import Links from './components/Links'

function App() {
  return (
    <QuestionIndex>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/demographics" element={<Demographics />}/>
          <Route path="/study" element={<QuestionsPage />} />
          <Route path="/thank-you" element={<Thanks />} />
        </Routes>
      </BrowserRouter>
    </QuestionIndex>

  );
}

export default App;

