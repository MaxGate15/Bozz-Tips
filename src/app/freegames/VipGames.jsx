import React, { useEffect, useState } from "react";
import axios from "axios";

const useVipGames = () => {
  const [slips, setSlips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://wonit-backend.onrender.com/vipp-today");
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

  return { slips, loading, error };
};

export default useVipGames;
