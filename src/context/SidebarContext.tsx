import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';

type SidebarState = {
  isExpanded: boolean;
  activeItem: string | null;
  expandedItems: string[];
};

type SidebarContextType = SidebarState & {
  toggleSidebar: () => void;
  setActiveItem: (itemId: string) => void;
  toggleExpandItem: (itemId: string) => void;
  isItemExpanded: (itemId: string) => boolean;
  isItemActive: (itemId: string) => boolean;
  closeSidebar: () => void; // For mobile view
};

const initialState: SidebarState = {
  isExpanded: true, // Default expanded on desktop
  activeItem: null,
  expandedItems: [],
};

export const SidebarContext = createContext<SidebarContextType>({
  ...initialState,
  toggleSidebar: () => {},
  setActiveItem: () => {},
  toggleExpandItem: () => {},
  isItemExpanded: () => false,
  isItemActive: () => false,
  closeSidebar: () => {},
});

interface SidebarProviderProps {
  children: ReactNode;
  defaultExpanded?: boolean;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ 
  children,
  defaultExpanded = true 
}) => {
  // Initialize state from localStorage or default values
  const [state, setState] = useState<SidebarState>(() => {
    const savedState = localStorage.getItem('sidebar-state');
    if (savedState) {
      return JSON.parse(savedState);
    }
    return {
      isExpanded: defaultExpanded,
      activeItem: null,
      expandedItems: [],
    };
  });
  
  // Save state changes to localStorage
  useEffect(() => {
    localStorage.setItem('sidebar-state', JSON.stringify(state));
  }, [state]);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // Collapse sidebar on small screens by default
        setState(prev => ({ ...prev, isExpanded: false }));
      }
    };

    // Set initial state based on screen size
    handleResize();

    // Update on window resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = useCallback(() => {
    setState(prev => ({ ...prev, isExpanded: !prev.isExpanded }));
  }, []);

  const closeSidebar = useCallback(() => {
    setState(prev => ({ ...prev, isExpanded: false }));
  }, []);

  const setActiveItem = useCallback((itemId: string) => {
    setState(prev => ({ ...prev, activeItem: itemId }));
  }, []);

  const toggleExpandItem = useCallback((itemId: string) => {
    setState(prev => {
      const isCurrentlyExpanded = prev.expandedItems.includes(itemId);
      
      // If currently expanded, remove from list
      if (isCurrentlyExpanded) {
        return {
          ...prev,
          expandedItems: prev.expandedItems.filter(id => id !== itemId)
        };
      } 
      
      // If not expanded, add to list
      return {
        ...prev,
        expandedItems: [...prev.expandedItems, itemId]
      };
    });
  }, []);

  const isItemExpanded = useCallback((itemId: string) => {
    return state.expandedItems.includes(itemId);
  }, [state.expandedItems]);

  const isItemActive = useCallback((itemId: string) => {
    return state.activeItem === itemId;
  }, [state.activeItem]);

  const contextValue = {
    ...state,
    toggleSidebar,
    setActiveItem,
    toggleExpandItem,
    isItemExpanded,
    isItemActive,
    closeSidebar,
  };

  return (
    <SidebarContext.Provider value={contextValue}>
      {children}
    </SidebarContext.Provider>
  );
};

// Custom hook for easier context usage
export const useSidebar = () => {
  const context = React.useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};