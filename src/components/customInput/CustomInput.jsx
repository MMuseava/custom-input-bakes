import React, { useState } from "react";
import axios from "axios";
import "./customInput.style.scss";

const CustomInput = () => {
	const [selectedFiles, setSelectedFiles] = useState([]);

	const handleFileChange = (event) => {
		const files = Array.from(event.target.files);
		const newFiles = files.slice(0, 5 - selectedFiles.length);
		const updatedFiles = newFiles.map((file) => ({
			file: file,
			status: "initial",
		}));
		setSelectedFiles([...selectedFiles, ...updatedFiles]);
	};

	const handleDelete = (index) => {
		const updatedFiles = [...selectedFiles];
		updatedFiles.splice(index, 1);
		setSelectedFiles(updatedFiles);
	};

	// const handleDeleteAll = () => {
	// 	setSelectedFiles([]);
	// };

	const handleUpload = async () => {
		if (selectedFiles.length > 0) {
			const updatedFiles = [...selectedFiles];
			for (let i = 0; i < updatedFiles.length; i++) {
				if (updatedFiles[i].status === "initial") {
					updatedFiles[i].status = "uploading";
					try {
						const formData = new FormData();
						formData.append("file", updatedFiles[i].file);
						const response = await axios.post(
							"https://httpbin.org/post",
							formData
						);
						console.log(response.data);
						updatedFiles[i].status = "success";
					} catch (error) {
						console.error(error);
						updatedFiles[i].status = "fail";
					}
				}
			}
			setSelectedFiles(updatedFiles);
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

			<div className="custom-image">
				{selectedFiles.map((file, index) => (
					<div key={index} className="image-box">
						<h3 className="fileName">{file.file.name}</h3>

						<img
							className="image"
							src={URL.createObjectURL(file.file)}
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
			<div className="custom-uploading">
				{selectedFiles.map((file, index) => (
					<div key={index} className="upload-status">
						{file.status === "uploading" && <p>Uploading...</p>}
						{file.status === "success" && (
							<p className="success">✅ Upload successful!</p>
						)}
						{file.status === "fail" && (
							<p className="fail">❌ Upload failed!</p>
						)}
					</div>
				))}
				{/* <button
					className="deleteAllButton"
					onClick={handleDeleteAll}
					disabled={selectedFiles.length === 0}
				>
					Delete All
				</button> */}
			</div>
		</div>
	);
};

export default CustomInput;
