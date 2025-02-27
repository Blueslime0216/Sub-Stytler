// ====================================================================================================
// 전체 윈도우 상태 및 데이터 관리
// ====================================================================================================
export const state = {
    isResizing: false,
    activeBorder: null as string | null,
    areas: new Map<string, { 
      x: number; 
      y: number; 
      width: number; 
      height: number; 
      is_resizable: boolean; 
      is_splitable: boolean; 
      is_joinable: boolean; 
    }>(),
    borders: new Map<string, { 
      id: string; 
      direction: 'Vertical' | 'Horizontal'; 
      x: number; 
      y: number; 
      size: number; 
      areaA: string; 
      areaB: string; 
    }>(),
};
  