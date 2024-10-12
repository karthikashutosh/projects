import { useEffect } from "react";
import { CatDataType } from "../types";

const Overlay: React.FC<{ item: CatDataType; onClose: () => void }> = ({ item, onClose }) => {

    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
          if (event.key === 'Escape') {
            onClose();
          }
        };
    
        document.addEventListener('keydown', handleEscapeKey);
    
        return () => {
          document.removeEventListener('keydown', handleEscapeKey);
        };
      }, [onClose]);
    
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-3xl max-h-3xl flex flex-col gap-4">
         
            <img src={item.imgUrl} alt={item.title} className="max-w-full max-h-full object-contain" />
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Close
            </button>
          </div>
        </div>
      );
    };    

export default Overlay