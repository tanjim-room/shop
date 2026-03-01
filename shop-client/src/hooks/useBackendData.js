import { useCallback, useEffect, useState } from 'react';

const getErrorMessage = (error) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Something went wrong';
};

const useBackendData = ({ loader, initialData = null, enabled = true }) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState('');
  const [refreshCount, setRefreshCount] = useState(0);

  const reload = useCallback(() => {
    setRefreshCount((prev) => prev + 1);
  }, []);

  const runLoader = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return null;
    }

    setLoading(true);
    setError('');

    try {
      const result = await loader();
      setData(result);
      return result;
    } catch (loadError) {
      setError(getErrorMessage(loadError));
      return null;
    } finally {
      setLoading(false);
    }
  }, [enabled, loader]);

  useEffect(() => {
    runLoader();
  }, [runLoader, refreshCount]);

  return {
    data,
    setData,
    loading,
    error,
    reload,
  };
};

export default useBackendData;
