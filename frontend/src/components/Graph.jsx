import React, { useState, useRef } from 'react';
import './Graph.css';

function Graph({ points = [], r = 1, onPointClick }) {
    const svgRef = useRef(null);
    const [hoverCoords, setHoverCoords] = useState(null);

    const screenToSystem = (screenX, screenY) => {
        const svg = svgRef.current;
        if (!svg) return { x: 0, y: 0 };

        const point = svg.createSVGPoint();
        point.x = screenX;
        point.y = screenY;

        const svgPoint = point.matrixTransform(svg.getScreenCTM().inverse());

        const systemX = (svgPoint.x - 100) / 20;
        const systemY = (100 - svgPoint.y) / 20;

        return { x: systemX, y: systemY };
    };

    const systemToScreen = (systemX, systemY) => {
        const scale = 20;
        const screenX = 100 + systemX * scale;
        const screenY = 100 - systemY * scale;
        return { x: screenX, y: screenY };
    };

    const handleClick = (event) => {
        if (!onPointClick) return;
        const { x, y } = screenToSystem(event.clientX, event.clientY);
        onPointClick(x, y);
    };

    const handleMouseMove = (event) => {
        const { x, y } = screenToSystem(event.clientX, event.clientY);

        console.log(hoverCoords)
        setHoverCoords({
            x: x.toFixed(2),
            y: y.toFixed(2)
        });
        console.log(hoverCoords)
    };

    const renderGrid = () => {
        const lines = [];
        const cellSize = 20;
        const offsetX = 100;

        for (let i = -5; i <= 5; i++) {
            const x = offsetX + i * cellSize;
            lines.push(
                <line key={`grid_v_${i}`} x1={x} y1="0" x2={x} y2="200" stroke="#e8e8e8" strokeWidth="1"/>
            );
        }

        for (let i = -5; i <= 5; i++) {
            const y = 100 - i * cellSize;
            lines.push(
                <line key={`grid_h_${i}`} x1="0" y1={y} x2="200" y2={y} stroke="#e8e8e8" strokeWidth="1"/>
            );
        }
        return lines;
    };

    const renderAxes = () => {
        const cellSize = 20;
        const offsetX = 100;

        return (
            <>
                <line x1="0" y1="100" x2="200" y2="100" stroke="black" strokeWidth="2"/>

                <line x1={offsetX} y1="0" x2={offsetX} y2="200" stroke="black" strokeWidth="2"/>

                {[-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].map(i => {
                    const xPos = offsetX + i * cellSize;
                    const yPos = 100 - i * cellSize;

                    return (
                        <g key={`tick_${i}`}>
                            {/* X деления и подписи */}
                            <line x1={xPos} y1="98" x2={xPos} y2="102" stroke="black"/>
                            <text x={xPos} y="120" textAnchor="middle" fontSize="11">{i}</text>

                            <line x1={offsetX - 2} y1={yPos} x2={offsetX + 2} y2={yPos} stroke="black"/>
                            <text x={offsetX - 12} y={yPos + 3} textAnchor="end" fontSize="11">{i}</text>
                        </g>
                    );
                })}
            </>
        );
    };

    const renderArea = () => {
        if (r <= 0) return null;

        const offsetX = 100;

        return (
            <>
                <polygon points={`${offsetX},${100 - r * 20} ${offsetX - r * 20},100 ${offsetX},100`}
                         fill="rgba(100, 149, 237, 0.3)" stroke="#6495ED" strokeWidth="1.5"/>

                <rect x={offsetX - (r/2) * 20} y="100" width={(r/2) * 20} height={r * 20}
                      fill="rgba(144, 238, 144, 0.3)" stroke="#90EE90" strokeWidth="1.5"/>

                <path d={`M ${offsetX} 100 L ${offsetX + r * 20} 100 A ${r * 20} ${r * 20} 0 0 1 ${offsetX} ${100 + r * 20} Z`}
                      fill="rgba(255, 182, 193, 0.3)" stroke="#FFB6C1" strokeWidth="1.5"/>
            </>
        );
    };

    const renderPoints = () => {
        return points.map((point, index) => {
            const { x: screenX, y: screenY } = systemToScreen(point.x, point.y);
            return (
                <circle
                    key={index}
                    cx={screenX}
                    cy={screenY}
                    r="3"
                    fill={point.hit ? "#4CAF50" : "#F44336"}
                    stroke={point.hit ? "#2E7D32" : "#C62828"}
                    strokeWidth="1"
                >
                    <title>
                        Точка ({point.x.toFixed(2)}, {point.y.toFixed(2)}),
                        R = {point.r},
                        {point.hit ? ' попала' : ' не попала'}
                    </title>
                </circle>
            );
        });
    };

    return (
        <div className="graph-container">
            <h3>График области (R = {r})</h3>

            {hoverCoords && (
                <div className="coordinates-hint">
                    Координаты: X = {hoverCoords.x}, Y = {hoverCoords.y}
                </div>
            )}

            <svg
                ref={svgRef}
                width="200"
                height="200"
                viewBox="-10 -10 220 220"
                onClick={handleClick}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setHoverCoords(null)}
                className="graph-svg"
                style={{ overflow: 'visible' }}
            >
                {renderGrid()}
                {renderArea()}
                {renderAxes()}
                {renderPoints()}
            </svg>

            <div className="legend">
                <div className="legend-item">
                    <div className="legend-color hit"></div>
                    <span>Точка попала в область</span>
                </div>
                <div className="legend-item">
                    <div className="legend-color miss"></div>
                    <span>Точка не попала в область</span>
                </div>
            </div>
        </div>
    );
}

export default Graph;
