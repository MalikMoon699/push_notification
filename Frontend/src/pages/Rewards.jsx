import React, { useEffect, useState } from "react";
import { LoadMore, TopBar } from "../components/CustomComponents";
import "../assets/style/Reward.css";
import {
  claimDailyRewardHelper,
  claimFirstLoginRewardHelper,
  getRewardRecordsHelper,
} from "../services/reward.services";
import { useAuth } from "../context/AuthContext";
import { Gift, TicketCheck, Zap } from "lucide-react";
import { toast } from "sonner";
import { limit } from "../utils/constants";
import Loader from "../components/Loader";

const Rewards = () => {
  const { currentUser } = useAuth();
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [credits, setCredits] = useState(currentUser?.credits || 0);
  const [isFirstLogin, setIsFirstLogin] = useState(
    currentUser?.firstSignUpClaim,
  );

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async (nextPage = 1) => {
    try {
      if (nextPage === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      const res = await getRewardRecordsHelper(nextPage, limit);
      const newLoaded = res?.records || [];
      setRewards((prev) =>
        nextPage === 1 ? newLoaded : [...prev, ...newLoaded],
      );

      setPage(res?.meta?.page || 1);
      setLastPage(res?.meta?.totalPages || 1);
    } catch (err) {
      console.error("Failed to load UsageRecords:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (page < lastPage && !loadingMore) {
      fetchRewards(page + 1);
    }
  };

  return (
    <>
      <TopBar title="Daily Rewards" updateCredits={credits} />
      <div className="reward-container">
        <div className="reward-claim-cards">
          {isFirstLogin ? (
            <RewardCard
              title="Daily Reward Available!"
              desc="Redeem 10 – 100 random bonus credits for free."
              loading={loading}
              type="dailyReward"
              lastClaimDate={currentUser?.lastClaimDate}
              onClaim={claimDailyRewardHelper}
              setCredits={setCredits}
              setIsFirstLogin={setIsFirstLogin}
              setRewards={setRewards}
            />
          ) : (
            <RewardCard
              title="First Login Reward!"
              desc="Redeem 100 credits for first login for free."
              loading={loading}
              type="firstLogin"
              onClaim={claimFirstLoginRewardHelper}
              setCredits={setCredits}
              setIsFirstLogin={setIsFirstLogin}
              setRewards={setRewards}
            />
          )}
        </div>

        <div className="reward-history-section">
          <h2 className="reward-history-title">Reward History</h2>
          {loading ? (
            <div className="empty-data">
            <Loader />
            </div>
          ) : rewards.length === 0 ? (
            <p className="empty-data">No rewards claimed yet.</p>
          ) : (
            <div className="reward-history-list">
              {rewards.map((r, index) => (
                <div key={index} className="reward-history-item">
                  <div className="reward-history-info">
                    <span className="reward-history-title-text">{r.title}</span>
                    <span className="reward-history-date">
                      {new Date(r.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="reward-history-credits">
                    +{r.rewardCredits} Credits
                  </div>
                </div>
              ))}
              <LoadMore
                loading={loadingMore}
                disabled={loadingMore}
                show={loadingMore || page < lastPage}
                onLoad={handleLoadMore}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Rewards;

const RewardCard = ({
  title = "",
  desc = "",
  type = "",
  lastClaimDate = "",
  onClaim = async () => ({}),
  setCredits,
  setIsFirstLogin,
  setRewards,
}) => {
  const { refresh } = useAuth();
  const [zapAnimation, setZapAnimation] = useState(false);
  const [countdown, setCountdown] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [localLastClaimDate, setLocalLastClaimDate] = useState(lastClaimDate);
  const [isReady, setIsReady] = useState(false);
  const isDailyReward = type === "dailyReward";
  const isFirstLoginReward = type === "firstLogin";

  const triggerZapAnimation = () => {
    setZapAnimation(true);
    setTimeout(() => setZapAnimation(false), 1200);
  };

  const handleClaim = async () => {
    try {
      setLoading(true);
      const res = await onClaim();

      if (res.success) {
        setCredits(res?.data?.totalCredits);
        triggerZapAnimation();
        toast.success("Reward claimed successfuly.");

        if (isDailyReward) {
          setIsDisabled(true);
          setLocalLastClaimDate(res.data.claimedAt);
        }
        if (isFirstLoginReward) setIsFirstLogin(true);
        refresh();
        const newReward = {
          createdAt: res.data.claimedAt,
          rewardCredits: res.data.rewardCredits,
          title: res.data.title,
        };

        setRewards((prevRewards = []) => [newReward, ...prevRewards]);
      }
    } catch (err) {
      console.error("Failed to claim reward:", err);
      toast.error(err?.message || "Failed to claim reward");
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  if (!isDailyReward) {
    setIsReady(true);
    return;
  }

  if (!localLastClaimDate) {
    setIsDisabled(false);
    setIsReady(true);
    return;
  }

  const interval = setInterval(() => {
    const now = new Date();
    const claimDate = new Date(localLastClaimDate);

    const nextClaim = new Date(claimDate);
    nextClaim.setDate(claimDate.getDate() + 1);
    nextClaim.setHours(0, 0, 0, 0);

    const diff = nextClaim - now;

    if (diff <= 0) {
      setCountdown("");
      setIsDisabled(false);
    } else {
      setIsDisabled(true);

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      );
    }

    setIsReady(true);
  }, 1000);

  return () => clearInterval(interval);
}, [localLastClaimDate, isDailyReward]);

  return (
    <div className="reward-card reward-daily">
      <Gift size={48} className="reward-icon" />
      <h3 className="reward-title">{title}</h3>
      <p className="reward-desc">{desc}</p>
      <button
        className="reward-btn"
        disabled={!isReady || loading || isDisabled}
        onClick={handleClaim}
      >
        <span
          style={{
            marginRight: "0.5rem",
            color: "var(--muted-foreground)",
          }}
          className="icon"
        >
          <TicketCheck size={20} />
        </span>
        {!isReady
          ? "Checking..."
          : loading
            ? "Claiming..."
            : isDisabled && countdown
              ? `Next claim in ${countdown}`
              : "Claim Reward"}
        {zapAnimation && (
          <div className="reward-zap-animation">
            {Array.from({ length: 6 }).map((_, i) => (
              <Zap key={i} size={20} className="reward-zap-icon" />
            ))}
          </div>
        )}
      </button>
    </div>
  );
};
