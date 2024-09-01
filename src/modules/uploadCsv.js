document.getElementById('csvFile').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('file', file);
        
        fetch('http://127.0.0.1:5000/upload', {
            method: 'POST',
            body: formData
        })
    }
});