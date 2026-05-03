import { useEffect, useState } from "react";
import api from "../../api/api";
import UserTable from "../../components/admin/users management/UsersTable";
import { Search, Filter, Users, X, ChevronDown, ChevronRight, ChevronLeft, RefreshCw } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState("");
  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [totalPages, setTotalPages] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/users/", {
        params: {
          search: search || undefined,
          is_active: isActive || undefined,
          page: page,
        },
      });

      setUsers(res.data.results);
      setNextPage(res.data.next);
      setPrevPage(res.data.previous);
      setTotalUsers(res.data.count || 0);

      const pageSize = 10;
      const calculatedTotalPages = Math.ceil((res.data.count || 0) / pageSize);
      setTotalPages(calculatedTotalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchUsers();
  }, [search, isActive]);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const clearFilters = () => {
    setSearch("");
    setIsActive("");
    setPage(1);
  };

  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const hasActiveFilters = search !== "" || isActive !== "";

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-light tracking-tight text-white">
                User Management
              </h1>
              <p className="text-xs text-zinc-500 mt-1">
                Manage and monitor user accounts
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.02] border border-white/10 rounded-lg">
                <Users className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-xs text-zinc-400">
                  {totalUsers} total users
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search by email or username..."
                className="w-full pl-10 pr-4 py-2 bg-white/[0.02] border border-white/10 rounded-lg focus:outline-none focus:border-emerald-500/50 text-white text-sm placeholder-zinc-600"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  hasActiveFilters
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                    : "bg-white/[0.02] border-white/10 text-zinc-400 hover:text-white"
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span className="text-sm">Filters</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
                {hasActiveFilters && (
                  <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                )}
              </button>

              {isFilterOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)}></div>
                  <div className="absolute top-full right-0 mt-2 w-64 bg-[#0a0a0a] border border-white/10 rounded-lg shadow-xl z-50">
                    <div className="p-4 space-y-4">
                      <div>
                        <label className="text-xs text-zinc-500 block mb-2">
                          Account Status
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="status"
                              value=""
                              checked={isActive === ""}
                              onChange={() => {
                                setIsActive("");
                                setPage(1);
                                setIsFilterOpen(false);
                              }}
                              className="w-3.5 h-3.5 accent-emerald-500"
                            />
                            <span className="text-sm text-zinc-400">All Users</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="status"
                              value="true"
                              checked={isActive === "true"}
                              onChange={() => {
                                setIsActive("true");
                                setPage(1);
                                setIsFilterOpen(false);
                              }}
                              className="w-3.5 h-3.5 accent-emerald-500"
                            />
                            <span className="text-sm text-zinc-400">Active Only</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="status"
                              value="false"
                              checked={isActive === "false"}
                              onChange={() => {
                                setIsActive("false");
                                setPage(1);
                                setIsFilterOpen(false);
                              }}
                              className="w-3.5 h-3.5 accent-emerald-500"
                            />
                            <span className="text-sm text-zinc-400">Inactive Only</span>
                          </label>
                        </div>
                      </div>

                      {hasActiveFilters && (
                        <button
                          onClick={clearFilters}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/[0.02] rounded-lg hover:bg-white/5 text-xs text-zinc-500"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => fetchUsers()}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white/[0.02] border border-white/10 rounded-lg hover:bg-white/5 text-sm text-zinc-400"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-3">
              {search && (
                <div className="flex items-center gap-2 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
                  <span className="text-xs text-emerald-500">Search: "{search}"</span>
                  <button onClick={() => { setSearch(""); setPage(1); }} className="text-emerald-500/60 hover:text-emerald-500">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {isActive === "true" && (
                <div className="flex items-center gap-2 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
                  <span className="text-xs text-emerald-500">Status: Active</span>
                  <button onClick={() => { setIsActive(""); setPage(1); }} className="text-emerald-500/60 hover:text-emerald-500">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {isActive === "false" && (
                <div className="flex items-center gap-2 px-2 py-1 bg-red-500/10 border border-red-500/20 rounded-md">
                  <span className="text-xs text-red-500">Status: Inactive</span>
                  <button onClick={() => { setIsActive(""); setPage(1); }} className="text-red-500/60 hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              <button onClick={clearFilters} className="px-2 py-1 text-xs text-zinc-500 hover:text-zinc-300">
                Clear all
              </button>
            </div>
          )}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          </div>
        )}

        {!loading && <UserTable users={users} refresh={fetchUsers} />}

        {!loading && users.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
              <p className="text-xs text-zinc-600">
                Page {page} of {totalPages} | {totalUsers} records
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => goToPage(page - 1)}
                className="flex items-center justify-center w-8 h-8 bg-white/[0.02] border border-white/10 rounded-lg hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 text-zinc-500" />
              </button>

              <div className="flex items-center gap-1">
                {page > 2 && (
                  <>
                    <button onClick={() => goToPage(1)} className="w-8 h-8 rounded-lg text-sm text-zinc-500 hover:text-white hover:bg-white/5">
                      1
                    </button>
                    {page > 3 && <span className="text-zinc-600 px-1">...</span>}
                  </>
                )}

                {page > 1 && (
                  <button onClick={() => goToPage(page - 1)} className="w-8 h-8 rounded-lg text-sm text-zinc-500 hover:text-white hover:bg-white/5">
                    {page - 1}
                  </button>
                )}

                <button className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-sm">
                  {page}
                </button>

                {page < totalPages && (
                  <button onClick={() => goToPage(page + 1)} className="w-8 h-8 rounded-lg text-sm text-zinc-500 hover:text-white hover:bg-white/5">
                    {page + 1}
                  </button>
                )}

                {page < totalPages - 1 && (
                  <>
                    {page < totalPages - 2 && <span className="text-zinc-600 px-1">...</span>}
                    <button onClick={() => goToPage(totalPages)} className="w-8 h-8 rounded-lg text-sm text-zinc-500 hover:text-white hover:bg-white/5">
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              <button
                disabled={page === totalPages}
                onClick={() => goToPage(page + 1)}
                className="flex items-center justify-center w-8 h-8 bg-white/[0.02] border border-white/10 rounded-lg hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4 text-zinc-500" />
              </button>
            </div>
          </div>
        )}

        {!loading && users.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/[0.02] flex items-center justify-center">
              <Users className="w-8 h-8 text-zinc-700" />
            </div>
            <p className="text-sm text-zinc-600">No users found</p>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="mt-3 text-xs text-emerald-500 hover:text-emerald-400">
                Clear filters to see all users
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}