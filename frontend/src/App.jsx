import React, { useState, useEffect, useCallback } from "react";
import { Header } from "./components/Header";
import { StatsOverview } from "./components/StatsOverview";
import { RevisionHeatmap } from "./components/RevisionHeatmap";
import { DueSection } from "./components/DueSection";
import { SidebarForm } from "./components/SidebarForm";
import { ProblemTable } from "./components/ProblemTable";
import { ProblemHistoryModal } from "./components/ProblemHistoryModal";
import { EditProblemModal } from "./components/EditProblemModal";
import { ConfirmModal } from "./components/ConfirmModal";
import { Toast } from "./components/Toast";
import { AuthPage } from "./pages/AuthPage";
import { useAuth } from "./context/AuthContext";
import {
  fetchProblems,
  fetchDueProblems,
  fetchStats,
  createProblem,
  reviseProblem,
  updateProblem,
  deleteProblem,
} from "./services/api";
import { X, Sparkles, Loader2 } from "lucide-react";

export function App() {
  const { user, loading: authLoading } = useAuth();

  const [problems, setProblems] = useState([]);
  const [dueProblems, setDueProblems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filters & Sorting
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("nextRevisionDate");
  const [sortOrder, setSortOrder] = useState("asc");

  // Modals & Drawers
  const [selectedHistoryProblem, setSelectedHistoryProblem] = useState(null);
  const [editingProblem, setEditingProblem] = useState(null);
  const [deletingProblem, setDeletingProblem] = useState(null);
  const [mobileLogOpen, setMobileLogOpen] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const loadDashboardData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [problemsRes, dueRes, statsRes] = await Promise.all([
        fetchProblems({
          status: filterStatus,
          search: searchQuery,
          sortBy,
          order: sortOrder,
        }),
        fetchDueProblems(),
        fetchStats(),
      ]);

      if (problemsRes.success) setProblems(problemsRes.data || []);
      if (dueRes.success) setDueProblems(dueRes.data || []);
      if (statsRes.success) setStats(statsRes.data || null);
    } catch (error) {
      console.error("Error loading dashboard:", error);
      showToast(
        "Error connecting to backend server. Make sure backend is running.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, [user, filterStatus, searchQuery, sortBy, sortOrder]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user, loadDashboardData]);

  // Log new problem handler
  const handleLogProblem = async (formData) => {
    setIsSubmitting(true);
    try {
      const res = await createProblem(formData);
      if (res.success) {
        showToast(
          `Problem #${res.data.questionNumber} logged! First revision in 3 days.`,
          "success",
        );
        setMobileLogOpen(false);
        await loadDashboardData();
      }
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to log problem.",
        "error",
      );
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Revise problem handler
  const handleRevise = async (id, action = "complete") => {
    try {
      const res = await reviseProblem(id, action);
      if (res.success) {
        if (action === "complete") {
          showToast(res.message, "success");
        } else {
          showToast("Revision skipped for today.", "info");
        }
        await loadDashboardData();
      }
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to update revision.",
        "error",
      );
    }
  };

  // Update notes/title handler
  const handleSaveEdit = async (id, updateData) => {
    try {
      const res = await updateProblem(id, updateData);
      if (res.success) {
        showToast("Problem details updated successfully.", "success");
        await loadDashboardData();
      }
    } catch (error) {
      showToast("Failed to update problem.", "error");
    }
  };

  // Delete problem handler
  const handleConfirmDelete = async () => {
    if (!deletingProblem) return;
    try {
      const res = await deleteProblem(deletingProblem._id);
      if (res.success) {
        showToast(
          `Removed #${deletingProblem.questionNumber} from tracking.`,
          "info",
        );
        setDeletingProblem(null);
        await loadDashboardData();
      }
    } catch (error) {
      showToast("Failed to delete problem.", "error");
    }
  };

  // Render Auth Loading State
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-leetcode-dark text-leetcode-orange">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Render Auth Login/Signup Page if not signed in
  if (!user) {
    return <AuthPage />;
  }

  // Render Protected Dashboard for Authenticated User
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-leetcode-dark text-gray-900 dark:text-gray-100 pb-12 transition-colors">
      {/* Header */}
      <Header
        stats={stats}
        onRefresh={loadDashboardData}
        onOpenMobileLog={() => setMobileLogOpen(true)}
      />

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Top Stats Overview */}
        <StatsOverview stats={stats} />

        {/* Revision Heatmap */}
        <RevisionHeatmap heatmapData={stats?.heatmapData} />

        {/* Grid Layout: Sidebar Form (Desktop) & Main Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Workspace (Due Section + Table) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Due Section */}
            <DueSection
              dueProblems={dueProblems}
              onRevise={handleRevise}
              onViewHistory={(prob) => setSelectedHistoryProblem(prob)}
            />

            {/* All Problems Table */}
            <ProblemTable
              problems={problems}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              onViewHistory={(prob) => setSelectedHistoryProblem(prob)}
              onEditProblem={(prob) => setEditingProblem(prob)}
              onDeleteProblem={(prob) => setDeletingProblem(prob)}
              onRevise={handleRevise}
            />
          </div>

          {/* Sidebar Form (Desktop Sticky) */}
          <div className="hidden lg:block lg:col-span-4 sticky top-20">
            <SidebarForm
              onSubmitProblem={handleLogProblem}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </main>

      {/* Mobile Sidebar Bottom Sheet / Modal */}
      {mobileLogOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm lg:hidden">
          <div className="w-full sm:max-w-md bg-white dark:bg-leetcode-dark-card rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-leetcode-orange" />
                <h3 className="font-bold text-gray-900 dark:text-white text-base">
                  Log Solved Problem
                </h3>
              </div>
              <button
                onClick={() => setMobileLogOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarForm
              onSubmitProblem={handleLogProblem}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}

      {/* Modals */}
      <ProblemHistoryModal
        problem={selectedHistoryProblem}
        onClose={() => setSelectedHistoryProblem(null)}
      />

      <EditProblemModal
        problem={editingProblem}
        onClose={() => setEditingProblem(null)}
        onSave={handleSaveEdit}
      />

      <ConfirmModal
        isOpen={!!deletingProblem}
        title={`Delete Problem #${deletingProblem?.questionNumber}?`}
        message="This will permanently remove the problem and its revision history logs."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingProblem(null)}
      />

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
