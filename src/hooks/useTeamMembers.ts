import { useState, useEffect, useCallback } from 'react';
import { TeamMember, TeamMembersFilters } from '../types/teamMembers';
import { mockTeamMembers } from '..//utils/mockData';

export const useTeamMembers = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  const [filters, setFilters] = useState<TeamMembersFilters>({
    search: '',
    status: '',
    role: '',
    userType: '',
  });
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 5,
    itemsPerPage: 10,
    totalItems: 50,
  });

  // Fetch data (in a real app, this would be an API call)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setMembers(mockTeamMembers);
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [filters, pagination.currentPage]);

  const handleFilterChange = useCallback((name: keyof TeamMembersFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  const handleSearch = useCallback((searchTerm: string) => {
    setFilters(prev => ({
      ...prev,
      search: searchTerm,
    }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      status: '',
      role: '',
      userType: '',
    });
  }, []);

  const openAddModal = useCallback(() => setIsAddModalOpen(true), []);
  const closeAddModal = useCallback(() => setIsAddModalOpen(false), []);
  
  const openDetailModal = useCallback((member: TeamMember) => {
    setSelectedMember(member);
    setIsDetailModalOpen(true);
  }, []);
  
  const closeDetailModal = useCallback(() => setIsDetailModalOpen(false), []);

  const handlePageChange = useCallback((newPage: number) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  }, []);

  const handleAddMember = useCallback((method: string, data: any) => {
    // In a real app, this would call an API
    console.log('Adding member with:', method, data);
  }, []);

  const handleUpdateMember = useCallback((member: TeamMember) => {
    // In a real app, this would call an API
    console.log('Updating member:', member);
  }, []);

  const handleDeleteMember = useCallback((memberId: string) => {
    // In a real app, this would call an API
    console.log('Deleting member:', memberId);
  }, []);

  return {
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
  };
};