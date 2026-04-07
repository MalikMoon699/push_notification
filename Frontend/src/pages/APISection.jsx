import React, { useEffect, useRef, useState } from "react";
import "../assets/style/APISection.css";
import { Key, Eye, Copy, Trash2, EyeOff } from "lucide-react";
import { Input, TopBar } from "../components/CustomComponents";
import { toast } from "sonner";
import {
  deleteApiKeys,
  genApiKey,
  getApiKeys,
  getApiUsageByDate,
  getApiUsageByMonth,
} from "../services/key.services";
import Loader from "../components/Loader";
import { formateDate, handleCopy, timeAgo } from "../utils/helper";

const APISection = () => {
  const [isGen, setIsGen] = useState(false);
  const [todayUsage, setTodayUsage] = useState(0);
  const [monthUsage, setMonthUsage] = useState(0);
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const codeRef = useRef();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    const today = new Date().toISOString().split("T")[0];
    const month = new Date().toISOString().slice(0, 7);

    try {
      setLoading(true);

      const [keysRes, todayRes, monthRes] = await Promise.all([
        getApiKeys(),
        getApiUsageByDate(today),
        getApiUsageByMonth(month),
      ]);

      setApiKeys(keysRes?.keys || []);
      setTodayUsage(todayRes?.totalCalls || 0);
      setMonthUsage(monthRes?.totalCalls || 0);
    } catch (err) {
      console.error("Failed to load API data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TopBar title="API Section" />
      <div className="api-container">
        <div className="api-stats">
          <StateTabs
            title="API Calls Today"
            value={todayUsage || 0}
            maxValue={1000}
            isProgress={true}
          />
          <StateTabs
            title="Monthly Usage"
            value={monthUsage}
            maxValue={30000}
            isProgress={true}
          />
          <StateTabs title="Rate Limit" value="100 req" maxValue="min" />
        </div>

        <div className="api-keys-section">
          <div className="api-keys-header">
            <h3>API Keys</h3>
            <button onClick={() => setIsGen(true)} className="api-generate-btn">
              <Key size={16} />
              Generate New Key
            </button>
          </div>
          {loading ? (
            <Loader style={{ height: "200px" }} />
          ) : apiKeys?.length > 0 ? (
            apiKeys.map((key, index) => (
              <ApiKeyCard
                key={index}
                keyId={key?._id}
                title={key?.name}
                created={key?.createdAt}
                lastUsed={key?.lastUsed}
                calls={key?.keyCalles}
                apiKey={key?.key}
                setApiKeys={setApiKeys}
              />
            ))
          ) : (
            <p className="empty-data">No Keys found.</p>
          )}
        </div>

        <div className="api-quickstart">
          <div className="api-quickstart-header">
            <h3>Quick Start</h3>
            <button
              onClick={() => handleCopy(codeRef.current.innerText)}
              className="api-copy-code"
            >
              <span className="icon">
                <Copy size={15} />
              </span>
              Copy
            </button>
          </div>

          <pre className="api-code" ref={codeRef}>
            {`
import axios from "axios";


export const uploadByApi = async (files) => {
  if (!files || files.length === 0) throw new Error("No files selected");
  else if (files.length > 5)
    throw new Error("maximum 5 files upload at a time.");
  const formData = new FormData();
  files.forEach((item) => {
    formData.append("files", item.file);
  });

  try {
    const res = await axios.post(
      "http://localhost:3000/api/v1/key/upload-media",
      formData,
      {
        headers: {
          apikey: "md_sk_a••••••••••••••••", // pass your apikey
        },
      },
    );

    return res.data; // { message, files, creditsUsed, remainingCredits }
  } catch (err) {
    console.error("Upload API error:", err.response?.data || err.message);
    throw err.response?.data || err;
  }
};
`}
          </pre>
        </div>
        {isGen && (
          <GenerateApiKey
            onClose={() => setIsGen(false)}
            setApiKeys={setApiKeys}
          />
        )}
      </div>
    </>
  );
};

export default APISection;

const StateTabs = ({
  isProgress = false,
  title = "",
  value = 0,
  maxValue = 0,
}) => {
  return (
    <div className="api-stat-card">
      <p className="api-stat-title">{title}</p>
      <h2>
        {value} {maxValue ? `/ ${maxValue}` : ""}
      </h2>
      {isProgress && (
        <div className="api-progress">
          <div style={{ width: `${(value / maxValue) * 100}%` }}></div>
        </div>
      )}
    </div>
  );
};

const ApiKeyCard = ({
  title,
  created,
  lastUsed,
  calls,
  apiKey,
  keyId,
  setApiKeys,
}) => {
  const [isShow, setIsShow] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    alert("API Key copied to clipboard!");
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this API key?")) {
      try {
        await deleteApiKeys(keyId);
        setApiKeys((prev) => prev.filter((key) => key._id !== keyId));
        toast.success("Key deleted successfully.");
      } catch (err) {
        console.error("Failed to delete Key:", err);
        toast.error(err?.message || "Failed to delete key");
      }
    }
  };

  const maskedKey = apiKey
    ? `${apiKey.slice(0, 7)}${"•".repeat(apiKey.length - 8)}`
    : "N/A";

  return (
    <div className="api-key-card">
      <div className="api-key-top">
        <div>
          <h4>{title || "N/A"}</h4>
          <p>
            Created {formateDate(created) || "N/A"}{" "}
            {lastUsed &&
              `• Last used
            ${timeAgo(lastUsed) || "N/A"}`}
          </p>
        </div>
        <span className="api-key-badge">{calls || 0} calls</span>
      </div>

      <div className="api-key-bottom">
        <p>{isShow ? apiKey : maskedKey}</p>
        <div className="api-key-actions">
          <span onClick={() => setIsShow(!isShow)} className="icon">
            {isShow ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
          <span onClick={handleCopy} className="icon">
            <Copy size={18} />
          </span>
          <span onClick={handleDelete} className="icon danger">
            <Trash2 size={18} />
          </span>
        </div>
      </div>
    </div>
  );
};

const GenerateApiKey = ({ onClose, setApiKeys }) => {
  const [keyName, setKeyName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenKey = async () => {
    if (keyName.trim() === "") return toast.error("Key Name is required!");
    try {
      setLoading(true);
      const res = await genApiKey(keyName);
      setApiKeys((prev) => [res?.apiKey,...prev]);
      toast.success("Api key gen successfuly.");
    } catch (err) {
      console.error("Failed to gen api key:", err);
      toast.error(err.message || "Failed to gen api Key");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div className="model-overlay">
      <div className="model-content">
        <div className="model-header">
          <h2 className="model-header-title">Generate New API Key</h2>
          <button className="model-header-close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="model-content-container">
          <Input
            label="API Key Name"
            placeholder="Key Name"
            value={keyName}
            setValue={setKeyName}
          />
          <button
            className="api-generate-btn"
            onClick={handleGenKey}
            disabled={loading}
            style={{
              width: "100%",
              justifyContent: "center",
              gap: "12px",
              padding: "11px 14px",
            }}
          >
            <span className="icon">
              <Key size={16} />
            </span>
            {loading ? "Generating..." : "Generate Key"}
          </button>
        </div>
      </div>
    </div>
  );
};
