import React, { useState } from "react";
import axios from "axios";
import "./customInput.style.scss";

const CustomInput = () => {
	const [selectedFiles, setSelectedFiles] = useState([]);
	const [status, setStatus] = useState("initial");

	const handleFileChange = (event) => {
		const files = Array.from(event.target.files);
		const newFiles = files.slice(0, 5 - selectedFiles.length);
		setSelectedFiles([...selectedFiles, ...newFiles]);
	};

	const handleDelete = (index) => {
		const updatedFiles = [...selectedFiles];
		updatedFiles.splice(index, 1);
		setSelectedFiles(updatedFiles);
	};

	const handleUpload = async () => {
		if (selectedFiles.length > 0) {
			setStatus("uploading");

			const formData = new FormData();
			selectedFiles.forEach((file, index) => {
				formData.append(`file${index}`, file);
			});

			try {
				const response = await axios.post("https://httpbin.org/post", formData);
				console.log(response.data);
				setStatus("success");
			} catch (error) {
				console.error(error);
				setStatus("fail");
			}
		}
	};

	return (
		<div className="custom-container">
			<div className="custom-input">
				<h2>Custom Input</h2>

				<input
					type="file"
					onChange={handleFileChange}
					className="input-file"
					multiple
				/>
			</div>

			<div className="custom-uploading">
				{status === "uploading" && <p>Uploading...</p>}
				{status === "success" && (
					<p className="success">✅ Upload successful!</p>
				)}
				{status === "fail" && <p className="fail">❌ Upload failed!</p>}
			</div>

			<div className="custom-image">
				{selectedFiles.map((file, index) => (
					<div key={index} className="image-box">
						<h3 className="fileName">{file.name}</h3>

						<img
							className="image"
							src={URL.createObjectURL(file)}
							alt={`upload-preview-${index}`}
						/>
						<button className="delete" onClick={() => handleDelete(index)}>
							x
						</button>
					</div>
				))}
			</div>
			<div>
				<button
					className="uploadButton"
					onClick={handleUpload}
					disabled={selectedFiles.length === 0}
				>
					Upload {selectedFiles.length === 0 ? "a file" : "Files"}
				</button>
			</div>
		</div>
	);
};

export default CustomInput;
