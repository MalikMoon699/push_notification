import React, { useEffect, useState } from "react";
import {
  Header,
  Input,
  Selector,
  StatesCard,
} from "../../components/CustomComponents";
import { apiUsageFallBack } from "../../services/adminChartFallback.services";
import { getLogRecords, getLogsAnalytics } from "../../services/admin.services";
import { ChartCard } from "../../components/ChartsComponents";
import { Gift, TrendingDown, TrendingUp } from "lucide-react";
import CustomTable from "../../components/CustomTable";
import { useDebounce } from "../../utils/hooks/useDebounce";
import { limit } from "../../utils/constants";
import { timeAgo } from "../../utils/helper";

const CreditLogs = () => {
  const [loading, setLoading] = useState(true);
  const [states, setStates] = useState(null);
  const [apiUsage, setApiUsage] = useState([]);

  const [tableLoading, setTableLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const debounceSearch = useDebounce(search, 500);

  const [isDetails, setIsDetails] = useState(null);

  useEffect(() => {
    getInitData();
  }, []);

  useEffect(() => {
    getTableData(page);
  }, [page]);

  useEffect(() => {
    getTableData(1);
  }, [debounceSearch, status]);

  const getInitData = async () => {
    try {
      const res = await getLogsAnalytics();
      setStates(res?.states);
      setApiUsage(res?.apiUsage);
    } catch (err) {
      console.error("Failed to load creditLogs analytics data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getTableData = async (nextPage = 1) => {
    try {
      setTableLoading(true);
      const res = await getLogRecords({
        page: nextPage,
        limit,
        search: debounceSearch,
        success: status !== "all" ? status : "",
      });
      setLogs(res?.logs);
      setTotalPages(res?.meta?.totalPages || 1);
      setPage(res?.meta?.page || 1);
      setTotal(res?.meta?.total || 0);
    } catch (err) {
      console.error("Failed to load creditLogs table data:", err);
    } finally {
      setTableLoading(false);
    }
  };

  const apiUsageChart = apiUsage?.length > 0 ? apiUsage : apiUsageFallBack;

  const columns = [
    {
      name: "User",
      row: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>{row.email}</div>
        </div>
      ),
    },
    {
      name: "Status",
      row: (row) => (
        <span
          style={{
            padding: "4px 10px",
            borderRadius: 6,
            textTransform: "capitalize",
            fontSize: 12,
            width: "fit-content",
            minWidth: "65px",
            display: "flex",
            height: "25px",
            alignItems: "center",
            justifyContent: "center",
            background: row.success ? "#d1fae5" : "#fee2e2",
            color: row.success
              ? "var(--status-approved)"
              : "var(--status-rejected)",
          }}
        >
          {row.success ? "Success" : "Failed"}
        </span>
      ),
    },
    {
      name: "Api Key",
      width: "33%",
      row: (row) => row.apiKey,
    },
    {
      name: "Joined",
      row: (row) => new Date(row.date).toLocaleDateString(),
    },
    {
      name: "Actions",
      row: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsDetails(row);
          }}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            background: row.status === "approved" ? "#ef4444" : "#22c55e",
            color: "#fff",
            width: "fit-content",
            height: "28px",
          }}
        >
          View Details
        </button>
      ),
    },
  ];

  return (
    <div className="admin-page-container">
      <Header
        title="Credit Logs"
        desc="Complete audit trail of all credit transactions"
      />
      <div
        style={{ margin: "30px 0px" }}
        className="custom-dashboard-stats-container"
      >
        <StatesCard
          icon={TrendingUp}
          iColor="var(--status-approved)"
          title="Credits Purchased (last Week)"
          value={states?.creditsPurchased || 0}
          loading={loading}
        />
        <StatesCard
          icon={TrendingDown}
          iColor="var(--status-rejected)"
          title="Credits Spent (last Week)"
          value={states?.creditsSpent || 0}
          loading={loading}
        />
        <StatesCard
          icon={Gift}
          iColor="var(--status-pending)"
          title="Credits Rewarded (last Week)"
          value={states?.creditsRewarded || 0}
          loading={loading}
        />
      </div>
      <ChartCard
        title="Api Usage (last Week)"
        chartType="bar"
        ChartData={apiUsageChart}
        loading={loading}
      />
      <div className="custom-table-card">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            marginBottom: "16px",
          }}
        >
          <h3 style={{ marginBottom: "0px" }} className="custom-section-title">
            Usage Records
          </h3>
          <span className="custom-table-pagination-content">
            Total: {total || 0} records
          </span>
        </div>
        <div className="custom-table-filters">
          <Input
            disabled={loading}
            placeholder="Search logs..."
            value={search}
            setValue={setSearch}
          />
          <Selector
            width="200px"
            disabled={loading}
            filter={status}
            setFilter={setStatus}
            options={[
              { filter: "all", label: "All" },
              { filter: "true", label: "Success" },
              { filter: "false", label: "Failed" },
            ]}
          />
        </div>
        <CustomTable
          columns={columns}
          data={logs}
          loading={tableLoading}
          lastPage={totalPages}
          page={page}
          handlePageChange={(next) => setPage(next)}
        />
      </div>
      {isDetails && (
        <DetailModel isDetails={isDetails} onClose={() => setIsDetails(null)} />
      )}
    </div>
  );
};

export default CreditLogs;

const DetailModel = ({ onClose, isDetails }) => {
  return (
    <div onClick={onClose} className="model-overlay">
      <div onClick={(e) => e.stopPropagation()} className="model-content">
        <div className="model-header">
          <h3 className="model-header-title">Usage Details</h3>
          <button className="model-header-close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="model-content-container">
          <div style={{ marginTop: "0px" }} className="credit-model-log-box">
            <p>
              <strong>ApiKey: </strong>
              {isDetails?.apiKey || "N/A"}
            </p>
            <p style={{ paddingTop: "5px" }}>
              <strong>UserName: </strong>
              {isDetails?.name || "N/A"}
            </p>
            <p style={{ paddingTop: "5px" }}>
              <strong>UserEmail: </strong>
              {isDetails?.email || "N/A"}
            </p>
          </div>
          <div className="credit-model-log-box">
            <p>
              <strong>Title: </strong>
              {isDetails?.title || "N/A"}
            </p>
            <p style={{ paddingTop: "5px" }}>
              <strong>UseCase: </strong>
              {isDetails?.useCase || "N/A"}
            </p>
            <p
              style={{
                paddingTop: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
              }}
            >
              <strong>Status: </strong>
              <span
                style={{
                  padding: "4px 10px",
                  marginLeft:"3px",
                  borderRadius: 6,
                  textTransform: "capitalize",
                  fontSize: 10,
                  background: isDetails?.success ? "#d1fae5" : "#fee2e2",
                  color: isDetails?.success
                    ? "var(--status-approved)"
                    : "var(--status-rejected)",
                }}
              >
                {isDetails?.success ? "Success" : "Failed"}
              </span>{" "}
            </p>
          </div>
          <div className="credit-model-log-box">
            <p>
              <strong>Time: </strong>
              {timeAgo(isDetails?.date) || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
