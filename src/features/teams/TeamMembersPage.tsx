import { Box } from "@mui/material";
import { TeamMembersHeader } from "./components/TeamMembersHeader";
import { FiltersSection } from "./components/FiltersSection";
import { TeamTable } from "./components/TeamTable";
import { PaginationControls } from "./components/PaginationControls";
import { AddUserModal } from "./components/AddUserModal/AddUserModal";
import { UserDetailModal } from "./components/UserDetailModal";
import { useTeamMembers } from "../../hooks/useTeamMembers";

const TeamMembersPage = () => {
  const {
    members,
    loading,
    filters,
    pagination,
    selectedMember,
    isAddModalOpen,
    isDetailModalOpen,
    handleFilterChange,
    handleSearch,
    resetFilters,
    openAddModal,
    closeAddModal,
    openDetailModal,
    closeDetailModal,
    handlePageChange,
    handleAddMember,
    handleUpdateMember,
    handleDeleteMember,
  } = useTeamMembers();

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <TeamMembersHeader onAddMember={openAddModal} />

      <Box component="main" sx={{ p: 3 }}>
        <FiltersSection
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          onReset={resetFilters}
        />

        <TeamTable
          members={members}
          loading={loading}
          onRowClick={openDetailModal}
        />

        <PaginationControls
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      </Box>

      <AddUserModal
        open={isAddModalOpen}
        onClose={closeAddModal}
        onSubmit={handleAddMember}
      />

      <UserDetailModal
        member={selectedMember}
        open={isDetailModalOpen}
        onClose={closeDetailModal}
        onEdit={handleUpdateMember}
        onDelete={handleDeleteMember}
      />
    </Box>
  );
};

export default TeamMembersPage;
