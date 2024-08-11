import React, { useState } from "react";
import styles from "./ImageSelector.module.scss";

interface ImageSelectorProps {
  initialImgUrl: string;
  onImageSelect: (file: File | null) => void;
  edit: boolean;
}

export default function ImageSelector({ onImageSelect, initialImgUrl, edit }: ImageSelectorProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImgUrl);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      onImageSelect(file); // Pass the file to the parent component
    } else {
      setPreviewUrl(initialImgUrl);
      onImageSelect(null); // Clear the file if no file is selected
    }
  };

  return (
    <div className={styles.imageSelectorBox}>
      {edit && <input className={styles.imageInput} type="file" accept="image/*" onChange={handleFileChange} id="fileInput" />}
      <label htmlFor="fileInput" className={edit ? styles.editImageBox:styles.imageBox} style={{ backgroundImage: previewUrl ? `url(${previewUrl})` : "", backgroundSize: "cover" }} />
    </div>
  );
}
