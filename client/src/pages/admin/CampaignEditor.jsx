import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";
import {
  Save,
  Send,
  ArrowLeft,
  Eye,
  Code,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Mail,
  FileText,
  Zap,
} from "lucide-react";
import MiniLoader from "../../components/MiniLoader";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const CampaignEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? '' : 'http://localhost:5000');
  const autoSaveTimerRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    content: "<h2>Hello!</h2><p>Start writing your campaign here...</p>",
  });
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [viewMode, setViewMode] = useState("wysiwyg"); // wysiwyg | html | preview
  const [errors, setErrors] = useState({});
  const [saveStatus, setSaveStatus] = useState("idle"); // idle | saving | saved | error
  const [lastSaved, setLastSaved] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);

  // Email Templates
  const templates = [
    {
      name: "Newsletter",
      icon: Mail,
      content: `<h2 style="color: #38bdf8;">📧 Monthly Newsletter</h2>
<p>Dear Subscriber,</p>
<p>We're excited to share our latest updates with you!</p>
<h3>What's New:</h3>
<ul>
  <li>New feature releases</li>
  <li>Upcoming events</li>
  <li>Community highlights</li>
</ul>
<p>Thank you for being part of our community!</p>
<p>Best regards,<br/>The Team</p>`,
    },
    {
      name: "Announcement",
      icon: Sparkles,
      content: `<h2 style="color: #38bdf8;">🎉 Exciting Announcement!</h2>
<p>Hello there,</p>
<p>We have some exciting news to share with you today!</p>
<div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
  <h3 style="margin-top: 0;">Big News!</h3>
  <p>Your announcement details go here...</p>
</div>
<p>Stay tuned for more updates!</p>`,
    },
    {
      name: "Update",
      icon: Zap,
      content: `<h2 style="color: #38bdf8;">⚡ Quick Update</h2>
<p>Hi everyone,</p>
<p>Just a quick update on what's happening:</p>
<blockquote style="border-left: 4px solid #38bdf8; padding-left: 16px; margin: 20px 0; color: #64748b;">
  "Your important update message here"
</blockquote>
<p>We appreciate your continued support!</p>`,
    },
  ];

  useEffect(() => {
    if (id) {
      fetchCampaign();
    }
  }, [id]);

  // Auto-save functionality
  useEffect(() => {
    if (id && formData.title) {
      // Clear existing timer
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      // Set new timer for auto-save after 3 seconds of inactivity
      autoSaveTimerRef.current = setTimeout(() => {
        handleAutoSave();
      }, 3000);
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [formData]);

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/campaigns`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const found = data.campaigns.find((c) => c._id === id);
      if (found) {
        setFormData({
          title: found.title,
          subject: found.subject,
          content: found.content,
        });
        setLastSaved(new Date(found.updatedAt));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Internal name is required";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Email subject is required";
    } else if (formData.subject.length > 78) {
      newErrors.subject =
        "Subject line should be under 78 characters for best deliverability";
    }

    if (!formData.content.trim() || formData.content === "<p><br></p>") {
      newErrors.content = "Email content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleContentChange = (value) => {
    setFormData({ ...formData, content: value });
    if (errors.content) {
      setErrors({ ...errors, content: null });
    }
  };

  const handleAutoSave = async () => {
    if (!validateForm()) return;

    try {
      setSaveStatus("saving");
      const res = await fetch(`${API_URL}/api/campaigns/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setSaveStatus("saved");
        setLastSaved(new Date());
        setTimeout(() => setSaveStatus("idle"), 2000);
      }
    } catch (error) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setSaveStatus("saving");
      const method = id ? "PUT" : "POST";
      const url = id
        ? `${API_URL}/api/campaigns/${id}`
        : `${API_URL}/api/campaigns`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setSaveStatus("saved");
        setLastSaved(new Date());
        if (!id) {
          navigate(`/admin/campaigns/edit/${data.campaign._id}`);
        }
        setTimeout(() => setSaveStatus("idle"), 2000);
      } else {
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    } catch (error) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!validateForm()) {
      return;
    }

    const action = id ? "send this campaign" : "SAVE and SEND this campaign";

    if (
      !confirm(
        `Are you sure you want to ${action} to ALL active subscribers? This cannot be undone.`
      )
    )
      return;

    setSending(true);
    try {
      let targetId = id;

      if (!targetId) {
        const saveRes = await fetch(`${API_URL}/api/campaigns`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
        const saveData = await saveRes.json();
        if (!saveData.success)
          throw new Error(saveData.message || "Failed to save draft");
        targetId = saveData.campaign._id;
      } else {
        await fetch(`${API_URL}/api/campaigns/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      }

      const res = await fetch(`${API_URL}/api/campaigns/${targetId}/send`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        alert(data.message);
        navigate("/admin/campaigns");
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Failed to send: " + err.message);
    } finally {
      setSending(false);
    }
  };

  const applyTemplate = (template) => {
    setFormData({ ...formData, content: template.content });
    setShowTemplates(false);
    setViewMode("wysiwyg");
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      ["link", "image"],
      ["blockquote", "code-block"],
      [{ align: [] }],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "color",
    "background",
    "link",
    "image",
    "blockquote",
    "code-block",
    "align",
  ];

  if (loading && !formData.title)
    return (
      <AdminLayout>
        <MiniLoader />
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/campaigns")}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                {id ? "Edit Campaign" : "New Campaign"}
                {id && (
                  <span className="text-sm font-normal text-slate-400">
                    #{id.slice(-6)}
                  </span>
                )}
              </h1>
              {lastSaved && (
                <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                  <Clock size={14} />
                  Last saved: {lastSaved.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {/* Save Status Indicator */}
            {saveStatus !== "idle" && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 text-sm">
                {saveStatus === "saving" && (
                  <>
                    <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                    <span className="text-slate-300">Saving...</span>
                  </>
                )}
                {saveStatus === "saved" && (
                  <>
                    <CheckCircle2 size={16} className="text-green-500" />
                    <span className="text-green-500">Saved!</span>
                  </>
                )}
                {saveStatus === "error" && (
                  <>
                    <AlertCircle size={16} className="text-red-500" />
                    <span className="text-red-500">Save failed</span>
                  </>
                )}
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={loading || sending}
              className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all hover:scale-105"
            >
              <Save size={18} /> {id ? "Save Changes" : "Save Draft"}
            </button>
            <button
              onClick={handleSend}
              disabled={sending || loading}
              className="px-4 py-2 bg-accent text-slate-900 font-bold rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all hover:scale-105 hover:shadow-lg hover:shadow-accent/20"
            >
              {sending ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} /> Send Now
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Campaign Details */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4 hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-2 mb-4">
                <FileText size={20} className="text-accent" />
                <h3 className="text-white font-bold">Campaign Details</h3>
              </div>

              <div>
                <label className="text-sm text-slate-400 block mb-2 font-medium">
                  Internal Name *
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full bg-slate-950 border ${
                    errors.title ? "border-red-500" : "border-slate-700"
                  } rounded-lg p-3 text-white focus:border-accent outline-none transition-colors`}
                  placeholder="e.g. November Newsletter"
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.title}
                  </p>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm text-slate-400 font-medium">
                    Email Subject Line *
                  </label>
                  <span
                    className={`text-xs ${
                      formData.subject.length > 78
                        ? "text-red-500"
                        : formData.subject.length > 50
                        ? "text-yellow-500"
                        : "text-slate-500"
                    }`}
                  >
                    {formData.subject.length}/78
                  </span>
                </div>
                <input
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full bg-slate-950 border ${
                    errors.subject ? "border-red-500" : "border-slate-700"
                  } rounded-lg p-3 text-white focus:border-accent outline-none transition-colors`}
                  placeholder="e.g. Updates for you!"
                />
                {errors.subject && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.subject}
                  </p>
                )}
              </div>
            </div>

            {/* Templates */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={20} className="text-accent" />
                <h3 className="text-white font-bold">Quick Start</h3>
              </div>
              <div className="space-y-2">
                {templates.map((template, idx) => (
                  <button
                    key={idx}
                    onClick={() => applyTemplate(template)}
                    className="w-full flex items-center gap-3 p-3 bg-slate-950 hover:bg-slate-800 rounded-lg transition-all group border border-slate-800 hover:border-accent"
                  >
                    <template.icon
                      size={18}
                      className="text-slate-400 group-hover:text-accent transition-colors"
                    />
                    <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                      {template.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                <Sparkles size={18} className="text-accent" />
                Pro Tips
              </h3>
              <ul className="text-sm text-slate-300 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">•</span>
                  <span>Keep subject lines under 50 characters for mobile</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">•</span>
                  <span>Use personalization to increase engagement</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">•</span>
                  <span>Host images externally for better deliverability</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">•</span>
                  <span>Unsubscribe link is added automatically</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">•</span>
                  <span>Test preview on multiple devices</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Content Editor */}
          <div className="lg:col-span-3 flex flex-col bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            {/* Editor Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950">
              <button
                onClick={() => setViewMode("wysiwyg")}
                className={`flex-1 p-4 text-sm font-medium flex justify-center items-center gap-2 transition-all ${
                  viewMode === "wysiwyg"
                    ? "bg-slate-900 text-white border-b-2 border-accent"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <FileText size={16} /> Rich Editor
              </button>
              <button
                onClick={() => setViewMode("html")}
                className={`flex-1 p-4 text-sm font-medium flex justify-center items-center gap-2 transition-all ${
                  viewMode === "html"
                    ? "bg-slate-900 text-white border-b-2 border-accent"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <Code size={16} /> HTML Code
              </button>
              <button
                onClick={() => setViewMode("preview")}
                className={`flex-1 p-4 text-sm font-medium flex justify-center items-center gap-2 transition-all ${
                  viewMode === "preview"
                    ? "bg-slate-900 text-white border-b-2 border-accent"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <Eye size={16} /> Preview
              </button>
            </div>

            {/* Editor Content */}
            <div className="flex-1 relative min-h-[600px]">
              {viewMode === "wysiwyg" ? (
                <div className="h-full quill-editor-wrapper">
                  <ReactQuill
                    theme="snow"
                    value={formData.content}
                    onChange={handleContentChange}
                    modules={quillModules}
                    formats={quillFormats}
                    className="h-full"
                    placeholder="Start writing your email campaign..."
                  />
                </div>
              ) : viewMode === "html" ? (
                <div className="h-full flex flex-col">
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    className="flex-1 w-full bg-slate-950 p-6 text-slate-300 font-mono text-sm outline-none resize-none custom-scrollbar"
                    placeholder="Write your HTML content here..."
                  />
                  {errors.content && (
                    <div className="p-4 bg-red-500/10 border-t border-red-500/20">
                      <p className="text-red-500 text-sm flex items-center gap-2">
                        <AlertCircle size={14} />
                        {errors.content}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full bg-white text-black overflow-y-auto custom-scrollbar">
                  {/* Email Preview Container */}
                  <div className="max-w-[600px] mx-auto bg-white shadow-2xl my-8">
                    {/* Email Header Preview */}
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6 border-b border-slate-700">
                      <div className="text-sm text-slate-300 mb-2">
                        Subject Line:
                      </div>
                      <div className="text-lg font-bold">
                        {formData.subject || "(No subject)"}
                      </div>
                    </div>

                    {/* Email Content */}
                    <div
                      className="p-8 prose prose-slate max-w-none"
                      dangerouslySetInnerHTML={{ __html: formData.content }}
                      style={{
                        color: "#000",
                        fontFamily: "Arial, sans-serif",
                      }}
                    />

                    {/* Email Footer */}
                    <div className="mt-8 p-6 border-t bg-slate-50 text-center text-xs text-gray-500">
                      <p className="mb-2">
                        You received this email because you subscribed to our
                        updates.
                      </p>
                      <a
                        href="#"
                        className="text-accent underline hover:no-underline"
                      >
                        Unsubscribe from these emails
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CampaignEditor;
