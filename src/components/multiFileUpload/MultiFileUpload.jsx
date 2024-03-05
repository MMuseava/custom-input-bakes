import React, { useState } from "react";
import axios from "axios";

const MultiFileUpload = () => {
	const [files, setFiles] = useState([]);
	const [errorMessage, setErrorMessage] = useState("");
	const [uploadProgress, setUploadProgress] = useState(0);
	const [imagePreview, setImagePreview] = useState([]);
	const [uploadButtonClicked, setUploadButtonClicked] = useState(false);

	function clearState() {
		setFiles([]);
		setErrorMessage("");
		setUploadProgress(0);
		setImagePreview([]);
		setUploadButtonClicked(false);
	}

	function checkIsAllowedType(selectedFiles) {
		const allowedTypes = [".jpeg", ".png", ".gif"];
		return selectedFiles.some((file) => {
			const fileExtension = file.name.split(".").pop().toLowerCase();
			return allowedTypes.includes(`.${fileExtension}`);
		});
	}

	async function handleMultipleFileUploadAjax(files) {
		try {
			const formData = new FormData();
			files.forEach((file) => formData.append("file", file));

			const response = await axios.post("upload-image.php", formData, {
				onUploadProgress: (progressEvent) => {
					const percentCompleted = Math.round(
						(progressEvent.loaded * 100) / progressEvent.total
					);
					setUploadProgress(percentCompleted);
				},
			});

			console.log(response.data);
		} catch (error) {
			console.error(error);
		}
	}

	const validateFile = (e) => {
		clearState();
		const selectedFiles = Array.from(e.target.files);
		const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0);
		if (totalSize > 2 * 1024 * 1024) {
			setErrorMessage("Image size exceeds. It should be less than 2MB.");
		} else {
			const isAllowedFiles = checkIsAllowedType(selectedFiles);
			if (!isAllowedFiles) {
				setErrorMessage("Please select only image files (jpeg, png, gif).");
			} else {
				setFiles(selectedFiles);
				const previews = selectedFiles.map((file) => URL.createObjectURL(file));
				setImagePreview(previews);
			}
		}
	};

	const handleFileOnChange = (e) => {
		validateFile(e);
	};

	const handleMultiFileUpload = async () => {
		if (files.length === 0) {
			setErrorMessage("Please select at least a file to upload.");
			return;
		}
		setErrorMessage("");
		setUploadProgress(0);
		setUploadButtonClicked(true);
		await handleMultipleFileUploadAjax(files);
	};

	const handleDeleteImage = (index) => {
		const updatedFiles = [...files];
		updatedFiles.splice(index, 1);
		const updatedImagePreview = updatedFiles.map((file) =>
			URL.createObjectURL(file)
		);
		setFiles(updatedFiles);
		setImagePreview(updatedImagePreview);
	};

	return (
		<div>
			{errorMessage && <p className="validation-message">{errorMessage}</p>}
			<div className="file-upload-button">
				<input
					type="file"
					multiple
					accept="image/jpeg, image/png, image/gif"
					onChange={handleFileOnChange}
				/>
				<button onClick={handleMultiFileUpload}>Upload</button>
			</div>
			{uploadButtonClicked && (
				<div>
					<div className="image-container">
						{files.length > 0 && (
							<div>
								<h3>Preview :</h3>
							</div>
						)}
						{files.map((file, index) => (
							<div key={index} className="image-preview-container">
								<div>
									<img
										className="preview"
										src={imagePreview[index]}
										alt="Preview"
									/>
								</div>
								<button
									className="delete-button"
									onClick={() => handleDeleteImage(index)}
								>
									Delete
								</button>
							</div>
						))}
					</div>
					<div className="progress-bar">
						<div
							className="progress-fill"
							style={{ width: `${uploadProgress}%` }}
						></div>
					</div>
				</div>
			)}
		</div>
	);
};

export default MultiFileUpload;
