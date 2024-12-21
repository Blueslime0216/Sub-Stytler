// ====================================================================================================
// Area 컴포넌트
// ====================================================================================================
// 모듈 관련
import React, { forwardRef } from "react";
// sys 관련
import $g, { genID } from "../$g";
// css
import "./area.css";
import { AreaEdgeController } from "./AreaController";

const Area = forwardRef<HTMLDivElement, IArea>((props, ref) => {
    const { id, x, y, width, height, x_tmp, y_tmp, width_tmp, height_tmp, isSelected, isMinimize, children } = props;
    const Thickness = $g.AreaBorderThickness;

    return (
        <div
            ref={ref} // ref 연결
            className={`area ${isSelected ? "selected" : ""} ${isMinimize ? "minimize" : ""}`}
            style={{
                top: $g.height * ((y + y_tmp!) / 10000),
                left: $g.width * ((x + x_tmp!) / 10000),
                width: $g.width * ((width + width_tmp!) / 10000),
                height: $g.height * ((height + height_tmp!) / 10000),
            }}
            data-id={id}
            data-type={'area'}
        >
            {/* 4방향 컨트롤러 */}
            <div data-type={'areaEdge'} className="edge top"    style={{height:Thickness}} onDrag={(e) => AreaEdgeController(e, id, "top" )}></div>
            <div data-type={'areaEdge'} className="edge right"  style={{width:Thickness}} onDrag={(e) => AreaEdgeController(e, id, "right" )}></div>
            <div data-type={'areaEdge'} className="edge bottom" style={{height:Thickness}} onDrag={(e) => AreaEdgeController(e, id, "bottom" )}></div>
            <div data-type={'areaEdge'} className="edge left"   style={{width:Thickness}} onDrag={(e) => AreaEdgeController(e, id, "left" )}></div>

            {/* 안에 담기는 모듈 */}
            {children}
        </div>
    );
});

export default Area;