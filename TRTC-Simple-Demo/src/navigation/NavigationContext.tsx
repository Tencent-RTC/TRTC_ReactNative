import React, { createContext, useContext, useState, ReactNode, useCallback, useRef } from 'react';

// Define route parameters type
export type RouteParams = {
    roomId?: string;
    userId?: string;
    type?: string;
    role?: number;
};

// Define route type
export type Route = {
    name: string;
    params?: RouteParams;
};

// Page leave callback type
export type BeforeRemoveCallback = () => void | Promise<void>;

// Navigation context type
type NavigationContextType = {
    currentRoute: Route;
    navigate: (routeName: string, params?: RouteParams) => void;
    goBack: () => void;
    routes: Route[];
    addBeforeRemoveListener: (callback: BeforeRemoveCallback) => () => void;
};

// Create navigation context
const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

// Navigation provider component
export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [routes, setRoutes] = useState<Route[]>([{ name: 'Navigation' }]);
    const [beforeRemoveCallbacks, setBeforeRemoveCallbacks] = useState<BeforeRemoveCallback[]>([]);
    const isNavigatingRef = useRef(false);

    const navigate = (routeName: string, params?: RouteParams) => {
        setRoutes(prev => [...prev, { name: routeName, params }]);
    };

    const goBack = useCallback(async () => {
        // Prevent duplicate execution
        if (isNavigatingRef.current) {
            return;
        }

        isNavigatingRef.current = true;

        try {
            // Execute all beforeRemove callbacks
            for (const callback of beforeRemoveCallbacks) {
                try {
                    await callback();
                } catch (error) {
                    console.error('BeforeRemove callback error:', error);
                }
            }
        } finally {
            // Clear callback list
            setBeforeRemoveCallbacks([]);

            // Execute back operation
            setRoutes(prev => {
                if (prev.length > 1) {
                    return prev.slice(0, -1);
                }
                return prev;
            });

            // Reset navigation state
            isNavigatingRef.current = false;
        }
    }, [beforeRemoveCallbacks]);

    const addBeforeRemoveListener = useCallback((callback: BeforeRemoveCallback) => {
        setBeforeRemoveCallbacks(prev => [...prev, callback]);

        // Return function to remove listener
        return () => {
            setBeforeRemoveCallbacks(prev => prev.filter(cb => cb !== callback));
        };
    }, []);

    const currentRoute = routes[routes.length - 1];

    return (
        <NavigationContext.Provider value={{
            currentRoute,
            navigate,
            goBack,
            routes,
            addBeforeRemoveListener
        }}>
            {children}
        </NavigationContext.Provider>
    );
};

// Navigation hook
export const useNavigation = () => {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error('useNavigation must be used within a NavigationProvider');
    }
    return context;
};

// Route hook
export const useRoute = () => {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error('useRoute must be used within a NavigationProvider');
    }
    return context.currentRoute;
}; 