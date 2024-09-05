export const fetchSelectedFile = async (selectedPreviousFile) => {
    try {
        const response = await fetch(
            `/api/getFile?filename=${selectedPreviousFile}`
        );
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

export const uploadFile = async (selectedFile) => {
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

export const checkUserCategoriesSetted = async () => {
    try {
        const response = await fetch("/api/userCategoriesSetted");
        if (!response.ok) {
            throw new Error("Failed to check user categories settings");
        }
        return await response.json();
    } catch (error) {
        console.error("Error checking user categories settings:", error);
        return false;
    }
};

export const processFile = async (filepath, navigate) => {
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

        // Check user categories settings before navigating
        const userCategoriesSetted = await checkUserCategoriesSetted();
        if (userCategoriesSetted) {
            navigate("/graphs");
        } else {
            navigate("/select-options");
        }

        return result;
    } catch (error) {
        console.error(error.message);
        return null;
    }
};