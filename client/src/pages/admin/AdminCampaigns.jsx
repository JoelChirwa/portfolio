import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";
import { Plus, Send, Edit, Trash2, Eye, BarChart2 } from "lucide-react";
import { Link } from "react-router-dom";
import MiniLoader from "../../components/MiniLoader";

const AdminCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? '' : 'http://localhost:5000');

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch(`${API_URL}/api/campaigns`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setCampaigns(data.campaigns);
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCampaign = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`${API_URL}/api/campaigns/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setCampaigns(campaigns.filter((c) => c._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "sent":
        return (
          <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
            Sent
          </span>
        );
      case "sending":
        return (
          <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs">
            Sending...
          </span>
        );
      default:
        return (
          <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs">
            Draft
          </span>
        );
    }
  };

  if (loading)
    return (
      <AdminLayout>
        <MiniLoader text="Loading Campaigns..." />
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Email Campaigns</h1>
            <p className="text-slate-400">Manage and send newsletters</p>
          </div>
          <Link
            to="/admin/campaigns/new"
            className="bg-accent text-slate-900 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-accent/90"
          >
            <Plus size={20} /> New Campaign
          </Link>
        </div>

        {campaigns.length === 0 ? (
          <div className="text-center py-20 bg-slate-900 rounded-xl border border-slate-800">
            <h3 className="text-xl text-white font-bold mb-2">
              No Campaigns Yet
            </h3>
            <p className="text-slate-400 mb-6">
              Create your first newsletter to engage your subscribers.
            </p>
            <Link
              to="/admin/campaigns/new"
              className="text-accent hover:underline"
            >
              Create Now
            </Link>
          </div>
        ) : (
          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Sent To</th>
                  <th className="p-4 text-center">Opens</th>
                  <th className="p-4 text-center">Clicks</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {campaigns.map((camp) => (
                  <tr key={camp._id} className="hover:bg-slate-800/50">
                    <td className="p-4 font-medium text-white">{camp.title}</td>
                    <td className="p-4 text-slate-300">{camp.subject}</td>
                    <td className="p-4">{getStatusBadge(camp.status)}</td>
                    <td className="p-4 text-center text-slate-300">
                      {camp.recipientCount || "-"}
                    </td>
                    <td className="p-4 text-center text-green-400">
                      {camp.status === "sent"
                        ? `${camp.stats.uniqueOpens} (${Math.round(
                            (camp.stats.uniqueOpens /
                              (camp.recipientCount || 1)) *
                              100
                          )}%)`
                        : "-"}
                    </td>
                    <td className="p-4 text-center text-blue-400">
                      {camp.status === "sent" ? camp.stats.uniqueClicks : "-"}
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      {camp.status === "draft" && (
                        <>
                          <Link
                            to={`/admin/campaigns/edit/${camp._id}`}
                            className="p-2 bg-slate-800 rounded hover:bg-slate-700 text-slate-300"
                          >
                            <Edit size={16} />
                          </Link>
                        </>
                      )}

                      <button
                        onClick={() => deleteCampaign(camp._id)}
                        className="p-2 bg-red-900/20 hover:bg-red-900/40 rounded text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCampaigns;
