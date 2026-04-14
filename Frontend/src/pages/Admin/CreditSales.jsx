import React, { useEffect, useState } from "react";
import {
  Header,
  Input,
  Selector,
  StatesCard,
} from "../../components/CustomComponents";
import {
  revenueByMonthFallBack,
  creditsSaleByWeekFallBack,
} from "../../services/adminChartFallback.services";
import { ChartCard } from "../../components/ChartsComponents";
import { Coins, ShoppingCart, TrendingUp } from "lucide-react";
import {
  getPaymentRecords,
  getPaymentsAnalytics,
} from "../../services/admin.services";
import { useDebounce } from "../../utils/hooks/useDebounce";
import CustomTable from "../../components/CustomTable";
import { limit } from "../../utils/constants";

const CreditSales = () => {
  const [loading, setLoading] = useState(true);
  const [states, setStates] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [creditSale, setCreditSale] = useState([]);

  const [tableLoading, setTableLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const debounceSearch = useDebounce(search, 500);

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
      const res = await getPaymentsAnalytics();
      setStates(res?.states);
      setRevenue(res?.revenueByMonth);
      setCreditSale(res?.creditsSaleByWeek);
    } catch (err) {
      console.error("Failed to load creditSale data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getTableData = async (nextPage = 1) => {
    try {
      setTableLoading(true);
      const res = await getPaymentRecords({
        page: nextPage,
        limit,
        search: debounceSearch,
        status: status !== "all" ? status : "",
      });
      setPayments(res?.payments);
      setTotalPages(res?.meta?.totalPages || 1);
      setPage(res?.meta?.page || 1);
      setTotal(res?.meta?.total || 0);
    } catch (err) {
      console.error("Failed to load creditSale data:", err);
    } finally {
      setTableLoading(false);
    }
  };

  const revenueChart = revenue?.length > 0 ? revenue : revenueByMonthFallBack;

  const creditSaleChart =
    creditSale?.length > 0 ? creditSale : creditsSaleByWeekFallBack;

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
            background:
              row.status === "paid"
                ? "#d1fae5"
                : row.status === "pending"
                  ? "#c1c6113d"
                  : "#fee2e2",
            color:
              row.status === "paid"
                ? "var(--status-approved)"
                : row.status === "pending"
                  ? "var(--status-pending)"
                  : "var(--status-rejected)",
          }}
        >
          {row.status}
        </span>
      ),
    },
    {
      name: "Credits",
      row: (row) => row.credits,
    },
    {
      name: "Amount",
      row: (row) => row.price,
    },
    {
      name: "Joined",
      row: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div className="admin-page-container">
      <Header
        title="Credit Sales & revenue"
        desc="Monitor credit purchases, and revenue"
      />
      <div
        style={{ margin: "30px 0px" }}
        className="custom-dashboard-stats-container"
      >
        <StatesCard
          icon={Coins}
          iColor="#FFD700"
          title="Total Revenue"
          value={states?.totalRevenue || 0}
          loading={loading}
        />
        <StatesCard
          icon={ShoppingCart}
          iColor="var(--status-pending)"
          title="Credits Sold"
          value={states?.creditsSold || 0}
          loading={loading}
        />
        <StatesCard
          icon={TrendingUp}
          iColor="var(--status-approved)"
          title="Total Orders"
          value={states?.totalOrders || 0}
          loading={loading}
        />
      </div>
      <div className="charts-wrapper">
        <ChartCard
          title="Revenue monthly"
          chartType="bar"
          ChartData={revenueChart}
          loading={loading}
        />
        <ChartCard
          title="Credits Sold"
          chartType="area"
          ChartData={creditSaleChart}
          loading={loading}
        />
      </div>
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
            Revenue Records
          </h3>
          <span className="custom-table-pagination-content">
            Total: {total || 0} records
          </span>
        </div>
        <div className="custom-table-filters">
          <Input
            disabled={loading}
            placeholder="Search records..."
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
              { filter: "pending", label: "Pending" },
              { filter: "paid", label: "Paid" },
              { filter: "failed", label: "Failed" },
            ]}
          />
        </div>
        <CustomTable
          columns={columns}
          data={payments}
          loading={tableLoading}
          lastPage={totalPages}
          page={page}
          handlePageChange={(next) => setPage(next)}
        />
      </div>
    </div>
  );
};

export default CreditSales;
