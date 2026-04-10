import React, { useEffect, useState } from "react";
import { StatesCard, TopBar } from "../components/CustomComponents";
import { ChartCard } from "../components/ChartsComponents";
import {
  DashBoardHourlyFallBack,
  dashBoardMonthlyFallBack,
  DashBoardWeeklyFallBack,
} from "../services/chartFallback.services.js";
import { Send, TrendingDown, TrendingUp, Zap } from "lucide-react";
import { getDashBoardData } from "../services/dashAnalytics.services.js";

const DashBoard = () => {
  const [loading, setLoading] = useState(true);
  const [states, setStates] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    handleInitData();
  }, []);

  const handleInitData = async () => {
    try {
      const res = await getDashBoardData();
      setStates(res?.data?.stats);
      setHourlyData(res?.data?.hourly);
      setWeeklyData(res?.data?.weekly);
      setMonthlyData(res?.data?.monthly);
    } catch (err) {
      console.error("Failed to load dashboard Data:", err);
    } finally {
      setLoading(false);
    }
  };

  const hourlyChartData =
    hourlyData?.length > 0 ? hourlyData : DashBoardHourlyFallBack;

  const weeklyChartData =
    weeklyData?.length > 0 ? weeklyData : DashBoardWeeklyFallBack;

  const monthlyChartData =
    monthlyData?.length > 0 ? monthlyData : dashBoardMonthlyFallBack;

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
            title="Success Rate"
            value={`${states?.successRate || 0}%`}
            loading={loading}
          />
          <StatesCard
            icon={TrendingDown}
            iColor="var(--status-rejected)"
            title="Fail Rate"
            value={`${states?.failRate || 0}%`}
            loading={loading}
          />
          <StatesCard
            icon={Zap}
            iColor="var(--status-pending)"
            title="Credits used"
            value={states?.creditsUsed || 0}
            loading={loading}
          />
        </div>
        <div className="charts-wrapper">
          <ChartCard
            title="Hourly Traffic ( Today )"
            chartType="area"
            ChartData={hourlyChartData}
            loading={loading}
          />
          <ChartCard
            title="Api requests weekly"
            chartType="pie"
            ChartData={weeklyChartData}
            loading={loading}
          />
        </div>
        <ChartCard
          title="Api usage monthly"
          chartType="bar"
          ChartData={monthlyChartData}
          loading={loading}
          height={275}
        />
      </div>
    </>
  );
};

export default DashBoard;
