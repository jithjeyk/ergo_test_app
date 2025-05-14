import { useRef, useEffect } from "react";
import { Box } from "@mui/material";
import { TeamMembersHeader } from "./components/TeamMembersHeader";
// import { FiltersSection } from "./components/FiltersSection";
import { TeamTable } from "./components/TeamTable";
// import { PaginationControls } from "./components/PaginationControls";
import { DmsModal, ModalSize } from "../../components/common/DmsModal";
import { AddUserModalContent } from "./components/AddUserModal/AddUserModalContent";
import { UserDetailModalContent } from "./components/UserDetailModalContent";
import { useTeamMembers } from "../../hooks/useTeamMembers";
import { TeamOverview } from "./components/TeamOverview";
import { useModalSubmitConnection } from "../../hooks/useModalSubmitConnection";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ArticleIcon from '@mui/icons-material/Article';

const TeamMembersPage = () => {
  const { registerSubmitHandler, triggerSubmit } = useModalSubmitConnection();
  const addUserModalRef = useRef<{ submit: () => void | Promise<void> }>(null);
  const {
    members,
    loading,
    // filters,
    // pagination,
    selectedMember,
    isAddModalOpen,
    isDetailModalOpen,
    // handleFilterChange,
    // handleSearch,
    // resetFilters,
    openAddModal,
    closeAddModal,
    openDetailModal,
    closeDetailModal,
    // handlePageChange,
    handleAddMember,
    // handleUpdateMember,
    // handleDeleteMember,
  } = useTeamMembers();

  useEffect(() => {
    if (addUserModalRef.current) {
      registerSubmitHandler(addUserModalRef.current.submit);
    }
  }, [registerSubmitHandler]);

  const handleAddTeamMember = async () => {
    // This will trigger the child modal's submit function
    const result = await triggerSubmit();
    if (!result) return;
    const { method, data } = result;
    if (method && data) {
      handleAddMember(method, data);
    }
    closeDetailModal();
  };

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Box component="main" sx={{ p: 3 }}>
        <TeamMembersHeader onAddMember={openAddModal} />

        <TeamOverview />

        {/* <FiltersSection
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          onReset={resetFilters}
        /> */}

        <TeamTable
          members={members}
          loading={loading}
          onRowClick={openDetailModal}
        />

        {/* <PaginationControls
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        /> */}
      </Box>

      <DmsModal
        open={isAddModalOpen}
        onClose={closeAddModal}
        size={"md" as ModalSize}
        title="Add New Team Member"
        showHeaderDivider
        titleIcon={<PersonAddIcon />}
        primaryButtonText="Save"
        secondaryButtonText="Cancel"
        onPrimaryAction={handleAddTeamMember}
        onSecondaryAction={closeAddModal}
      >
        <AddUserModalContent ref={addUserModalRef} onSubmit={handleAddMember} />
      </DmsModal>

      <DmsModal
        open={isDetailModalOpen}
        onClose={closeDetailModal}
        size={"md" as ModalSize}
        title="User Details"
        showHeaderDivider
        titleIcon={<ArticleIcon />

        }
      >
        <UserDetailModalContent
          member={selectedMember}
        />
      </DmsModal>

      {/* <UserDetailModal
        member={selectedMember}
        open={isDetailModalOpen}
        onClose={closeDetailModal}
        onEdit={handleUpdateMember}
        onDelete={handleDeleteMember}
      /> */}
    </Box>
  );
};

export default TeamMembersPage;
