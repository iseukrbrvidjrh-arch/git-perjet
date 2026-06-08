// 确定性伪随机生成的星空背景，覆盖整个页面（固定定位）
function buildStars(count: number) {
  const seeded = (n: number) => {
    const x = Math.sin(n) * 10000;
    return x - Math.floor(x);
  };
  return Array.from({ length: count }, (_, i) => ({
    top: (seeded(i + 1) * 100).toFixed(2),
    left: (seeded(i + 100) * 100).toFixed(2),
    size: (seeded(i + 200) * 2 + 1).toFixed(2),
    delay: (seeded(i + 300) * 4).toFixed(2),
    duration: (seeded(i + 400) * 3 + 2).toFixed(2),
  }));
}

const STARS = buildStars(120);

export default function StarrySky() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* 渐变星云 */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050816] via-[#0a0a2a] to-[#1a0b2e]" />
      <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-indigo-600/20 blur-[120px]" />
      <div className="absolute -right-32 top-1/2 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-[120px]" />
      <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-violet-600/20 blur-[120px]" />

      {/* 闪烁的星星 */}
      {STARS.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
