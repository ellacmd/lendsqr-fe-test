import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import UserDetails from '@/pages/UserDetails';
import MainLayout from '@/layouts/MainLayout';

function App() {
    return (

            <Router>
                <Routes>
                    <Route path='/' element={<Login />} />

                    <Route element={<MainLayout />}>
                        <Route path='/dashboard' element={<Dashboard />} />
                        <Route
                            path='/users'
                            element={<Navigate to='/dashboard' replace />}
                        />
                        <Route path='/users/:id' element={<UserDetails />} />
                    </Route>

                    <Route path='*' element={<Navigate to='/' replace />} />
                </Routes>
            </Router>
        
    );
}

export default App;
