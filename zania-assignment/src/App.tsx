import React, { useEffect, useState, useCallback } from "react";
import Overlay from "./components/overlay";
import { CatDataType } from "./types";
import LoadingSpinner from "./components/LoadingSpinner";
import { setStorageData } from "./mocks/handler";

const MINIMUM_LOADING_TIME = 500; // 500ms minimum loading time


function App() {
  const [items, setItems] = useState<CatDataType[]>([]);
  const [selectedItem, setSelectedItem] = useState<CatDataType | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);


  const handleOverlay = (position: number) => {
    const select = items?.find((v) => v.position === position);
    setSelectedItem(select as CatDataType);
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    position: number
  ) => {
    e.dataTransfer.setData("text/plain", position.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    dropPosition: number
  ) => {
    e.preventDefault();
    const dragPosition = parseInt(e.dataTransfer.getData("text/plain"), 10);

    if (dragPosition !== dropPosition) {
      const newItems = [...items];
      const [reorderedItem] = newItems.splice(dragPosition, 1);
      newItems.splice(dropPosition, 0, reorderedItem);
      setItems(newItems);
      setHasChanges(true);
    }
  };

  const fetchCats = useCallback(async () => {
    setLoading(true);
    setError(null);
    const startTime = Date.now();

    try {
      const response = await fetch("/api/cats");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setItems(result);
      setLastSaved(new Date());
    } catch (error) {
      console.error("There was a problem fetching the cat data:", error);
      setError("Failed to fetch cat data. Please try again later.");
    } finally {
      const endTime = Date.now();
      const loadingTime = endTime - startTime;
      if (loadingTime < MINIMUM_LOADING_TIME) {
        setTimeout(() => setLoading(false), MINIMUM_LOADING_TIME - loadingTime);
      } else {
        setLoading(false);
      }
    }
  }, []);

  const saveData = useCallback(async () => {
    if (!hasChanges) return;
    setIsSaving(true);
    try {
      const response = await fetch("/api/cats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      });
      if (!response.ok) throw new Error("Failed to save data");
      setStorageData("cats",items)
      setLastSaved(new Date());
      setHasChanges(false);
    } catch (error) {
      console.error("Error saving data:", error);
      setError("Failed to save changes. Please try again later.");
    } finally {
      setIsSaving(false);
    }
  }, [items, hasChanges]);



  useEffect(() => {
    fetchCats();
  }, []);

  useEffect(() => {
    const saveInterval = setInterval(() => {
      saveData();
    }, 5000);

    return () => clearInterval(saveInterval);
  }, [saveData]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-purple-100 p-4">
      <div className="mb-4 text-sm text-gray-600">
        {isSaving ? (
          <span className="flex items-center">
            <LoadingSpinner />
            <span className="ml-2">Saving...</span>
          </span>
        ) : lastSaved ? (
          `Last saved: ${lastSaved.toLocaleTimeString()}`
        ) : (
          "Not saved yet"
        )}
      </div>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <div className="grid grid-cols-3 gap-8">
        {items?.map((item, index) => (
          <div
            key={item.position}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            onClick={() => handleOverlay(item.position)}
            className="w-48 h-48 overflow-hidden bg-white hover:border-purple-500 cursor-move hover:border-2 rounded-md flex justify-center items-center"
          >
            {isLoading ? (
              <div className="w-full h-full flex justify-center items-center">
                <LoadingSpinner />
              </div>
            ) : (
              <img
                className="w-full h-full object-cover"
                src={item.imgUrl}
                alt={item.title}
              />
            )}
          </div>
        ))}
      </div>
      {selectedItem && (
        <Overlay item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}

export default App;
