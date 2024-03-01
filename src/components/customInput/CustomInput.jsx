import React, { useState } from "react";
import axios from "axios";
import "./customInput.style.scss";

const CustomInput = () => {
	const [selectedFiles, setSelectedFiles] = useState([]);
	const [status, setStatus] = useState("initial");

	const handleFileChange = (event) => {
		const files = Array.from(event.target.files);
		setSelectedFiles([...selectedFiles, ...files]);
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
		<div>
			<input type="file" onChange={handleFileChange} multiple />

			<div>
				{status === "uploading" && <p>Uploading...</p>}
				{status === "success" && <p>✅Upload successful!</p>}
				{status === "fail" && <p>❌Upload failed!</p>}
			</div>

			<div>
				{selectedFiles.map((file, index) => (
					<div key={index}>
						<h3>{file.name}</h3>
						<img
							className="image"
							src={URL.createObjectURL(file)}
							alt={`upload-preview-${index}`}
						/>
					</div>
				))}
				<button onClick={handleUpload} disabled={selectedFiles.length === 0}>
					Upload {selectedFiles.length === 0 ? "a file" : "Files"}
				</button>
			</div>
		</div>
	);
};

export default CustomInput;
