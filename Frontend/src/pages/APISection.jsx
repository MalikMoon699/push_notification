import React, { useEffect, useState } from "react";
import "../assets/style/APISection.css";
import { Key, Eye, Copy, Trash2, EyeOff, FlaskConical } from "lucide-react";
import {
  CustomCodeSection,
  Input,
  TopBar,
} from "../components/CustomComponents";
import { toast } from "sonner";
import {
  deleteApiKeys,
  genApiKey,
  getApiKeys,
  getApiUsageStates,
} from "../services/key.services";
import Loader from "../components/Loader";
import { formateDate, timeAgo } from "../utils/helper";
import { ChartCard } from "../components/ChartsComponents";
import { apiKeyWeekFallBack } from "../services/chartFallback.services";
import { getApiRequestCount } from "../services/dashAnalytics.services";
import { useNavigate } from "react-router";

const APISection = () => {
  const navigate=useNavigate();
  const [isGen, setIsGen] = useState(false);
  const [usageStates, setUsageStates] = useState(null);
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyUsage, setKeyUsage] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    const today = new Date().toISOString().split("T")[0];
    const month = new Date().toISOString().slice(0, 7);

    try {
      setLoading(true);

      const [chartRes, keysRes, statesRes] = await Promise.all([
        getApiRequestCount(),
        getApiKeys(),
        getApiUsageStates({ date: today, month }),
      ]);
      setKeyUsage(chartRes?.data);
      setApiKeys(keysRes?.keys || []);
      setUsageStates(statesRes || 0);
    } catch (err) {
      console.error("Failed to load API data:", err);
    } finally {
      setLoading(false);
    }
  };


  const weeklyChartData = keyUsage?.length > 0 ? keyUsage : apiKeyWeekFallBack;

  return (
    <>
      <TopBar title="API Section" />
      <div className="api-container">
        <div className="api-stats">
          <StateTabs
            title="API Calls Today"
            value={usageStates?.today || 0}
            maxValue={usageStates?.thisMonth}
            subValue="this month"
            isProgress={true}
          />
          <StateTabs
            title="Monthly Usage"
            value={usageStates?.thisMonth}
            maxValue={usageStates?.total}
            subValue="total"
            isProgress={true}
          />
          <StateTabs title="Rate Limit" value="100 req" maxValue="min" />
        </div>

        <ChartCard
          title="Api usage weekly"
          chartType="bar"
          ChartData={weeklyChartData}
          loading={loading}
        />

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
            <button onClick={() => navigate("/landing-demo")} className="api-generate-btn">
              <FlaskConical size={15} />
              Live test
            </button>
          </div>
          <CustomCodeSection
            Title="Usage"
            codeBody={`import { getToken, sendNotification } from "dev-push-notification";

const API_KEY = "YOUR_API_KEY_HERE";

// get token
const token = await getToken(API_KEY);
console.log("Device Token:", token);

// send notification
await sendNotification({
  apiKey: API_KEY,
  title: "Hello",
  body: "This is a test push notification",
  icon: "https://example.com/icon.png",
  fcmTokens: [token],
});

// Response
{
  "success": true,
  "successCount": 2,
  "failureCount": 1,
  "results": [
    "message-id-1",
    "message-id-2",
    { "error": "Invalid registration token" }
  ]
}
`}
            style={{ marginTop: "10px" }}
          />
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
  subValue = "",
}) => {
  return (
    <div className="api-stat-card">
      <p className="api-stat-title">{title}</p>
      <h2>
        {value} {maxValue ? `/ ${maxValue}` : ""}{" "}
        <span
          style={{
            fontSize: "16px",
            fontWeight: "500",
            color: "var(--muted-foreground)",
          }}
        >
          {subValue}
        </span>
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
    toast.success("API Key copied to clipboard!");
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
      setApiKeys((prev) => [res?.apiKey, ...prev]);
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
