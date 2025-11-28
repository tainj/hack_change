import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';  
import Courses from './pages/Courses';
import CourseCreate from './pages/CourseCreate';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/create" element={<CourseCreate />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;