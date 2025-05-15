import React, { useEffect, useState } from "react";
import axios from "axios";

const useVipGames = () => {
  const [slips, setSlips] = useState([]);
  const [load, setLoading] = useState(true);
  const [errors, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://wonit-backend.onrender.com/vvip-today");
        setSlips(res.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { slips, load, errors };
};

export default useVipGames;
