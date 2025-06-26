import React, { useEffect, useState } from "react";
import axios from "axios";
import { getUsername } from '../utils/auth';

const useCurrentVipGames = () => {
  const [allSlips, setAllSlips] = useState([]);
  const [vipSlips, setVipSlips] = useState([]);
  const [vvip1Slips, setVvip1Slips] = useState([]);
  const [vvip2Slips, setVvip2Slips] = useState([]);
  const [vvip3Slips, setVvip3Slips] = useState([]);
  const [load, setLoading] = useState(true);
  const [errors, setError] = useState(null);
  const username = getUsername();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://bozztips-app-57hce.ondigitalocean.app/current-purchased-games/", {
          headers: { 'X-Username': username },
        });

        const slips = res.data;
        setAllSlips(slips);

        // ✅ Separate based on category
        setVipSlips(slips.filter(slip => slip.category === 'vip'));
        setVvip1Slips(slips.filter(slip => slip.category === 'vvip1'));
        setVvip2Slips(slips.filter(slip => slip.category === 'vvip2'));
        setVvip3Slips(slips.filter(slip => slip.category === 'vvip3'));

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
    load,
    errors,
    allSlips,
    vipSlips,
    vvip1Slips,
    vvip2Slips,
    vvip3Slips
  };
};



export default useCurrentVipGames;
