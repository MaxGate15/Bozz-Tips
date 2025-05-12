import { useEffect, useState } from 'react';
import axios from 'axios';

const useGames = () => {
    const [today, setToday] = useState([]);
    const [tomorrow, setTomorrow] = useState([]);
    const [yesterday, setYesterday] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [todayRes, tomorrowRes, yesterdayRes] = await Promise.all([
                    axios.get("https://wonit-backend.onrender.com/today-games"),
                    axios.get("https://wonit-backend.onrender.com/tomorrow-games"),
                    axios.get("https://wonit-backend.onrender.com/yesterday-games"),
                ]);

                setToday(todayRes.data);
                setTomorrow(tomorrowRes.data);
                setYesterday(yesterdayRes.data);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { today, tomorrow, yesterday, loading, error };
};

export default useGames;
