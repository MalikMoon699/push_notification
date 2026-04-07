import { useState } from "react";
import { CheckCheck, Copy, Eye, EyeClosed } from "lucide-react";
import "../assets/style/CustomComponents.css";

export const CustomCodeSection = ({
  Title = "",
  isCopy = true,
  codeBody = "",
  style={}
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