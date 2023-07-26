import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react'
import axios from 'axios';

import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

const App = () => {
  //configuration
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = 'http://localhost:5000';

  const [session, setSession] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkSession = async () => {
    try {
      const response = await axios.get('/auth/session');
      setSession(response.data);
      setLoading(false)

    } catch (error) {
      setSession(error.response.data);
      setLoading(false)
    }
  }

  useEffect(() => {
    checkSession();
  }, [])

  if (loading) return (<div></div>)

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/auth' element={session ? <Navigate to='/dashboard' /> : <Auth />} />
        <Route path='/dashboard' element={session ? <Dashboard /> : <Navigate to='/auth' />} />
        <Route path='*' element={session ? <Navigate to='/dashboard' /> : <Navigate to='/auth' />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App