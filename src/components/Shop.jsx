import React from "react";
import axios from 'axios';

import styles from '../styles/Shop.module.css';

const Dashboard = () => {

    const handleSignout = async () => {
        try {
            await axios.get('/auth/signout');
            window.location.href = '/auth'
        } catch (error) {
            console.log("You can't signout")
        }
    }

    return (
        <div className={styles.containerShop}>
            <h1>Shop</h1>
            <button onClick={handleSignout}>Sign out</button>
        </div>
    )
}

export default Dashboard;