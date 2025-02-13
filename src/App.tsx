import './css/App.css'
import Favorites from './pages/Favorites'
import Home from './pages/Home'
import MovieDetails from './pages/MovieDetails'
import { Routes, Route } from 'react-router-dom'
import NavBar from './Components/NavBar'

const App: React.FC = () => {
    return (
        <div>
            <NavBar />
            <main className='main-content'>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/favorites' element={<Favorites />} />
                    <Route path='/movie/:id' element={<MovieDetails />} />
                </Routes>
            </main>
        </div>
    );
};

export default App;
