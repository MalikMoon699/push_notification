import React, { useEffect, useState } from "react";
import { getDashBoardData } from "../../services/admin.services";
import { Header, StatesCard } from "../../components/CustomComponents";
import { ChartCard } from "../../components/ChartsComponents";
import { Bell, Coins, Key, Users } from "lucide-react";
import {
  CreditUsageDistributionFallBack,
  RevenueCreditsSoldByMonthFallBack,
  userGrothByMonthFallBack,
} from "../../services/adminChartFallback.services";

const DashBoard = () => {
  const [loading, setLoading] = useState(true);
  const [states, setStates] = useState(null);
  const [userGroth, setUserGroth] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [creditUsage, setCreditUsage] = useState([]);

  useEffect(() => {
    getInitData();
  }, []);

  const getInitData = async () => {
    try {
      const res = await getDashBoardData();
      setStates(res?.States);
      setUserGroth(res?.userGrothByMonth);
      setRevenue(res?.RevenueCreditsSoldByMonth);
      setCreditUsage(res?.CreditUsageDistributionFormatted);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const userGrothChart =
    userGroth?.length > 0 ? userGroth : userGrothByMonthFallBack;

  const revenueChart =
    revenue?.length > 0 ? revenue : RevenueCreditsSoldByMonthFallBack;

  const creditUsageChart =
    creditUsage?.length > 0 ? creditUsage : CreditUsageDistributionFallBack;

  return (
    <div className="admin-page-container">
      <Header
        title="Admin Dashboard"
        desc="Platform overview and credit analytics"
      />
      <div
        style={{ margin: "30px 0px" }}
        className="custom-dashboard-stats-container"
      >
        <StatesCard
          icon={Users}
          iColor="var(--card-foreground)"
          title="Total Users"
          value={states?.totalUsers || 0}
          loading={loading}
        />
        <StatesCard
          icon={Coins}
          iColor="var(--status-approved)"
          title="Total Credits Sold"
          value={states?.TotalCreditsSold || 0}
          loading={loading}
        />
        <StatesCard
          icon={Key}
          iColor="var(--status-pending)"
          title="API Keys Issued"
          value={states?.APIKeysIssued || 0}
          loading={loading}
        />
        <StatesCard
          icon={Bell}
          iColor="var(--primary)"
          title="Notifications Today"
          value={states?.NotificationsToday || 0}
          loading={loading}
        />
      </div>
      <div className="charts-wrapper">
        <ChartCard
          title="User Growth"
          chartType="area"
          ChartData={userGrothChart}
          loading={loading}
        />
        <ChartCard
          title="Revenue & Credits Sold"
          chartType="bar"
          ChartData={revenueChart}
          loading={loading}
        />
      </div>
      <ChartCard
        title="Credit Usage Distribution"
        chartType="pie"
        ChartData={creditUsageChart}
        loading={loading}
      />
    </div>
  );
};

export default DashBoard;
