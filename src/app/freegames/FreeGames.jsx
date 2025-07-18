import React, { useEffect, useState } from "react";
import axios from "axios";
import { u } from "framer-motion/client";

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
                    axios.get("https://admin.bozz-tips.com/today-games"),
                    axios.get("https://admin.bozz-tips.com/tomorrow-games"),
                    axios.get("https://admin.bozz-tips.com/yesterday-games"),
                ]);

                // Flatten games from slips
                

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

const previousGames = (day) => {
    const [otherGames, setOtherGames] = useState([]);
    useEffect(() => {
        const fetchPreviousGames = async () => {
            try {
                const response = await axios.get(`https://admin.bozz-tips.com/free-games/?date=${day}`);
                
                setOtherGames(extractGames(response.data));
            } catch (err) {
                console.error(`Error fetching ${day} games:`, err);
                return [];
            }
        };

        fetchPreviousGames();
    }, [day]);
    return otherGames;
};

export default useGames;
export { previousGames };