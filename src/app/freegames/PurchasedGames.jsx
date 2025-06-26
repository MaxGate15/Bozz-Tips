import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getUsername } from '../utils/auth';

const usePurchasedGames = () => {
    const [allPSlips, setAllSlips] = useState([]);
    const [recentGames, setRecentGames] = useState([]);
    const [loadP, setLoading] = useState(true);
    const [errorsP, setError] = useState(null);
    const username = getUsername();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('https://bozztips-app-57hce.ondigitalocean.app/purchased-games/', {
                    headers: { 'X-Username': username },
                });

                const slips = res.data;
                setAllSlips(slips);

                // ✅ Get the 3 most recent slips by match_day
                const sorted = [...slips].sort((a, b) => new Date(b.match_day) - new Date(a.match_day));
                setRecentGames(sorted.slice(0, 3));
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
        recentGames, // <-- add this to your return
    };
}
export default usePurchasedGames;