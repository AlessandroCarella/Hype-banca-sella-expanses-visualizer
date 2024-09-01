document.getElementById('csvFile').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('file', file);
        
        fetch('http://127.0.0.1:5000/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            // Handle the response from the server
        })
        .catch((error) => {
            console.error('Error:', error);
            // Display error message to user
            alert('An error occurred: ' + (error.error || 'Unknown error'));
        });
    }
});