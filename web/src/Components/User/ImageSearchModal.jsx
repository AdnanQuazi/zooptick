import React, { useState, useRef, useEffect } from "react";
import {
  IconCamera,
  IconUpload,
  IconX,
  IconPhoto,
  IconSparkles,
  IconLoader2,
  IconArrowRight,
  IconRefresh,
  IconPointFilled,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { reverseImageSearch } from "../../Api/api";
import "./ImageSearchModal.css";

export default function ImageSearchModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Stop camera on unmount or close
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setSelectedImage(null);
      setPreviewUrl(null);
      setResults([]);
      setErrorMsg("");
    }
  }, [isOpen]);

  // Start device camera
  const startCamera = async () => {
    try {
      setErrorMsg("");
      setPreviewUrl(null);
      setSelectedImage(null);
      setResults([]);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error("Camera access error:", err);
      setErrorMsg(
        t("imageSearch.cameraError") ||
          "Could not access camera. Please upload an image file instead."
      );
      setIsCameraActive(false);
    }
  };

  // Capture frame from camera
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], "camera-capture.jpg", {
            type: "image/jpeg",
          });
          setSelectedImage(file);
          setPreviewUrl(canvas.toDataURL("image/jpeg"));
          stopCamera();
          performSearch(file);
        }
      },
      "image/jpeg",
      0.9
    );
  };

  // Handle file select
  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      stopCamera();
      performSearch(file);
    }
  };

  // Handle drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      stopCamera();
      performSearch(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Perform search
  const performSearch = async (imageFile) => {
    try {
      setIsSearching(true);
      setErrorMsg("");
      const response = await reverseImageSearch(imageFile);
      if (response && response.results) {
        setResults(response.results);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error("Reverse image search error:", err);
      setErrorMsg(
        t("imageSearch.searchError") ||
          "Search failed. Please try a different photo or format."
      );
    } finally {
      setIsSearching(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="image-search-overlay" onClick={onClose}>
      <div
        className="image-search-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="image-search-header">
          <div className="header-title-group">
            <IconSparkles className="sparkle-icon" size={24} />
            <div>
              <h3>{t("imageSearch.title") || "Visual Product Search"}</h3>
              <p>
                {t("imageSearch.subtitle") ||
                  "Upload or snap a photo to find matching products instantly"}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <IconX size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="image-search-body">
          {/* CAMERA VIEW */}
          {isCameraActive && (
            <div className="camera-view-container">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="camera-video"
              />
              <div className="camera-controls">
                <button
                  type="button"
                  className="camera-capture-btn"
                  onClick={capturePhoto}
                >
                  <IconCamera size={26} />
                  <span>{t("imageSearch.takePhoto") || "Snap Photo"}</span>
                </button>
                <button
                  type="button"
                  className="camera-cancel-btn"
                  onClick={stopCamera}
                >
                  {t("common.cancel") || "Cancel"}
                </button>
              </div>
            </div>
          )}

          {/* PREVIEW + SCANNING VIEW */}
          {!isCameraActive && previewUrl && (
            <div className="image-preview-section">
              <div className="preview-box">
                <img
                  src={previewUrl}
                  alt="Search query preview"
                  className="query-image-preview"
                />
                {isSearching && (
                  <div className="scanning-bar-container">
                    <div className="scanning-bar"></div>
                    <div className="scanning-overlay-text">
                      <IconLoader2 size={24} className="spin-icon" />
                      <span>
                        {t("imageSearch.analyzing") || "Analyzing visual features..."}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="preview-actions">
                <button
                  type="button"
                  className="action-btn retry-btn"
                  onClick={() => {
                    setPreviewUrl(null);
                    setSelectedImage(null);
                    setResults([]);
                  }}
                >
                  <IconRefresh size={18} />
                  <span>{t("imageSearch.newPhoto") || "Try Another Photo"}</span>
                </button>
              </div>
            </div>
          )}

          {/* UPLOAD & CAMERA PROMPT */}
          {!isCameraActive && !previewUrl && (
            <div
              className="dropzone-container"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: "none" }}
              />

              <div className="dropzone-icon-wrapper">
                <IconPhoto size={42} stroke={1.5} />
              </div>
              <h4>
                {t("imageSearch.dropText") ||
                  "Drag & drop your product image here"}
              </h4>
              <p>
                {t("imageSearch.orBrowse") || "or choose from your files"}
              </p>

              <div className="dropzone-button-group" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className="dropzone-btn upload-file-btn"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                >
                  <IconUpload size={18} />
                  <span>{t("imageSearch.browseFiles") || "Browse Images"}</span>
                </button>
                <button
                  type="button"
                  className="dropzone-btn camera-open-btn"
                  onClick={startCamera}
                >
                  <IconCamera size={18} />
                  <span>{t("imageSearch.useCamera") || "Use Camera"}</span>
                </button>
              </div>
            </div>
          )}

          {/* ERROR DISPLAY */}
          {errorMsg && <div className="image-search-error">{errorMsg}</div>}

          {/* SEARCH RESULTS */}
          {results.length > 0 && (
            <div className="visual-results-container">
              <div className="results-header">
                <h4>
                  {t("imageSearch.matchedProducts") || "Visual Matches Found"} ({results.length})
                </h4>
              </div>

              <div className="visual-products-grid">
                {results.map((product) => (
                  <div
                    key={`${product.shopId}-${product.productId}`}
                    className="visual-product-card"
                    onClick={() => {
                      onClose();
                      navigate(`/product/?_id=${product.productId}`);
                    }}
                  >
                    <div className="card-image-wrap">
                      <img
                        src={product.matchedImageUrl}
                        alt={product.productName}
                      />
                      <span className="similarity-badge">
                        {product.similarityScore}% {t("imageSearch.match") || "Match"}
                      </span>
                    </div>

                    <div className="card-details">
                      <h5>{product.productName}</h5>
                      <p className="card-description">{product.desc}</p>
                      <p className="card-shop-name">{product.shopName}</p>
                      <div className="card-price-row">
                        <span className="card-price">
                          Rs. {product.sellingPrice}
                        </span>
                        {product.MRP && product.MRP > product.sellingPrice && (
                          <span className="card-mrp">Rs. {product.MRP}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NO RESULTS DISPLAY */}
          {!isSearching && previewUrl && results.length === 0 && !errorMsg && (
            <div className="no-visual-matches">
              <p>
                {t("imageSearch.noMatches") ||
                  "No close visual matches found in current store catalog. Try adjusting the photo lighting or angle."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
