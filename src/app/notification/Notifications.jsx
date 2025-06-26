import React, { useEffect, useState } from 'react';
import axios from 'axios';


const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loadN, setLoading] = useState(true);
    const [errorsN, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('https://bozztips-app-57hce.ondigitalocean.app/notifications/');
                // Only set notifications where seen is false
                setNotifications(res.data.filter(n => n.seen === false));
            } catch (err) {
                console.error('Error fetching notifications:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return {
        loadN,
        errorsN,
        notifications,
    };
}

export default useNotifications;