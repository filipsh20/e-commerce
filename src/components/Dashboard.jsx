import React from "react";
import axios from 'axios';

const Dashboard = () => {

    const signout = async () => {
        try {
            await axios.get('/auth/signout');
            window.location.href = '/auth'
        } catch (error) {
            console.log("You can't signout")
        }
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={signout}>Sign out</button>
        </div>
    )
}

export default Dashboard;