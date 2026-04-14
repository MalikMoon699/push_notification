import React, { useEffect, useState } from "react";
import { StatesCard, TopBar } from "../components/CustomComponents";
import { ChartCard } from "../components/ChartsComponents";
import {
  analyticsWeeklyFallBack,
  analyticsWeeklyApiCreateFallBack,
  analyticsMonthlyFallBack,
} from "../services/chartFallback.services.js";
import { Key, Send, TrendingDown, TrendingUp } from "lucide-react";
import { getAnalyticsData } from "../services/dashAnalytics.services.js";

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [states, setStates] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [weeklyApiData, setWeeklyApiData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    handleInitData();
  }, []);

  const handleInitData = async () => {
    try {
      const res = await getAnalyticsData();
      setStates(res?.data?.States);
      setWeeklyData(res?.data?.analyticsWeekly);
      setWeeklyApiData(res?.data?.analyticsWeeklyApiCreate);
      setMonthlyData(res?.data?.analyticsMonthly);
    } catch (err) {
      console.error("Failed to load analytics Data:", err);
    } finally {
      setLoading(false);
    }
  };

  const weeklyChartData =
    weeklyData?.length > 0 ? weeklyData : analyticsWeeklyFallBack;

  const weeklyApiChartData =
    weeklyApiData?.length > 0
      ? weeklyApiData
      : analyticsWeeklyApiCreateFallBack;

  const monthlyChartData =
    monthlyData?.length > 0 ? monthlyData : analyticsMonthlyFallBack;

  return (
    <>
      <TopBar title="Dashboard" />
      <div className="page-container">
        <div
          style={{ marginBottom: "30px" }}
          className="custom-dashboard-stats-container"
        >
          <StatesCard
            icon={Send}
            iColor="var(--card-foreground)"
            title="Notifications Sent"
            value={states?.totalRequests || 0}
            loading={loading}
          />
          <StatesCard
            icon={TrendingUp}
            iColor="var(--status-approved)"
            title="Success count"
            value={states?.successCount || 0}
            loading={loading}
          />
          <StatesCard
            icon={TrendingDown}
            iColor="var(--status-rejected)"
            title="Fail count"
            value={states?.failCount || 0}
            loading={loading}
          />
          <StatesCard
            icon={Key}
            iColor="var(--status-pending)"
            title="Keys created"
            value={states?.keysCreated || 0}
            loading={loading}
          />
        </div>
        <div className="charts-wrapper">
          <ChartCard
            title="Api usage weekly"
            chartType="bar"
            ChartData={weeklyChartData}
            loading={loading}
          />
          <ChartCard
            title="Api created weekly"
            chartType="pie"
            ChartData={weeklyApiChartData}
            loading={loading}
          />
        </div>
        <ChartCard
          title="Api usage monthly"
          chartType="area"
          ChartData={monthlyChartData}
          loading={loading}
          height={275}
        />
      </div>
    </>
  );
};

export default Analytics;
