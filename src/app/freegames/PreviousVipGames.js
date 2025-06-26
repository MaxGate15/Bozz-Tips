import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { getUsername } from "../utils/auth";



const usePreviousVipGames = () => {
    const [allPSlips, setAllSlips] = useState([]);
    const [vipPSlips, setVipSlips] = useState([]);
    const [vvip1PSlips, setVvip1Slips] = useState([]);
    const [vvip2PSlips, setVvip2Slips] = useState([]);
    const [vvip3PSlips, setVvip3Slips] = useState([]);
    const [loadP, setLoading] = useState(true);
    const [errorsP, setError] = useState(null);
    const username = getUsername();
    
    useEffect(() => {
        const fetchData = async () => {
        try {
            const res = await axios.get("https://bozztips-app-57hce.ondigitalocean.app/previous-purchased-games/", {
            headers: { "X-Username": username },
            });
    
            const slips = res.data;
            setAllSlips(slips);
    
            // ✅ Separate based on category
            setVipSlips(slips.filter((slip) => slip.category === "vip"));
            setVvip1Slips(slips.filter((slip) => slip.category === "vvip1"));
            setVvip2Slips(slips.filter((slip) => slip.category === "vvip2"));
            setVvip3Slips(slips.filter((slip) => slip.category === "vvip3"));
        } catch (err) {
            console.error("Error fetching data:", err);
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
        vipPSlips,
        vvip1PSlips,
        vvip2PSlips,
        vvip3PSlips,
    };
}
export default usePreviousVipGames;