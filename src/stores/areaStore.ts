import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export interface AreaData {
  id: string;
  x: number; // vw
  y: number; // vh
  width: number; // vw
  height: number; // vh
  // 필요에 따라 다른 속성 추가 (e.g., zIndex, content, etc.)
}

interface AreaStoreState {
  areas: AreaData[];
  addArea: (areaConfig: Omit<AreaData, 'id'>) => void;
  updateArea: (id: string, updates: Partial<Omit<AreaData, 'id'>>) => void;
  removeArea: (id: string) => void;
  // 초기 Area 레이아웃 설정 함수
  initializeAreas: (initialAreas: Omit<AreaData, 'id'>[]) => void;
}

export const useAreaStore = create<AreaStoreState>((set) => ({
  areas: [],
  addArea: (areaConfig) =>
    set((state) => ({
      areas: [...state.areas, { ...areaConfig, id: uuidv4() }],
    })),
  updateArea: (id, updates) =>
    set((state) => ({
      areas: state.areas.map((area) =>
        area.id === id ? { ...area, ...updates } : area
      ),
    })),
  removeArea: (id) =>
    set((state) => ({
      areas: state.areas.filter((area) => area.id !== id),
    })),
  initializeAreas: (initialAreas) => 
    set(() => ({
      areas: initialAreas.map(area => ({ ...area, id: uuidv4() }))
    })),
}));

// 초기 Area 데이터 (App.tsx에서 가져온 데이터 기반)
export const initialAreaConfigs: Omit<AreaData, 'id'>[] = [
  { x: 0, y: 0, width: 16, height: 50 },
  { x: 16, y: 0, width: 34, height: 25 },
  { x: 16, y: 25, width: 34, height: 25 },
  { x: 0, y: 50, width: 33, height: 50 },
  { x: 33, y: 50, width: 17, height: 50 },
  { x: 50, y: 0, width: 16, height: 33 },
  { x: 50, y: 33, width: 16, height: 67 },
  { x: 66, y: 0, width: 17, height: 50 },
  { x: 83, y: 0, width: 17, height: 50 },
  { x: 66, y: 50, width: 34, height: 50 },
];
