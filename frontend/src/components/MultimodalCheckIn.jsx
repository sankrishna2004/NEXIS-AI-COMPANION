// src/components/MUltimodalCheckIn.jsx

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function MultimodalCheckIn({ onClose }) {
    const { auth } = useAuth();
    const videoRef = useRef(null);
    const streamRef = useRef(null); // Use ref for the stream
    const mediaRecorderRef = useRef(null); // Use ref for the recorder

    // *** THE FIX IS HERE ***
    // Use a ref to store the chunks immediately, bypassing React's state lifecycle.
    const recordedChunksRef = useRef([]);

    const [isRecording, setIsRecording] = useState(false);
    const [textInput, setTextInput] = useState("");
    const [feedback, setFeedback] = useState("Click 'Start Recording' to begin.");

    // Function to start capturing media
    const startRecording = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true,
            });
            streamRef.current = mediaStream; // Store stream in ref

            // Show stream in video element
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }

            // Clear any old chunks
            recordedChunksRef.current = [];

            // Setup recorder
            const recorder = new MediaRecorder(mediaStream);
            mediaRecorderRef.current = recorder; // Store recorder in ref

            // *** THIS IS THE KEY CHANGE ***
            // Push chunks directly into the ref's array.
            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                    console.log("Data chunk added. Total chunks:", recordedChunksRef.current.length);
                }
            };

            // *** THIS IS THE SECOND KEY CHANGE ***
            // Move the 'onstop' logic here, so it's defined with the recorder.
            recorder.onstop = async () => {
                console.log("mediaRecorder.onstop event fired. Preparing blob.");

                // Create a single blob from the chunks in the ref.
                const videoBlob = new Blob(recordedChunksRef.current, { type: "video/webm" });

                console.log("Blob created. Size:", videoBlob.size, "bytes. Calling sendDataToBackend...");

                // Stop all media tracks
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach((track) => track.stop());
                }

                // Send the data to the backend
                if (videoBlob.size > 0) {
                    await sendDataToBackend(videoBlob);
                } else {
                    console.error("Blob size is 0. Not sending.");
                    setFeedback("Recording failed, please try again.");
                    return; // Stop here
                }

                // Reset state
                recordedChunksRef.current = [];
                streamRef.current = null;
                mediaRecorderRef.current = null;
                onClose(); // Close the modal
            };

            recorder.start();
            setIsRecording(true);
            setFeedback("Recording... Click 'Stop' when you're done.");
        } catch (err) {
            console.error("Error accessing media devices:", err);
            setFeedback("Could not access camera/microphone. Please check permissions.");
        }
    };

    // Function to stop recording
    const stopRecording = () => {
        console.log("stopRecording() called.");
        if (mediaRecorderRef.current) {
            // This will automatically trigger the 'onstop' event handler we defined above.
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setFeedback("Processing your check-in...");
        } else {
            console.error("stopRecording called, but mediaRecorderRef.current is null!");
        }
    };

    // Function to send data to your FastAPI backend
    const sendDataToBackend = async (videoBlob) => {
        console.log("sendDataToBackend() called. Creating FormData.");

        const formData = new FormData();
        formData.append("video_file", videoBlob, "checkin.webm");
        formData.append("text_input", textInput);

        if (!auth || !auth.token) {
            console.error("Auth token is MISSING! Auth object:", auth);
      setFeedback("Error: You are not logged in or token is missing.");
      return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8000/check-in/multimodal",
                formData,
                {
                    headers: {
//                      "Content-Type": "multipart/form-data",
                        "Authorization": `Bearer ${auth.token}`
                    },
                }
            );

            console.log("Backend response:", response.data);
            setFeedback("Check-in complete!");

        } catch (err) {
            console.error("Error uploading file:", err);
            if (err.response && err.response.status === 401) {
                setFeedback("Authentication failed. Please log in again.");
            } else {
                setFeedback("There was an error processing your check-in.");
            }
        }
    };

    return (
        // ... Your JSX for the modal remains exactly the same ...
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-2xl">
                <h2 className="text-2xl font-semibold mb-4">Multimodal Check-In</h2>
                <p className="text-slate-600 mb-4">{feedback}</p>

                <div className="bg-black rounded-md mb-4">
                    <video ref={videoRef} autoPlay muted className="w-full h-64 rounded-md" />
                </div>

                <textarea
                    className="w-full p-3 border rounded-md mb-4 text-slate-700"
                    rows="3"
                    placeholder="How are you feeling today? (Optional)"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    disabled={isRecording}
                />

                <div className="flex justify-between items-center">
                    <button
                        onClick={onClose}
                        className="text-slate-500 hover:text-slate-700"
                    >
                        Cancel
                    </button>
                    {!isRecording ? (
                        <button
                            onClick={startRecording}
                            className="bg-green-500 text-white px-5 py-2 rounded-lg font-semibold"
                        >
                            Start Recording
                        </button>
                    ) : (
                        <button
                            onClick={stopRecording}
                            className="bg-red-500 text-white px-5 py-2 rounded-lg font-semibold"
                        >
                            Stop & Submit
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}