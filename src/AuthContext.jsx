/* import { createContext, useContext } from 'react';

// App.jsx가 Provider를 사용할 수 있도록 export
export const AuthContext = createContext(null);

// 다른 컴포넌트(Layout, Login 등)가 훅을 사용할 수 있도록 export
export const useAuth = () => {
    return useContext(AuthContext);
}; */

// import React, { createContext, useContext, useState, useEffect } from 'react';
import { createContext, useContext } from 'react';
// API URL (백엔드 친구와 맞춘 URL로 수정하세요)
export const FAKE_API_URL = '/api';
// [추가] 카카오맵 API 키 (반드시 본인의 키로 교체해야 합니다!)
export const KAKAO_APP_KEY = 'YOUR_KAKAO_APP_KEY'; // <--- !!! 중요: 이 부분을 본인 키로 바꾸세요 !!!

// --- [AuthContext.jsx] 시작 ---
// [수정] App 컴포넌트가 사용해야 하므로, 이 파일의 최상단에 정의되어야 합니다.
export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
