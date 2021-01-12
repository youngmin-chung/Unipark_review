import React from 'react';
import "./ImageModal.css";

const ImageModal = ({selectedImage, setSelectedImage}) => {

    const handleClick = (e) => {
        // If click the backdrop area, it closed the modal
        if(e.target.classList.contains('backdrop')) {
            setSelectedImage(null)
        }
    }
    return (
        <div className="backdrop" onClick={handleClick}>
            <img src={selectedImage} alt="enlarged pic" />
        </div>
    )
}

export default ImageModal