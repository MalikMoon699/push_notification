import React, { useEffect, useState } from "react";
import {
  getUsersRecords,
  updateUsersStatus,
} from "../../services/admin.services";
import { Header, Input, Selector } from "../../components/CustomComponents";
import CustomTable from "../../components/CustomTable";
import { useDebounce } from "../../utils/hooks/useDebounce";
import { limit } from "../../utils/constants";
import { toast } from "sonner";
import Loader from "../../components/Loader";

const Users = () => {
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(null);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total,setTotal]=useState(0);
  const debounceSearch = useDebounce(search, 500);

  useEffect(() => {
    getInitData(page);
  }, [page]);

  useEffect(() => {
    getInitData(1);
  }, [debounceSearch, status]);

  const getInitData = async (nextPage = 1) => {
    try {
      setLoading(true);
      const res = await getUsersRecords({
        page: nextPage,
        limit,
        search: debounceSearch,
        status: status !== "all" ? status : "",
      });
      setUsers(res?.users || []);
      setTotalPages(res?.meta?.totalPages || 1);
      setPage(res?.meta?.page || 1);
      setTotal(res?.meta?.total || 0);
    } catch (err) {
      console.error("Failed to load users data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, currentStatus) => {
    try {
      setStatusLoading(userId);
      const newStatus = currentStatus === "approved" ? "rejected" : "approved";

      await updateUsersStatus({
        userId,
        status: newStatus,
      });

      setUsers((prev) =>
        prev
          .map((u) => (u._id === userId ? { ...u, status: newStatus } : u))
          .filter((u) => {
            if (status === "all") return true;
            return u.status === status;
          }),
      );
      toast.success("Update user status.");
    } catch (err) {
      console.error("Status update failed:", err);
      toast.error("Failed to update user status.");
    } finally {
      setStatusLoading(null);
    }
  };

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
            fontSize: 12,
            background: row.status === "approved" ? "#d1fae5" : "#fee2e2",
            color: row.status === "approved" ? "#065f46" : "#991b1b",
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
      name: "Used",
      row: (row) => row.usedCredits,
    },
    {
      name: "API Keys",
      row: (row) => row.apiKeys,
    },
    {
      name: "Joined",
      row: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      name: "Actions",
      row: (row) => (
        <button
          disabled={statusLoading}
          onClick={(e) => {
            e.stopPropagation();
            handleStatusChange(row._id, row.status);
          }}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            background: row.status === "approved" ? "#ef4444" : "#22c55e",
            color: "#fff",
            width: "85px",
            height: "28px",
          }}
        >
          {statusLoading === row?._id ? (
            <Loader color="#fff" size="15" />
          ) : row?.status === "approved" ? (
            "Suspend"
          ) : (
            "Approve"
          )}
        </button>
      ),
    },
  ];

  return (
    <div className="admin-page-container">
      <Header
        title="User Management"
        desc="View and manage all platform users"
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
            User Records
          </h3>
          <span
            className="custom-table-pagination-content"
          >
            Total: {total || 0} users
          </span>
        </div>
        <div className="custom-table-filters">
          <Input
            disabled={loading}
            placeholder="Search users..."
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
              { filter: "approved", label: "Approved" },
              { filter: "rejected", label: "Rejected" },
            ]}
          />
        </div>
        <CustomTable
          columns={columns}
          data={users}
          loading={loading}
          lastPage={totalPages}
          page={page}
          handlePageChange={(next) => setPage(next)}
        />
      </div>
    </div>
  );
};

export default Users;
