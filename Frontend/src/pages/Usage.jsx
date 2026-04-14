import React, { useEffect, useState } from "react";
import "../assets/style/Usage.css";
import { CircleCheckBig, CircleX, Activity } from "lucide-react";
import Loader from "../components/Loader";
import {
  LoadMore,
  SearchInput,
  Selector,
  TopBar,
} from "../components/CustomComponents";
import { formateDateTime } from "../utils/helper";
import { useDebounce } from "../utils/hooks/useDebounce";
import {
  getUsageStatesHelper,
  getUsageRecordsHelper,
} from "../services/usage.services";
import { limit } from "../utils/constants";

const Usage = () => {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const debounceSearch = useDebounce(search);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [statesData, setStatesData] = useState(null);
  const [usageDetails, setUsageDetails] = useState([]);

  useEffect(() => {
    getUsageStates();
  }, []);

  useEffect(() => {
    setPage(1);
    getUsageRecords(1);
  }, [status, debounceSearch]);

  const getUsageStates = async () => {
    try {
      const res = await getUsageStatesHelper();
      setStatesData(res);
    } catch (err) {
      console.error("Failed to load UsageStates:", err);
    }
  };

  const getUsageRecords = async (nextPage = 1) => {
    try {
      if (nextPage !== 1) {
        setLoadingMore(true);
      }
      const res = await getUsageRecordsHelper(
        nextPage,
        limit,
        debounceSearch,
        status,
      );
      const newLoaded = res?.records || [];
      setUsageDetails((prev) =>
        nextPage === 1 ? newLoaded : [...prev, ...newLoaded],
      );

      setPage(res?.meta?.page || 1);
      setLastPage(res?.meta?.totalPages || 1);
    } catch (err) {
      console.error("Failed to load UsageRecords:", err);
    } finally {
      setLoadingMore(false);
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (page < lastPage && !loadingMore) {
      getUsageRecords(page + 1);
    }
  };

  return (
    <>
      <TopBar title="Usage Logs" />
      <div className="page-container">
        <div className="usage-stats">
          <StateCard
            label="Successful"
            value={statesData?.success || 0}
            loading={loading}
            type="success"
            icon={CircleCheckBig}
          />
          <StateCard
            label="Failed"
            value={statesData?.fail || 0}
            loading={loading}
            type="error"
            icon={CircleX}
          />
          <StateCard
            label="Credits Used"
            value={statesData?.creditsUsed || 0}
            loading={loading}
            type="credit"
            icon={Activity}
          />
        </div>
        <div className="api-quickstart">
          <div className="usage-toolbar">
            <SearchInput
              disabled={loading}
              setValue={setSearch}
              margin="0px 8px 0px 0px"
              placeholder="Search logs..."
              storage="usageSearchHistory"
            />
            <Selector
              disabled={loading}
              filter={status}
              width="25%"
              setFilter={setStatus}
              options={[
                { label: "All", filter: "all" },
                { label: "Success", filter: "success" },
                { label: "Error", filter: "error" },
              ]}
              position="right"
            />
          </div>
          <div className="usage-list">
            {loading ? (
              <Loader style={{ height: "50vh" }} />
            ) : usageDetails?.length > 0 ? (
              usageDetails.map((item) => (
                <div
                  key={item._id}
                  style={{
                    background: item.success ? "#22c55e2b" : "#e64d4d33",
                  }}
                  className="usage-item"
                >
                  <div className="usage-item-left">
                    <span
                      className={`usage-status-icon ${
                        item.success ? "success" : "error"
                      }`}
                    >
                      {item.success ? <CircleCheckBig /> : <CircleX />}
                    </span>

                    <div>
                      <div className="usage-item-title">
                        {item?.title || "N/A"}
                        <span
                          className={`usage-badge ${
                            item.success ? "success" : "error"
                          }`}
                        >
                          {item.success ? "success" : "error"}
                        </span>
                      </div>
                      <p className="usage-item-desc">
                        {item?.useCase || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="usage-item-right">
                    <p className="usage-time">{formateDateTime(item.date)}</p>
                    <p className="usage-credit">
                      {item.success ? "-1 credit" : "0 credit"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-data">No usage logs found.</div>
            )}
            <LoadMore
              loading={loadingMore}
              disabled={loadingMore}
              show={loadingMore || page < lastPage}
              onLoad={handleLoadMore}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Usage;

export const StateCard = ({
  label = "",
  value = "",
  loading = false,
  type = "success",
  icon: Icon,
}) => {
  return (
    <div className="usage-card">
      <div className="usage-card-content">
        <p className="usage-card-label">{label}</p>
        {loading ? (
          <Loader size="28" style={{ justifyContent: "start" }} />
        ) : (
          <h2>{value}</h2>
        )}
      </div>
      <div className={`usage-card-icon ${type}`}>
        <Icon />
      </div>
    </div>
  );
};
