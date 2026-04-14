import React, { useEffect, useState } from "react";
import { Header, Input, StatesCard } from "../../components/CustomComponents";
import { Activity, Clock9, Key } from "lucide-react";
import { getApiMonitoring, getApiRecords } from "../../services/admin.services";
import { ChartCard } from "../../components/ChartsComponents";
import { topUsersFallBack } from "../../services/adminChartFallback.services";
import CustomTable from "../../components/CustomTable";
import { useDebounce } from "../../utils/hooks/useDebounce";
import { limit } from "../../utils/constants";
import { timeAgo } from "../../utils/helper";

const APIKeys = () => {
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState(null);
  const [topUsers, setTopUsers] = useState([]);
  const topLimit = 5;

  const [tableLoading, setTableLoading] = useState(true);
  const [keys, setKeys] = useState([]);
  const [search, setSearch] = useState("");
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
  }, [debounceSearch]);

  const getInitData = async () => {
    try {
      const res = await getApiMonitoring(topLimit);
      setStates(res?.states);
      setTopUsers(res?.requestsByOwner);
    } catch (err) {
      console.error("Failed to load apiKey data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getTableData = async (nextPage = 1) => {
    try {
      setTableLoading(true);
      const res = await getApiRecords({
        page: nextPage,
        limit,
        search: debounceSearch,
      });
      setKeys(res?.keys);
      setTotalPages(res?.meta?.totalPages || 1);
      setPage(res?.meta?.page || 1);
      setTotal(res?.meta?.total || 0);
    } catch (err) {
      console.error("Failed to load Keys table data:", err);
    } finally {
      setTableLoading(false);
    }
  };

  const topUsersChart = topUsers?.length > 0 ? topUsers : topUsersFallBack;

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
      name: "Api Key",
      width: "33%",
      row: (row) => row.apiKey,
    },
    {
      name: "keyCalles",
      row: (row) => row.keyCalles || 0,
    },
    {
      name: "last Used",
      row: (row) => timeAgo(row.lastUsed),
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
        title="API Key Monitoring"
        desc="Monitor and manage all API keys across the platform"
      />
      <div
        style={{ margin: "30px 0px" }}
        className="custom-dashboard-stats-container"
      >
        <StatesCard
          icon={Key}
          iColor="var(--primary)"
          title="Total Keys"
          value={states?.totalKeys || 0}
          loading={loading}
        />
        <StatesCard
          icon={Clock9}
          iColor="var(--status-approved)"
          title="Last week created"
          value={states?.lastWeek || 0}
          loading={loading}
        />
        <StatesCard
          icon={Activity}
          iColor="var(--card-foreground)"
          title="Total Requests"
          value={states?.totalRequests || 0}
          loading={loading}
        />
      </div>
      <ChartCard
        title="Revenue monthly"
        chartType="v-bar"
        ChartData={topUsersChart}
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
            Keys issued
          </h3>
          <span className="custom-table-pagination-content">
            Total: {total || 0} records
          </span>
        </div>
        <div className="custom-table-filters">
          <Input
            disabled={loading}
            placeholder="Search key..."
            value={search}
            setValue={setSearch}
          />
        </div>
        <CustomTable
          columns={columns}
          data={keys}
          loading={tableLoading}
          lastPage={totalPages}
          page={page}
          handlePageChange={(next) => setPage(next)}
        />
      </div>{" "}
      {isDetails && (
        <DetailModel isDetails={isDetails} onClose={() => setIsDetails(null)} />
      )}
    </div>
  );
};

export default APIKeys;

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
            <strong>User:-</strong>
            <p style={{ paddingTop: "5px" }}>
              <strong>Name: </strong>
              {isDetails?.name || "N/A"}
            </p>
            <p style={{ paddingTop: "5px" }}>
              <strong>Email: </strong>
              {isDetails?.email || "N/A"}
            </p>
          </div>
          <div className="credit-model-log-box">
            <strong>Key:- </strong>
            <p>
              <strong>Name: </strong>
              {isDetails?.keyName || "N/A"}
            </p>
            <p style={{ paddingTop: "5px" }}>
              <strong>Api: </strong>
              {isDetails?.apiKey || "N/A"}
            </p>
            <p style={{ paddingTop: "5px" }}>
              <strong>lastUsed: </strong>
              {timeAgo(isDetails?.lastUsed) || "N/A"}
            </p>
          </div>
          <div className="credit-model-log-box">
            <p>
              <strong>CreatedAt: </strong>
              {timeAgo(isDetails?.apiCreatedAt) || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
