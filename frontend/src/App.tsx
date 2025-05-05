import './css/App.css'
import Favorites from './pages/Favorites'
import Home from './pages/Home'
import MovieDetails from './pages/MovieDetails'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
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
                    <Route path='/login' element={<Login />} />
                    <Route path='/signup' element={<Signup />} />
                    <Route path='/profile' element={<Profile />} />
                </Routes>
            </main>
        </div>
    );
};

export default App;
