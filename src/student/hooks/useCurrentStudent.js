import { useEffect, useState } from 'react';
import useStudentAuthStore from '../stores/studentAuthStore';
import client, { extractData } from '../../erp/api/client';

const useCurrentStudent = () => {
  const user = useStudentAuthStore((s) => s.user);
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadStudent = async () => {
      // Optimization: if the user in store is already the enriched student object (+ has uid), use it
      if (user?.uid) {
        if (isMounted) {
          setStudent(user);
          setIsLoading(false);
        }
        return;
      }

      if (!user?.id || user?.roleType !== 'student') {
        if (isMounted) {
          setStudent(null);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await client.get('/students/me');
        const data = extractData(response);

        if (isMounted) {
          setStudent(data || null);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load student profile');
          setIsLoading(false);
        }
      }
    };

    loadStudent();

    return () => {
      isMounted = false;
    };
  }, [user?.id, user?.roleType]);

  return { student, isLoading, error };
};

export default useCurrentStudent;
