import { useState, useCallback } from 'react';
import ErrorHandler from '../services/ErrorHandler';

const useSection = (repository) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadItems = useCallback(async (profileId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await repository.findAll(profileId);
      setItems(data);
    } catch (err) {
      setError(ErrorHandler.process(err));
    } finally {
      setLoading(false);
    }
  }, [repository]);

  const saveItem = async (itemData) => {
    try {
      setLoading(true);
      if (itemData.id) {
         // Determine if updating or creating
         const existing = await repository.findById(itemData.id);
         if (existing) {
           itemData.updatedAt = new Date().toISOString();
           const updated = await repository.update(itemData.id, itemData);
           setItems((prev) => prev.map((it) => (it.id === updated.id ? updated : it)));
           return updated;
         }
      }
      const created = await repository.create(itemData);
      setItems((prev) => [...prev, created]);
      return created;
    } catch (err) {
      setError(ErrorHandler.process(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id, softDelete = true) => {
    try {
      setLoading(true);
      await repository.delete(id, softDelete);
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch (err) {
      setError(ErrorHandler.process(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { items, loading, error, loadItems, saveItem, deleteItem };
};

export default useSection;
