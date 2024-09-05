import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import Button from "../components/Button";
import LoadingPage from "./LoadingPage"; // Import LoadingPage
import { ColorModeSwitch } from "../components/colorModeSwitch";
import { fetchSelectedFile, uploadFile, checkUserCategoriesSetted, processFile } from './helpers/UploadCsvHelper'; // Import helper functions

function UploadCsv() {
    const [file, setFile] = useState(null);
    const [previousFiles, setPreviousFiles] = useState([]);
    const [loading, setLoading] = useState(false); // Add loading state
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch previously uploaded files
        fetch("/api/getPreviousFilesNames")
            .then((response) => response.json())
            .then((data) => setPreviousFiles(data.files))
            .catch((error) =>
                console.error("Error fetching previous files:", error)
            );
    }, []);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        handleUpload(event.target.files[0]);
    };

    const handleSelectChange = (event) => {
        handleUpload(null, event.target.value);
    };

    const handleUpload = async (
        selectedFile = file,
        selectedPreviousFile = document.getElementById("previousFiles").value
    ) => {
        if (!selectedFile && !selectedPreviousFile) {
            alert("Please select a file first!");
            return;
        }

        if (selectedPreviousFile) {
            selectedFile = await fetchSelectedFile(selectedPreviousFile);
            if (!selectedFile) return;
        }

        setLoading(true); // Set loading to true
        const uploadResult = await uploadFile(selectedFile); // Use helper function
        setLoading(false); // Set loading to false

        if (!uploadResult) return;

        setLoading(true); // Set loading to true
        await processFile(uploadResult.filepath, navigate); // Use helper function
        setLoading(false); // Set loading to false
    };

    if (loading) {
        return <LoadingPage />; // Show loading page when loading
    }

    return (
        <div className="UploadCsv container d-flex flex-column align-items-center justify-content-center vh-100">
            <div className="mb-3">
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    id="csvFile"
                />
                <Button
                    onClick={() => document.getElementById("csvFile").click()}
                >
                    Upload CSV
                </Button>
            </div>
            <div className="select-previous-file">
                <select
                    id="previousFiles"
                    className="form-control"
                    onChange={handleSelectChange}
                >
                    <option value="">Select a previously uploaded file</option>
                    {previousFiles.map((file, index) => (
                        <option key={index} value={file}>
                            {file}
                        </option>
                    ))}
                </select>
            </div>

            <ColorModeSwitch />
        </div>
    );
}

export default UploadCsv;
