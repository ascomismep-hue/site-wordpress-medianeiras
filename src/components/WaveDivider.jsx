export default function WaveDivider({ position = "bottom", color = "fill-white", inverted = false }) {
  return (
    <div className={`w-full overflow-hidden leading-none pointer-events-none z-20 relative ${position === "top" ? "rotate-180 -mb-1" : "-mt-1"}`}>
      <style>{`
        @keyframes waveDeepMove {
          0% { transform: translateX(0); }
          50% { transform: translateX(-35%); }
          100% { transform: translateX(0); }
        }
        .animate-wave-global {
          animation: waveDeepMove 16s ease-in-out infinite;
        }
      `}</style>
      
      <div className="w-[200%] animate-wave-global">
        <svg 
          className={`relative block w-full h-12 sm:h-20 ${color}`} 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path d={inverted ? "M0,120 C150,30 350,160 500,70 C650,-20 900,150 1200,80 L1200,120 L0,120 Z" : "M0,0 C150,90 350,-40 500,50 C650,140 900,-30 1200,40 L1200,0 L0,0 Z"}></path>
        </svg>
      </div>
    </div>
  );
}
