import React, { useState } from "react";
import { FaUpload,  } from "react-icons/fa";
import axios from "axios"


const Body = () => {
  const [image, setImage] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "hi", name: "Hindi" },
    { code: "it", name: "Italian" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "pt", name: "Portuguese" },
    { code: "ru", name: "Russian" },
    { code: "zh", name: "Chinese" },
    { code: "ar", name: "Arabic" },
    { code: "vi", name: "Vietnamese" },
  ];

  
 const handleImageUpload = (event) => {
   const file = event.target.files[0];
   if (file) {
     setImage(file);
   }
 };

 const handleAnalyze = async () => {
   if (!image) {
     alert("Please upload an image first.");
     return;
   }

   setIsAnalyzing(true);

  
   const formData = new FormData();
   formData.append("image", image); 
   formData.append("lang", selectedLanguage); 

   try {
     const { data } = await axios.post(
       "https://ai-plant-doctor.onrender.com/analyze",
       formData
     );

     setAnalysisResult(data.result);
     
     
      setIsAnalyzing(false);
   } catch (error) {
     console.error("Error during image analysis:", error);
      setIsAnalyzing(false);
   }
 };

  return (
    <main className="flex flex-col py-28 relative justify-center items-center">
      <h1 className="text-center font-bold text-7xl ">Analyze Your Plants</h1>
      <p className="text-center text-lg py-2 w-1/2 text-[#6A7280] ">
        Upload an image of your plant and get instant analysis. Identify
        species, health issues, and care recommendations.
      </p>

      <label
        htmlFor="file-upload"
        className="flex justify-center items-center gap-4 rounded-lg px-24 py-2 border-2 cursor-pointer"
      >
        <FaUpload className="text-[#6A7280]" />
        <span>Upload Plant Image</span>
      </label>
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleImageUpload}
      />

      {/* Image preview */}
      {image && (
        <div className="mt-4">
          <img
            src={URL.createObjectURL(image)}
            alt="Uploaded Plant"
            className="mx-auto max-h-64 rounded-lg object-cover shadow-lg"
          />
        </div>
      )}

      <div className="flex items-center justify-center space-x-2 mt-4">
        <button
          onClick={handleAnalyze}
          disabled={!image || isAnalyzing}
          className={`flex justify-center items-center gap-4 rounded-lg px-6 py-2 border-2 ${
            isAnalyzing
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 text-white"
          }`}
        >
          {isAnalyzing ? "Analyzing..." : "Analyze"}
        </button>

        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="border-2 px-4 py-2 rounded-lg"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      {analysisResult && (
        <div className="mt-4 p-4 bg-gray-200 rounded-lg shadow-lg w-1/2">
          <h2 className="text-lg font-semibold mb-2">Analysis Result:</h2>
          <p className="text-sm text-gray-600">{analysisResult}</p>
        </div>
      )}
    </main>
  );
};

export default Body;