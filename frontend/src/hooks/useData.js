import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useData = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuthContext();

    const generateData = async () => {
        if (!user) {
            return false;
        } else {
            setIsLoading(true);
            setError(null);
            const response = await fetch('/api/populate/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',
                            'Authorization': `Bearer ${user.token}`
                }
            });

            const json = await response.json();
            
            setIsLoading(false);

            if (!response.ok) {
                setError(json.error);
                return false;
            } else {
                return true;
            }
        }   
    }

    return { generateData };
}