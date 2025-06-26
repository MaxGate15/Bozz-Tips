import React, { useEffect, useState } from "react";
import axios from "axios";
import { u } from "framer-motion/client";

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
                    axios.get("https://bozztips-app-57hce.ondigitalocean.app/today-games"),
                    axios.get("https://bozztips-app-57hce.ondigitalocean.app/tomorrow-games"),
                    axios.get("https://bozztips-app-57hce.ondigitalocean.app/yesterday-games"),
                ]);

                // Flatten games from slips
                const extractGames = (slips) => {
                    return slips.flatMap((slip) =>
                        slip.games.map((game) => ({
                            ...game,
                            slip_id: slip.slip_id, // optional, if needed for context
                            date_created: slip.date_created, // reuse slip info if needed
                            booking_code: slip.booking_code, // optional
                        }))
                    );
                };

                setToday(extractGames(todayRes.data));
                setTomorrow(extractGames(tomorrowRes.data));
                setYesterday(extractGames(yesterdayRes.data));
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