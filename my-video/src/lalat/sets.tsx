import React from "react";

const full: React.CSSProperties = { position: "absolute", left: 0, top: 0 };

// Dining table seen from the front at eye level: back edge at `top`, planks converging away from the camera,
// a glass of tea and a plate of fried snacks (what the fly is after).
export const TableTop: React.FC<{ top?: number; props?: boolean }> = ({ top = 1100, props = true }) => {
  const vx = 540;
  const ys = [0, 1, 2, 3, 4, 5, 6].map((i) => top + 40 * i + 18 * i * i);
  return (
    <svg width={1080} height={1920} style={full}>
      <defs>
        <linearGradient id="ttwood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#B07A4E" /><stop offset="1" stopColor="#7E5232" /></linearGradient>
        <linearGradient id="ttglass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#fff" stopOpacity={0.55} /><stop offset="0.5" stopColor="#fff" stopOpacity={0.15} /><stop offset="1" stopColor="#fff" stopOpacity={0.45} /></linearGradient>
      </defs>
      <rect x={-20} y={top} width={1120} height={1920 - top} fill="url(#ttwood)" />
      {[-900, -500, -150, 150, 500, 900, 1300, 1700, -1300].map((x) => (
        <line key={x} x1={vx + (x - vx) * 0.08} y1={top} x2={x} y2={1920 + 400} stroke="#6B4429" strokeWidth={3} opacity={0.35} transform={`translate(0 0)`} />
      ))}
      {ys.map((y, i) => <path key={i} d={`M${100 + i * 70} ${y + 30} q60 -6 120 0`} stroke="#6B4429" strokeWidth={2} fill="none" opacity={0.25} />)}
      <rect x={-20} y={top - 6} width={1120} height={14} fill="#C8925F" />
      <rect x={-20} y={top + 8} width={1120} height={10} fill="#000" opacity={0.12} />
      {props ? (
        <>
          {/* glass of iced tea, back left */}
          <ellipse cx={170} cy={top + 46} rx={70} ry={12} fill="#000" opacity={0.15} />
          <path d={`M110 ${top - 170} L230 ${top - 170} L218 ${top + 40} L122 ${top + 40} Z`} fill="#C9782E" opacity={0.85} />
          <path d={`M110 ${top - 170} L230 ${top - 170} L218 ${top + 40} L122 ${top + 40} Z`} fill="url(#ttglass)" />
          <ellipse cx={170} cy={top - 170} rx={60} ry={10} fill="#E9A45A" stroke="#fff" strokeOpacity={0.6} strokeWidth={3} />
          {[[150, -130], [185, -100], [160, -60]].map(([x, y], i) => <rect key={i} x={x - 18} y={top + y - 16} width={34} height={30} rx={6} fill="#fff" opacity={0.35} transform={`rotate(${i * 20 - 10} ${x} ${top + y})`} />)}
          {/* plate of gorengan, back right */}
          <ellipse cx={850} cy={top + 50} rx={170} ry={34} fill="#000" opacity={0.15} />
          <ellipse cx={850} cy={top + 34} rx={170} ry={36} fill="#F4F1EA" />
          <ellipse cx={850} cy={top + 30} rx={120} ry={22} fill="#E4DFD3" />
          {[[790, 6], [860, -4], [920, 8], [835, 20]].map(([x, y], i) => (
            <g key={i}>
              <ellipse cx={x} cy={top + y} rx={48} ry={22} fill={["#D99A3E", "#C98330", "#E2A64C", "#CF8D36"][i]} />
              <ellipse cx={x - 10} cy={top + y - 7} rx={22} ry={6} fill="#fff" opacity={0.25} />
            </g>
          ))}
        </>
      ) : null}
    </svg>
  );
};

// The same table seen from straight above (diagrams): planks, a plate in a corner.
export const TableDown: React.FC = () => (
  <svg width={1080} height={1920} style={full}>
    <rect width={1080} height={1920} fill="#A8744A" />
    {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={i * 190 - 30} y={0} width={6} height={1920} fill="#7E5232" opacity={0.5} />)}
    {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${40 + (i % 6) * 190} ${80 + i * 140} q40 -20 90 0 t90 0`} stroke="#7E5232" strokeWidth={3} fill="none" opacity={0.3} />)}
    <circle cx={190} cy={1590} r={190} fill="#000" opacity={0.12} />
    <circle cx={180} cy={1580} r={180} fill="#F4F1EA" />
    <circle cx={180} cy={1580} r={130} fill="#E4DFD3" />
    {[[140, 1540], [220, 1590], [160, 1630]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={50} ry={34} fill={["#D99A3E", "#C98330", "#E2A64C"][i]} />)}
  </svg>
);
