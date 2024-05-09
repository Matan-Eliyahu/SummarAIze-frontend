import React, { useState } from 'react';
import styles from './DragDrop.module.scss'
import icons from '../../common/icons'
import { WiCloudUp } from "react-icons/wi";
import * as pdfjs from 'pdfjs-dist';

interface DraggableItem {
    id: string;
    content: string;
}

pdfjs.GlobalWorkerOptions.workerSrc = 'node_modules/pdfjs-dist/build/pdf.worker.mjs'; // Replace with the actual path to pdf.worker.js

const DragDrop: React.FC = () => {
    const [items, setItems] = useState<DraggableItem[]>([]);
    const [droppedFile, setDroppedFile] = useState<JSX.Element | null>(null);
    const [PdfText, setPdfText] = useState<string | null>(null);
    const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);


    const iconSwitch = (fileName: string): JSX.Element => {
        const fileType = fileName.split('.')[fileName.split('.').length - 1]
        return (
            <img src={icons.find(icon => icon.type?.includes(fileType))?.src} alt="logo" style={{ width: "3rem" }} />
        )
    }

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>, id: string) => {
        event.dataTransfer.setData('application/pdf', id);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDraggingOver(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        setIsDraggingOver(false);
    };

    const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDraggingOver(false);
        // const droppedItemId = event.dataTransfer.getData('text/plain');
        // const newItems = items.filter(item => item.id !== droppedItemId);
        // setItems(newItems);

        // Handle dropped files
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            const droppedFile1 = files[0];
            setDroppedFile(iconSwitch(droppedFile1.name));


            // Load the PDF file using pdfjs
            const arrayBuffer = await readArrayBuffer(droppedFile1);
            const pdf = await pdfjs.getDocument(arrayBuffer as any).promise;

            // Read text content from each page
            let fullText = '';
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const textContent = await page.getTextContent();
                textContent.items.forEach((textItem : any) => {
                    fullText += textItem.str + ' ';
                });
                fullText += '\n'; // Add new line between pages
            }

            // Update state with PDF text content
            setPdfText(fullText);
        }
    };

    const readArrayBuffer = (file: any) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.onload = () => resolve(fileReader.result);
            fileReader.onerror = (error) => reject(error);
            fileReader.readAsArrayBuffer(file);
        });
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragLeave={handleDragLeave}
            className={isDraggingOver ? styles.draggingOver : styles.dragAndDropBox}
        >
            {droppedFile && (
                <div>
                    {droppedFile}
                </div>
            )}
            {isDraggingOver && <WiCloudUp className={styles.cloud} />}
        </div>
    )
};

export default DragDrop;

