import React, { useState, useEffect, useRef } from "react";
import ToolExecutor from "../../components/ToolExecutor";
import { ToastContainer, toast } from "react-toastify";

export default function CameraRecorder() {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [permissionCannotBePrompted, setPermissionCannotBePrompted] = useState(false);
  const [isRecordingSupported, setIsRecordingSupported] = useState(false);
  const [recordingState, setRecordingState] = useState("stopped");
  const [medias, setMedias] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [microphones, setMicrophones] = useState([]);
  const [currentCamera, setCurrentCamera] = useState("");
  const [currentMicrophone, setCurrentMicrophone] = useState("");
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Media URL copied to clipboard!");
    });
  };

  // Check browser support and permissions
  useEffect(() => {
    setIsRecordingSupported(MediaRecorder.isTypeSupported("video/webm"));

    const checkPermissions = async () => {
      try {
        const permissionStatus = await navigator.permissions.query({ name: "camera" });
        setPermissionGranted(permissionStatus.state === "granted");
        permissionStatus.onchange = () => {
          setPermissionGranted(permissionStatus.state === "granted");
        };
      } catch (e) {
        setPermissionCannotBePrompted(true);
      }
    };

    checkPermissions();
  }, []);

  // Get available devices
  useEffect(() => {
    const updateDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter((device) => device.kind === "videoinput");
        const audioInputs = devices.filter((device) => device.kind === "audioinput");
        setCameras(videoInputs);
        setMicrophones(audioInputs);
        if (videoInputs.length > 0 && !currentCamera) {
          setCurrentCamera(videoInputs[0].deviceId);
        }
        if (audioInputs.length > 0 && !currentMicrophone) {
          setCurrentMicrophone(audioInputs[0].deviceId);
        }
      } catch (e) {
        console.error("Error enumerating devices:", e);
      }
    };

    updateDevices();
  }, [currentCamera, currentMicrophone]);

  // Request permissions and start stream
  const requestPermissions = async () => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: currentCamera || undefined },
        audio: currentMicrophone ? { deviceId: currentMicrophone } : false,
      });
      setStream(newStream);
      setPermissionGranted(true);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (e) {
      setPermissionCannotBePrompted(true);
      console.error("Error requesting permissions:", e);
    }
  };

  // Stop stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  // MediaRecorder setup
  const startRecording = () => {
    if (!isRecordingSupported || !stream || recordingState !== "stopped") return;
    recordedChunksRef.current = [];
    mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: "video/webm" });

    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) {
        recordedChunksRef.current.push(e.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setMedias((prev) => [
        { type: "video", value: url, createdAt: new Date() },
        ...prev,
      ]);
      recordedChunksRef.current = [];
      setRecordingState("stopped");
    };

    mediaRecorderRef.current.start();
    setRecordingState("recording");
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current || recordingState === "stopped") return;
    mediaRecorderRef.current.stop();
  };

  const pauseRecording = () => {
    if (!mediaRecorderRef.current || recordingState !== "recording") return;
    mediaRecorderRef.current.pause();
    setRecordingState("paused");
  };

  const resumeRecording = () => {
    if (!mediaRecorderRef.current || recordingState !== "paused") return;
    mediaRecorderRef.current.resume();
    setRecordingState("recording");
  };

  const takeScreenshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
    const image = canvas.toDataURL("image/png");
    setMedias((prev) => [
      { type: "image", value: image, createdAt: new Date() },
      ...prev,
    ]);
  };

  const downloadMedia = ({ value, type, createdAt }) => {
    const link = document.createElement("a");
    link.href = value;
    link.download = `${type}-${createdAt.getTime()}.${type === "image" ? "png" : "webm"}`;
    link.click();
  };

  const deleteMedia = (index) => {
    setMedias((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <ToolExecutor
      toolPath="camera-recorder"
      schemaInput={[]}
      customRenderer={() => (
        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
          {!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia ? (
            <div className="bg-gray-100 px-3 py-2 rounded text-gray-600 italic opacity-60">
              Your browser does not support recording video from camera
            </div>
          ) : !permissionGranted ? (
            <div className="bg-gray-100 px-3 py-2 rounded text-gray-600 text-center">
              <p>You need to grant permission to use your camera and microphone</p>
              {permissionCannotBePrompted ? (
                <p className="mt-4 text-left">
                  Your browser has blocked permission request or does not support it. Please grant
                  permission manually in your browser settings (usually the lock icon in the address
                  bar).
                </p>
              ) : (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={requestPermissions}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white"
                  >
                    Grant Permission
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <label className="block text-sm font-medium text-gray-700 w-16">Video:</label>
                  <select
                    className="flex-1 border p-2 focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
                    value={currentCamera}
                    onChange={(e) => setCurrentCamera(e.target.value)}
                  >
                    {cameras.map(({ deviceId, label }) => (
                      <option key={deviceId} value={deviceId}>
                        {label || `Camera ${deviceId}`}
                      </option>
                    ))}
                  </select>
                </div>
                {microphones.length > 0 && (
                  <div className="flex items-center gap-4">
                    <label className="block text-sm font-medium text-gray-700 w-16">Audio:</label>
                    <select
                      className="flex-1 border p-2 focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
                      value={currentMicrophone}
                      onChange={(e) => setCurrentMicrophone(e.target.value)}
                    >
                      {microphones.map(({ deviceId, label }) => (
                        <option key={deviceId} value={deviceId}>
                          {label || `Microphone ${deviceId}`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {stream ? (
                <div className="space-y-4">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full max-h-full rounded"
                  />
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={takeScreenshot}
                      disabled={!stream}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white disabled:bg-gray-300"
                    >
                      Take Screenshot
                    </button>
                    {isRecordingSupported ? (
                      <div className="flex gap-2">
                        {recordingState === "stopped" && (
                          <button
                            onClick={startRecording}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded text-white"
                          >
                            Start Recording
                          </button>
                        )}
                        {recordingState === "recording" && (
                          <button
                            onClick={pauseRecording}
                            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded text-white"
                          >
                            Pause
                          </button>
                        )}
                        {recordingState === "paused" && (
                          <button
                            onClick={resumeRecording}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white"
                          >
                            Resume
                          </button>
                        )}
                        {recordingState !== "stopped" && (
                          <button
                            onClick={stopRecording}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded text-white"
                          >
                            Stop
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-600 italic opacity-60">
                        Video recording is not supported in your browser
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex justify-center">
                  <button
                    onClick={requestPermissions}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white"
                  >
                    Start Webcam
                  </button>
                </div>
              )}

              {medias.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-5">
                  {medias.map(({ type, value, createdAt }, index) => (
                    <div key={index} className="bg-gray-100 p-3 rounded">
                      {type === "image" ? (
                        <img src={value} alt="Screenshot" className="w-full max-h-full rounded" />
                      ) : (
                        <video src={value} controls className="w-full max-h-full rounded" />
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <div className="font-bold">{type === "image" ? "Screenshot" : "Video"}</div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCopy(value)}
                            className="text-sm text-blue-600 hover:underline"
                          >
                            <svg viewBox="0 0 24 24" width="1.2em" height="1.2em">
                              <path
                                fill="currentColor"
                                d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12V1Z"
                              ></path>
                            </svg>
                          </button>
                          <button
                            onClick={() => downloadMedia({ type, value, createdAt })}
                            className="text-sm text-blue-600 hover:underline"
                          >
                            <svg viewBox="0 0 24 24" width="1.2em" height="1.2em">
                              <path
                                fill="currentColor"
                                d="M5 20h14v-2H5m14-9h-4V3H9v6H5l7 7 7-7Z"
                              ></path>
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteMedia(index)}
                            className="text-sm text-red-600 hover:underline"
                          >
                            <svg viewBox="0 0 24 24" width="1.2em" height="1.2em">
                              <path
                                fill="currentColor"
                                d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12Z"
                              ></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          <ToastContainer position="bottom-center" autoClose={1000} />
        </div>
      )}
    />
  );
}