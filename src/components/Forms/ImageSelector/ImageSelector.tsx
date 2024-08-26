import React, { useState } from "react";
import styles from "./ImageSelector.module.scss";

interface ImageSelectorProps {
  imageUrl: string;
  fullName: string;
  onImageSelect: (file: File | null) => void;
  edit: boolean;
}

export default function ImageSelector({ onImageSelect, imageUrl, fullName, edit }: ImageSelectorProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(imageUrl);
  const [isImageSelected, setIsImageSelected] = useState<boolean>(!!imageUrl);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      setIsImageSelected(true);
      onImageSelect(file);
    } else {
      setPreviewUrl(imageUrl);
      setIsImageSelected(false);
      onImageSelect(null);
    }
  };

  return (
    <div className={styles.imageSelectorBox}>
      {edit && <input className={styles.imageInput} type="file" accept="image/*" onChange={handleFileChange} id="fileInput" />}
      <label
        htmlFor="fileInput"
        className={edit ? styles.editImageBox : imageUrl ? styles.imageBox : styles.defaultImageBox}
        style={{ backgroundImage: previewUrl ? `url(${previewUrl})` : "", backgroundSize: "cover" }}
      >
        {!isImageSelected && !imageUrl && fullName[0].toUpperCase()}
      </label>
    </div>
  );
}
