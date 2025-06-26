import React from "react";
import { useEffect, useState } from "react";
import { getUsername } from "../utils/auth";
import axios from "axios";

const useUpdateCheck = () => {
    const [updateAvailable, setUpdateAvailable] = useState(null);
    const [updatePurchase, setUpdatePurchase] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const username = getUsername();
    
    useEffect(() => {
        const fetchData = async () => {
        try {
            const [updates,userPurchase] = await Promise.all([axios.get("https://bozztips-app-57hce.ondigitalocean.app/check-today/",            ),
            axios.get("https://bozztips-app-57hce.ondigitalocean.app/check-user-purchases/",{
            headers: { "X-Username": username },})]);
    
            
            setUpdateAvailable(updates.data);
            setUpdatePurchase(userPurchase.data);
            
        } catch (err) {
            console.error("Error fetching data:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
        };
    
        fetchData();
    }, []);
    
    return { updateAvailable, updatePurchase, loading, error };
}
export default useUpdateCheck;