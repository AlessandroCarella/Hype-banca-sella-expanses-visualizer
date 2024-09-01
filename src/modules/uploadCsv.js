document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('csvFile');
    const previousFilesSelect = document.getElementById('previousFiles');

    fileInput.addEventListener('change', handleFileUpload);
    previousFilesSelect.addEventListener('change', handlePreviousFileSelection);

    // Fetch and populate the list of previously uploaded files
    fetchPreviousFiles();
});

async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const response = await fetch('http://127.0.0.1:5000/upload', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                console.log('File uploaded successfully');
                // Add any additional logic for successful upload
            } else {
                console.error('Error uploading file');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    }
}

async function fetchPreviousFiles() {
    try {
        const response = await fetch('http://localhost:5000/get_previous_files');
        const files = await response.json();
        const select = document.getElementById('previousFiles');
        
        files.forEach(file => {
            const option = document.createElement('option');
            option.value = file;
            option.textContent = file;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching previous files:', error);
    }
}

async function handlePreviousFileSelection(event) {
    const selectedFile = event.target.value;
    if (selectedFile) {
        try {
            const response = await fetch('http://localhost:5000/process_previous_file', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ filename: selectedFile }),
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                console.log('Previous file processed successfully');
                // Add any additional logic for successful processing
            } else {
                console.error('Error processing previous file:', data.error);
            }
        } catch (error) {
            console.error('Error processing previous file:', error);
        }
    }
}