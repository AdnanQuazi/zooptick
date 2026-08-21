import { IconCamera, IconUpload } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import variables from "../../styles/variables.module.scss";

function ImageInput({ images, setFieldValue, errors, handleBlur, touched }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles((prevFiles) => [...files, ...prevFiles]);
    setFieldValue("images", [...files, ...selectedFiles]);
    console.log("asdasdasd");
  };
  useEffect(()=>{
    setSelectedFiles(images)
  },[images])
  const renderPreviewImages = () => {
    return selectedFiles.map((file, index) => {
      const fileURL = URL.createObjectURL(file);
      return (
        <img
          className="selected-image"
          key={index}
          src={fileURL}
          alt={`Preview ${index}`}
        />
      );
    });
  };

  return (
    <>
      <h2>Product Images</h2>
      <div>
        <div className="image-placeholder">
          {images.length > 0 && renderPreviewImages()}
          {selectedFiles.length <= 0 ? (
            <label
              className="image-selector"
              style={{
                borderColor:
                  errors.images && touched.images
                    ? variables.error
                    : variables.dark_gray,
              }}
            >
              <IconCamera
                size={50}
                stroke={1.2}
                style={{ pointerEvents: "none" }}
              ></IconCamera>
              <p>Add</p>
              <input
                name="images"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                onBlur={handleBlur}
                multiple
              ></input>
            </label>
          ) : (
            <button className="image-selector-button">
              <IconUpload
                size={20}
                stroke={2}
                style={{ pointerEvents: "none" }}
              ></IconUpload>
              Add More Images
              <input
                name="images"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                multiple
              ></input>
            </button>
          )}
          <p className="input-error-text">
            {errors.images && touched.images
              ? errors.images
              : ""}
          </p>
        </div>
      </div>
    </>
  );
}
export default ImageInput;
