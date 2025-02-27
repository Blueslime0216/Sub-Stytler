// ====================================================================================================
// 프로젝트에서 사용할 타입 정의
// ====================================================================================================

interface AreaProps extends Custom_Class_Setup {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    temp_x?: number;
    temp_y?: number;
    temp_width?: number;
    temp_height?: number;
    is_resizable: boolean;
    is_splitable: boolean;
    is_joinable: boolean;
}
  
interface BorderProps extends Custom_Class_Setup {
    id: string;
    side: 'top'|'bottom'|'left'|'right';
    x: number;
    y: number;
    size: number;
    temp_x?: number;
    temp_y?: number;
    temp_size?: number;
    area: string;
}
  
interface State {
    isResizing: boolean;
    activeBorder: string | null;
    areas: Map<string, AreaProps>;
    borders: Map<string, BorderProps>;
}

// interface EventTarget extends EventTarget {
//     id?: string;
// }
interface Custom_Class_Setup {
    id?: string;

    mousedown?: (event: MouseEvent) => void;
}