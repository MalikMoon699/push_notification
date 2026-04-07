import React, { useEffect, useState } from "react";
import "../assets/style/Payment.css";
import { LoadMore, TopBar } from "../components/CustomComponents";
import { getPaymentRecordsHelper } from "../services/payment.services";
import { limit } from "../utils/constants";
import Loader from "../components/Loader";
import { formateDateTime } from "../utils/helper";

const Payments = () => {
  const [paymentRecords, setPaymentRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getPaymentRecords(1);
  }, []);

  const getPaymentRecords = async (nextPage = 1) => {
    try {
      if (nextPage === 1) setLoading(true);
      else setLoadMoreLoading(true);
      const res = await getPaymentRecordsHelper(nextPage, limit);
      if (nextPage === 1) {
        setPaymentRecords(res.data);
      } else {
        setPaymentRecords((prev) => [...prev, ...res.data]);
      }
      setTotal(res?.pagination?.total);
      setPage(nextPage);
    } catch (err) {
      console.error("Failed to get Services:", err);
    } finally {
      setLoading(false);
      setLoadMoreLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (paymentRecords.length >= total) return;
    getPaymentRecords(page + 1);
  };

  return (
    <>
      <TopBar title={`Payment Records (${total || 0})`} />
      <div className="page-container">
        <div className="princing-records-list">
          {loading ? (
            <Loader style={{ height: "180px", width: "100%" }} />
          ) : paymentRecords?.length > 0 ? (
            paymentRecords?.map((record, index) => (
              <div key={index} className="princing-record-card">
                <div className="princing-record-header">
                  <div className="princing-record-plan">Custom Plan</div>

                  <div
                    className={`princing-record-status princing-record-status-${record?.status}`}
                  >
                    {record?.status}
                  </div>
                </div>

                <div className="princing-record-body">
                  <div className="princing-record-item">
                    <span className="princing-record-label">Credits</span>
                    <span className="princing-record-value">
                      {record?.credits}
                    </span>
                  </div>

                  <div className="princing-record-item">
                    <span className="princing-record-label">Price</span>
                    <span className="princing-record-value">
                      € {record?.price}
                    </span>
                  </div>

                  <div className="princing-record-item">
                    <span className="princing-record-label">Subscribe At</span>
                    <span className="princing-record-value">
                      {formateDateTime(record?.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-data">No records found.</p>
          )}
        </div>
        <LoadMore
          loading={loadMoreLoading}
          disabled={loadMoreLoading || loading}
          show={paymentRecords.length < total && !loading}
          onLoad={handleLoadMore}
        />
      </div>
    </>
  );
};

export default Payments;
