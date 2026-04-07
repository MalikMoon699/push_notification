import React, { useEffect, useRef, useState } from "react";
import "../assets/style/CustomComponents.css";
import {
  CheckCheck,
  CirclePoundSterling,
  Copy,
  Eye,
  EyeClosed,
  Minus,
  Plus,
  X,
} from "lucide-react";
import { IMAGES } from "../utils/constants";
import Loader from "./Loader";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { handlePaymentHelper } from "../services/payment.services";

export const CustomCodeSection = ({
  Title = "",
  isCopy = true,
  codeBody = "",
  style = {},
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(codeBody);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <div style={style} className="custom-code-container">
      <div className="custom-code-header">
        <div className="custom-code-header-left">
          <div className="custom-code-header-indicators">
            <span />
            <span />
            <span />
          </div>
          <h2 className="custom-code-header-title">{Title}</h2>
        </div>

        <div className="custom-code-header-right">
          {isCopy && (
            <button
              onClick={handleCopyClick}
              className="custom-code-header-copy-btn"
            >
              <span className={`icon ${copied ? "active" : ""}`}>
                <Copy className="icon-copy" />
                <CheckCheck className="icon-check" />
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="custom-code-body">{codeBody}</div>
    </div>
  );
};

export const Input = ({
  label = "",
  value = "",
  readOnly = false,
  setValue = "",
  placeholder = "",
  type = "input",
  InputType = "text",
  margin = "6px 0px 8px 0px",
  style = {},
  Icon = "",
  onClick = () => {},
}) => {
  const [show, setShow] = useState(false);
  const isPassword = InputType === "password";

  return (
    <>
      {label && <label className="custom-input-label">{label}</label>}
      {type === "textArea" ? (
        <textarea
          className="custom-textarea"
          style={{ margin, ...style }}
          type={InputType}
          value={value}
          readOnly={readOnly}
          onClick={onClick}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
        />
      ) : type === "inputIcon" ? (
        <div className="custom-input-icon">
          {Icon && <Icon size={16} />}
          <input
            style={{ margin, ...style, paddingRight: isPassword ? "30px" : "" }}
            className="custom-input"
            type={isPassword ? (show ? "text" : "password") : InputType}
            value={value}
            readOnly={readOnly}
            onClick={onClick}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
          />
          {isPassword && (
            <button
              onClick={() => setShow(!show)}
              className="icon custom-password-toggel"
            >
              {show ? <Eye size={16} /> : <EyeClosed size={16} />}
            </button>
          )}
        </div>
      ) : (
        <input
          className="custom-input"
          style={{ margin, ...style }}
          type={InputType}
          value={value}
          onClick={onClick}
          readOnly={readOnly}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </>
  );
};

export const ProfileImage = ({
  Image = "",
  bg = "var(--primary-hover)",
  borderC = "var(--primary)",
  className = "",
  style = {},
}) => {
  const [loaded, setLoaded] = useState(false);
  const [imageModel, setImageModel] = useState(null);

  return (
    <>
      <div
        style={{ border: `2px solid ${borderC}`, ...style }}
        className={`profile-image-container ${className}`}
        onClick={() => Image && setImageModel(Image)}
      >
        <div
          className="profile-image-inner"
          style={{ background: Image ? "" : bg }}
        >
          {Image && !loaded && <div className="profile-image-loader" />}
          {Image && (
            <img
              src={Image}
              alt=""
              onLoad={() => setLoaded(true)}
              onError={() => setLoaded(true)}
              className={loaded ? "loaded" : ""}
            />
          )}
        </div>
      </div>

      {imageModel && (
        <ImageViewModel
          Image={imageModel}
          onClose={() => setImageModel(null)}
        />
      )}
    </>
  );
};

export const ImageViewModel = ({ Image = "", onClose }) => {
  const [loaded, setLoaded] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [transformOrigin, setTransformOrigin] = useState("center center");

  const handleDoubleClick = () => {
    setZoomed((prev) => !prev);
  };

  const handleMouseMove = (e) => {
    if (!zoomed) return;

    const { left, top, width, height } = e.target.getBoundingClientRect();

    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setTransformOrigin(`${x}% ${y}%`);
  };

  return (
    <div onClick={onClose} className="model-overlay">
      <div
        onClick={(e) => e.stopPropagation()}
        className="model-img-preview-content"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="image-model-close"
        >
          <X size={18} />
        </button>

        <div
          style={
            Image && !loaded
              ? {
                  height: "90vh",
                  width: "600px",
                  alignItems: "start",
                  justifyContent: "start",
                }
              : {}
          }
          className="profile-image-inner"
        >
          {Image && !loaded && <div className="profile-image-loader" />}
          {Image && (
            <img
              src={Image}
              alt=""
              onLoad={() => setLoaded(true)}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = IMAGES.NotFound;
                setLoaded(true);
              }}
              onDoubleClick={handleDoubleClick}
              onMouseMove={handleMouseMove}
              style={{
                cursor: zoomed ? "zoom-out" : "zoom-in",
                transformOrigin: transformOrigin,
              }}
              className={`${loaded ? "loaded" : ""} ${zoomed ? "zoomed" : ""}`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const PrincingCard = () => {
  const [customcredits, setCustomcredits] = useState(500);
  const [customPrice, setCustomPrice] = useState(0);
  const [payLoading, setPayLoading] = useState(false);

  const handlePayNow = async () => {
    try {
      setPayLoading(true);
      await handlePaymentHelper({
        credits: customcredits,
        price: customPrice,
      });
    } catch (err) {
      console.error("Payment Failed:", err);
      toast.error("Payment failed.");
    } finally {
      setPayLoading(false);
    }
  };

  useEffect(() => {
    const price = getCustomcreditsPrice(customcredits);
    setCustomPrice(price);
  }, [customcredits]);

  const getCustomcreditsPrice = (credits = 1) => {
    const inOneDollar = 0.6;
    const price = credits * inOneDollar;
    return price.toFixed(2);
  };

  const handleChangeCreadit = (type = "inc") => {
    setCustomcredits((prev) => {
      if (type === "inc") return prev + 1;
      if (type === "dec") return prev > 1 ? prev - 1 : 1;
      return prev;
    });
  };

  return (
    <div className="custom-pricing-card">
      <div style={{ width: "100%" }}>
        <div className="custom-pricing-header">Custom</div>

        <div className="custom-pricing-price">€ {customPrice}</div>

        <div className="custom-pricing-divider" />

        <div className="custom-pricing-credits">
          <span className="custom-credits-number">{customcredits}</span>
          <span className="custom-credits-text">credits</span>
        </div>
        <div className="custom-pricing-custom-credits">
          <button
            disabled={customcredits < 2}
            onClick={() => handleChangeCreadit("dec")}
          >
            <Minus />
          </button>
          <input
            type="number"
            value={customcredits}
            className="custom-input"
            min={1}
            onChange={(e) => {
              let value = parseInt(e.target.value, 10);
              if (e.target.value === "") {
                return;
              }
              if (value < 1 || isNaN(value)) value = 1;
              setCustomcredits(value);
            }}
          />
          <button onClick={() => handleChangeCreadit("inc")}>
            <Plus />
          </button>
        </div>
      </div>
      <button
        disabled={payLoading}
        className="custom-pricing-btn"
        onClick={handlePayNow}
      >
        {payLoading ? "Paying..." : "Pay now"}
      </button>
    </div>
  );
};

export const TopBar = ({ title = "", updateCredits = null }) => {
  const { currentUser } = useAuth();
  const [isCreadit, setIsCreadit] = useState(false);
  const [isAddMore, setIsAddMore] = useState(false);

  const creadit =
    updateCredits !== null ? updateCredits : currentUser?.credits || 0;

  const colorSuggestion = () => {
    if (creadit < 10) {
      return "red";
    } else if (creadit < 50) {
      return "orange";
    } else {
      return "green";
    }
  };

  return (
    <>
      <div className="custom-topbar-container">
        <div className="custom-topbar-inner-container">
          <h2 className="custom-topbar-title">{title}</h2>
          <h4
            onClick={() => setIsCreadit(true)}
            className="custom-topbar-credit"
            style={{ color: colorSuggestion() }}
          >
            <span className="icon">
              <CirclePoundSterling fill="#f8a314" color="#f7d028" />
            </span>
            {creadit} credits
          </h4>
        </div>
      </div>
      {isCreadit && (
        <div className="model-overlay">
          <div className="model-content">
            <div className="model-header">
              <h2 className="model-header-title">
                {isAddMore ? "Add" : "Your"} Credits
              </h2>
              <button
                className="model-header-close-btn"
                onClick={() => {
                  setIsAddMore(false);
                  setIsCreadit(false);
                }}
              >
                ×
              </button>
            </div>
            <div className="model-content-container">
              {isAddMore ? (
                <PrincingCard />
              ) : (
                <>
                  <h2 style={{ width: "100%", textAlign: "center" }}>
                    Credit Information
                  </h2>
                  <p style={{ width: "100%", textAlign: "center" }}>
                    You have{" "}
                    <span style={{ color: colorSuggestion() }}>
                      {creadit || 0}
                    </span>{" "}
                    credits available now for use.
                  </p>
                  <button
                    onClick={() => setIsAddMore(true)}
                    className="api-generate-btn"
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      gap: "12px",
                      padding: "11px 14px",
                      marginTop: "20px",
                    }}
                  >
                    Add More Credits
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const LoadMore = ({
  loading = false,
  disabled = false,
  show = false,
  onLoad,
  style = {},
}) => {
  return (
    show && (
      <div style={style} className="custom-loadMore-container">
        {loading ? (
          <Loader stroke="3" size="30" />
        ) : (
          <button
            disabled={disabled}
            onClick={onLoad}
            className="custom-load-more-btn"
          >
            Load More
          </button>
        )}
      </div>
    )
  );
};