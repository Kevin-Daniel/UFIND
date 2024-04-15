import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useUserCourses = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuthContext();

    const getUserCourses = async () => {
        if (!user) {
            return null;
        } else {
            setIsLoading(true);
            setError(null);
            const response = await fetch('/api/userCourses/fetch', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json',
                            'Authorization': `Bearer ${user.token}`
                }
            });

            const json = await response.json();
            setIsLoading(false);

            if (!response.ok) {
                setError(json.error);
                return null;
            } else {
                console.log("hook: " + json[0].courses);
                return json[0].courses;
            }
        }

        
    }

    const updateUserCourses = async (courses) => {
        if (!user) {
            return false;
        } else {
            setIsLoading(true);
            setError(null);
            const response = await fetch('/api/userCourses/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',
                            'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({courses})
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

    return { getUserCourses, updateUserCourses, isLoading, error };
}