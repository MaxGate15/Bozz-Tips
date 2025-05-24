import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getUsername } from '../utils/auth';

const usePurchasedGames = () => {
    const [allPSlips, setAllSlips] = useState([]);
    const [loadP, setLoading] = useState(true);
    const [errorsP, setError] = useState(null);
    const username = getUsername();
    
    useEffect(() => {
        const fetchData = async () => {
        try {
            const res = await axios.get('https://bozz-tips-backend.onrender.com/purchased-games/', {
            headers: { 'X-Username': username },
            });
    
            const slips = res.data;
            setAllSlips(slips);
    
            // ✅ Separate based on category
            
    
        } catch (err) {
            console.error('Error fetching data:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
        };
    
        fetchData();
    }, []);
    
    return {
        loadP,
        errorsP,
        allPSlips,
        
    };
}
export default usePurchasedGames;