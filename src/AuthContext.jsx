import { createContext, useContext } from 'react';

// App.jsx가 Provider를 사용할 수 있도록 export
export const AuthContext = createContext(null);

// 다른 컴포넌트(Layout, Login 등)가 훅을 사용할 수 있도록 export
export const useAuth = () => {
    return useContext(AuthContext);
};

