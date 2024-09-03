import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';

function UploadCsv() {
    const [file, setFile] = useState(null);
    const [previousFiles, setPreviousFiles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch previously uploaded files
        fetch("/api/getPreviousFilesNames")
            .then(response => response.json())
            .then(data => setPreviousFiles(data.files))
            .catch(error => console.error("Error fetching previous files:", error));
    }, []);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        handleUpload(event.target.files[0]);
    };

    const handleSelectChange = (event) => {
        handleUpload(null, event.target.value);
    };

    const fetchSelectedFile = async (selectedPreviousFile) => {
        try {
            const response = await fetch(`/api/getFile?filename=${selectedPreviousFile}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error fetching file! ${errorData.error}`);
            }
            const fileBlob = await response.blob();
            return new File([fileBlob], selectedPreviousFile);
        } catch (error) {
            console.error(error.message);
            return null;
        }
    };

    const uploadFile = async (selectedFile) => {
        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Upload error! ${errorData.error}`);
            }

            return await response.json();
        } catch (error) {
            console.error(error.message);
            return null;
        }
    };

    const processFile = async (filepath) => {
        try {
            const processResponse = await fetch("/api/process", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ filepath }),
            });

            if (!processResponse.ok) {
                const errorData = await processResponse.json();
                throw new Error(`Process error! ${errorData.error}`);
            }

            const result = await processResponse.json();
            navigate("/graphs", {});
            return result;
        } catch (error) {
            console.error(error.message);
            return null;
        }
    };

    const handleUpload = async (selectedFile = file, selectedPreviousFile = document.getElementById('previousFiles').value) => {
        if (!selectedFile && !selectedPreviousFile) {
            alert("Please select a file first!");
            return;
        }

        if (selectedPreviousFile) {
            selectedFile = await fetchSelectedFile(selectedPreviousFile);
            if (!selectedFile) return;
        }

        const uploadResult = await uploadFile(selectedFile);
        if (!uploadResult) return;

        await processFile(uploadResult.filepath);
    };

    return (
        <div className="UploadCsv container d-flex flex-column align-items-center justify-content-center vh-100">
            <div className="load-csv mb-3">
                <input type="file" accept=".csv" onChange={handleFileChange} style={{ display: "none" }} id="csvFile" />
                <button type="button" className="btn button" onClick={() => document.getElementById('csvFile').click()}>Upload CSV</button>
            </div>
            <div className="select-previous-file">
                <select id="previousFiles" className="form-control" onChange={handleSelectChange}>
                    <option value="">Select a previously uploaded file</option>
                    {previousFiles.map((file, index) => (
                        <option key={index} value={file}>{file}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default UploadCsv;