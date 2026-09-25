import React, { useEffect, useRef, useState } from 'react';

export type VortexDensity = 'dense' | 'ultra' | 'compact';

export interface BinaryVortexCanvasProps {
  /** Overall opacity (0 to 1) */
  opacity?: number;
  /** Speed multiplier (0.6 = chill, 1 = normal, 1.6 = hyper) */
  speed?: number;
  /** Closeness/density of 0s and 1s */
  density?: VortexDensity;
  /** Extra CSS classes */
  className?: string;
  /** Interactive mouse perturbation */
  interactive?: boolean;
  /** Watermark style replacing shutterstock: 'full-stack' | 'prominent' | 'stealth' */
  watermarkStyle?: 'full-stack' | 'prominent' | 'stealth';
  /** Whether the 3D vortex rotation is actively spinning with ease */
  isRotating?: boolean;
}

interface RainDrop {
  y: number; // Current head row index
  speed: number; // Row advancement per tick
  length: number; // Stream length in characters
  chars: string[]; // Characters in the drop stream
  flashes: number[]; // Flash highlights for bit flips
  lastUpdate: number;
}

interface RainColumn {
  x: number;
  drops: RainDrop[];
}

interface VortexNode {
  col: number;
  ring: number;
  char: '0' | '1';
  flash: number;
}

export const BinaryVortexCanvas: React.FC<BinaryVortexCanvasProps> = ({
  opacity = 0.92,
  speed = 1,
  density = 'dense',
  className = '',
  interactive = true,
  watermarkStyle = 'full-stack',
  isRotating = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  // Mouse tracking with smooth spring easing
  const mouseRef = useRef({
    currentX: 0,
    currentY: 0,
    targetX: 0,
    targetY: 0,
    mouseX: -9999,
    mouseY: -9999,
  });

  // Track viewport intersection
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.01 }
    );
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    // Spacing configuration for dense 0s and 1s
    const densityConfigs: Record<
      VortexDensity,
      {
        colSpacing: number;
        rowHeight: number;
        fontSize: number;
        vortexCols: number;
        vortexRings: number;
        minLen: number;
        maxLen: number;
      }
    > = {
      ultra: {
        colSpacing: 11,
        rowHeight: 13,
        fontSize: 11,
        vortexCols: 48,
        vortexRings: 36,
        minLen: 16,
        maxLen: 34,
      },
      dense: {
        colSpacing: 13.5,
        rowHeight: 15.5,
        fontSize: 12.5,
        vortexCols: 40,
        vortexRings: 30,
        minLen: 14,
        maxLen: 30,
      },
      compact: {
        colSpacing: 16,
        rowHeight: 18,
        fontSize: 13.5,
        vortexCols: 32,
        vortexRings: 24,
        minLen: 12,
        maxLen: 24,
      },
    };

    const cfg = densityConfigs[density] || densityConfigs.dense;
    const { colSpacing, rowHeight, fontSize, vortexCols, vortexRings, minLen, maxLen } = cfg;

    let width = 0;
    let height = 0;
    let totalRows = 0;
    let columns: RainColumn[] = [];

    // Helper: create a rain drop stream of 0s and 1s
    const createDrop = (initialRow: number): RainDrop => {
      const length = Math.floor(minLen + Math.random() * (maxLen - minLen));
      const chars: string[] = [];
      const flashes: number[] = [];
      for (let i = 0; i < length; i++) {
        chars.push(Math.random() > 0.5 ? '1' : '0');
        flashes.push(0);
      }
      return {
        y: initialRow,
        speed: 0.38 + Math.random() * 0.42,
        length,
        chars,
        flashes,
        lastUpdate: 0,
      };
    };

    // Vortex 3D nodes
    const vortexNodes: VortexNode[] = [];
    for (let r = 0; r < vortexRings; r++) {
      for (let c = 0; c < vortexCols; c++) {
        vortexNodes.push({
          col: c,
          ring: r,
          char: Math.random() > 0.5 ? '1' : '0',
          flash: 0,
        });
      }
    }

    const initGrid = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = Math.max(rect.height, 1200);
      totalRows = Math.ceil(height / rowHeight);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // Create densely packed columns across the entire width
      const numCols = Math.floor(width / colSpacing);
      columns = [];

      for (let i = 0; i < numCols; i++) {
        const x = i * colSpacing + colSpacing / 2;
        // Seed multiple drops staggered along the column so 0s and 1s drop continuously
        const drops: RainDrop[] = [];
        const numDrops = 3;
        const segment = totalRows / numDrops;

        for (let d = 0; d < numDrops; d++) {
          const initialY = -Math.random() * 25 + d * segment;
          drops.push(createDrop(initialY));
        }

        columns.push({ x, drops });
      }
    };

    initGrid();
    const resizeObserver = new ResizeObserver(initGrid);
    resizeObserver.observe(container);

    // Ease-based rotation state
    let rotationAngle = 0;
    let currentAngularVelocity = 0.007;
    let targetAngularVelocity = 0.007;
    let wavePhase = 0;

    const render = (currentTime: number) => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const dt = Math.min((currentTime - lastTime) / 1000, 0.08);
      lastTime = currentTime;

      // 1. Rotation with Ease physics
      if (isRotating) {
        targetAngularVelocity = 0.008 * speed;
      } else {
        targetAngularVelocity = 0;
      }
      currentAngularVelocity += (targetAngularVelocity - currentAngularVelocity) * 0.05;

      wavePhase += dt * 1.3;
      const easeWave = Math.sin(wavePhase) * 0.0018 * speed;
      rotationAngle += currentAngularVelocity + easeWave;

      // 2. Mouse Parallax Easing
      const mouse = mouseRef.current;
      mouse.currentX += (mouse.targetX - mouse.currentX) * 0.06;
      mouse.currentY += (mouse.targetY - mouse.currentY) * 0.06;

      // 3. Viewport Culling calculation (draw only visible slice to stay at 60 FPS)
      const rect = container.getBoundingClientRect();
      const viewTop = Math.max(0, -rect.top - 150);
      const viewBottom = Math.min(height, -rect.top + window.innerHeight + 150);

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // Deep dark cyber background fill
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      // Subtle radial cyber glow in the upper area where rotation is taking place
      const vortexCenterX = width / 2 + mouse.currentX * 30;
      const vortexCenterY = Math.min(height * 0.16 + 180, 420) + mouse.currentY * 20;

      if (vortexCenterY + 400 >= viewTop && vortexCenterY - 400 <= viewBottom) {
        const glowGrad = ctx.createRadialGradient(
          vortexCenterX,
          vortexCenterY,
          10,
          vortexCenterX,
          vortexCenterY,
          Math.min(width, 700) * 0.8
        );
        glowGrad.addColorStop(0, 'rgba(5, 46, 22, 0.45)');
        glowGrad.addColorStop(0.35, 'rgba(6, 78, 59, 0.22)');
        glowGrad.addColorStop(0.7, 'rgba(2, 6, 23, 0.55)');
        glowGrad.addColorStop(1, 'rgba(2, 6, 23, 0)');

        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, Math.max(0, vortexCenterY - 450), width, 900);
      }

      // ========================================================================
      // 1. DENSE 0s AND 1s DROPPING DOWN FROM ABOVE (Continuous Raining Matrix)
      // ========================================================================
      ctx.font = `700 ${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const tickSpeed = speed * 1.05;

      for (let c = 0; c < columns.length; c++) {
        const col = columns[c];

        for (let d = 0; d < col.drops.length; d++) {
          const drop = col.drops[d];

          // Advance head of the drop downwards
          drop.y += drop.speed * tickSpeed;

          // If the tail has fallen past the bottom of the section, recycle back above the top
          if (drop.y - drop.length > totalRows) {
            drop.y = -Math.random() * 20 - 5;
            drop.speed = 0.38 + Math.random() * 0.42;
            drop.length = Math.floor(minLen + Math.random() * (maxLen - minLen));
          }

          // Random bit mutation (0 flips to 1, 1 flips to 0 as they drop down)
          if (Math.random() < 0.08 * speed) {
            const flipIdx = Math.floor(Math.random() * drop.chars.length);
            drop.chars[flipIdx] = drop.chars[flipIdx] === '0' ? '1' : '0';
            drop.flashes[flipIdx] = 1.0; // Flash bright on flip
          }

          // Render visible characters of this falling drop
          const headRow = Math.floor(drop.y);

          for (let i = 0; i < drop.length; i++) {
            const charRow = headRow - i;
            if (charRow < 0) continue;

            const charY = charRow * rowHeight + rowHeight / 2;

            // Viewport culling: only draw if inside visible scroll window
            if (charY < viewTop || charY > viewBottom) continue;

            // Decay flash highlight
            if (drop.flashes[i] > 0) {
              drop.flashes[i] = Math.max(0, drop.flashes[i] - dt * 3);
            }

            const char = drop.chars[i] || (Math.random() > 0.5 ? '1' : '0');

            if (i === 0) {
              // HEAD OF FALLING STREAM: brilliant luminous white/mint
              ctx.shadowColor = '#86efac';
              ctx.shadowBlur = 10;
              ctx.fillStyle = `rgba(255, 255, 255, ${0.98 * opacity})`;
              ctx.fillText(char, col.x, charY);
              ctx.shadowBlur = 0;
            } else if (drop.flashes[i] > 0.1) {
              // BIT JUST FLIPPED: bright flash
              ctx.shadowColor = '#6ee7b7';
              ctx.shadowBlur = 8;
              ctx.fillStyle = `rgba(209, 250, 229, ${Math.min(1, (0.7 + drop.flashes[i] * 0.3) * opacity)})`;
              ctx.fillText(char, col.x, charY);
              ctx.shadowBlur = 0;
            } else {
              // BODY & TAIL: Matrix emerald green fading gently along the tail
              const tailFactor = 1 - i / drop.length;
              const alpha = (0.2 + tailFactor * 0.72) * opacity;

              if (char === '1') {
                ctx.fillStyle = `rgba(52, 211, 153, ${alpha})`;
              } else {
                ctx.fillStyle = `rgba(16, 185, 129, ${alpha * 0.88})`;
              }
              ctx.fillText(char, col.x, charY);
            }
          }
        }
      }

      // ========================================================================
      // 2. 3D ROTATING BINARY VORTEX TUNNEL (The "Above Where Rotation is Taking Place")
      // ========================================================================
      // Render vortex only when its vertical region is within or near viewport
      const vortexTop = vortexCenterY - 380;
      const vortexBottom = vortexCenterY + 380;

      if (vortexBottom >= viewTop && vortexTop <= viewBottom) {
        // Bit flipping in 3D vortex
        const flips = Math.floor(vortexNodes.length * 0.04 * speed);
        for (let i = 0; i < flips; i++) {
          const randIdx = Math.floor(Math.random() * vortexNodes.length);
          const node = vortexNodes[randIdx];
          node.char = node.char === '0' ? '1' : '0';
          node.flash = 1.0;
        }

        // Perspective parameters
        const fov = 400;
        const maxRadius = Math.min(width, 850) * 0.44;
        const minRadius = maxRadius * 0.18;

        interface VortexPoint {
          x: number;
          y: number;
          scale: number;
          depthZ: number;
          char: '0' | '1';
          flash: number;
          ring: number;
          col: number;
        }

        const pts: VortexPoint[] = [];

        for (let r = 0; r < vortexRings; r++) {
          const zNorm = r / (vortexRings - 1);
          const depthZ = 120 + Math.pow(zNorm, 1.4) * 900;
          const scale = fov / (fov + depthZ);
          const radius = maxRadius - Math.pow(zNorm, 0.8) * (maxRadius - minRadius);

          for (let c = 0; c < vortexCols; c++) {
            const idx = r * vortexCols + c;
            const node = vortexNodes[idx];
            if (node.flash > 0) {
              node.flash = Math.max(0, node.flash - dt * 3);
            }

            const baseAngle = (c / vortexCols) * Math.PI * 2;
            const spiralTwist = zNorm * 1.2;
            const currentAngle = baseAngle + rotationAngle + spiralTwist;

            const worldX = Math.cos(currentAngle) * radius;
            const worldY = Math.sin(currentAngle) * radius * 0.72; // subtle elliptical perspective

            const projX = vortexCenterX + worldX * scale;
            const projY = vortexCenterY + worldY * scale;

            pts.push({
              x: projX,
              y: projY,
              scale,
              depthZ,
              char: node.char,
              flash: node.flash,
              ring: r,
              col: c,
            });
          }
        }

        // Sort by depth (back to front)
        pts.sort((a, b) => b.depthZ - a.depthZ);

        // 2A. Concentric 3D Wireframe Rings
        for (let r = 0; r < vortexRings; r += 2) {
          const ringPts = pts.filter((p) => p.ring === r).sort((a, b) => a.col - b.col);
          if (ringPts.length > 2) {
            const zNorm = r / (vortexRings - 1);
            const ringAlpha = (1 - zNorm * 0.75) * 0.18 * opacity;

            ctx.beginPath();
            ctx.strokeStyle = `rgba(16, 185, 129, ${ringAlpha})`;
            ctx.lineWidth = Math.max(0.6, 1.1 * (1 - zNorm));
            ctx.moveTo(ringPts[0].x, ringPts[0].y);
            for (let i = 1; i < ringPts.length; i++) {
              ctx.lineTo(ringPts[i].x, ringPts[i].y);
            }
            ctx.closePath();
            ctx.stroke();
          }
        }

        // 2B. 3D Vortex 0s and 1s
        for (const pt of pts) {
          const vFontSize = Math.max(8, Math.min(22, Math.floor(fontSize * pt.scale * 2.3)));
          ctx.font = `700 ${vFontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;

          const depthFactor = Math.max(0.2, Math.min(1.0, pt.scale * 2.0));

          if (pt.flash > 0.05) {
            ctx.shadowColor = '#a7f3d0';
            ctx.shadowBlur = Math.floor(10 * pt.flash);
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, (0.6 + pt.flash * 0.4) * opacity)})`;
            ctx.fillText(pt.char, pt.x, pt.y);
            ctx.shadowBlur = 0;
          } else {
            const alpha = depthFactor * 0.9 * opacity;
            ctx.fillStyle = pt.char === '1' ? `rgba(52, 211, 153, ${alpha})` : `rgba(16, 185, 129, ${alpha * 0.85})`;
            ctx.fillText(pt.char, pt.x, pt.y);
          }
        }

        // ========================================================================
        // 3. WATERMARK: "FULL-STACK" REPLACING SHUTTERSTOCK
        // ========================================================================
        if (watermarkStyle !== 'stealth') {
          ctx.save();

          // 3A. Diagonal repeating "FULL-STACK" watermark pattern
          const wmAngle = -0.42;
          ctx.save();
          ctx.translate(vortexCenterX, vortexCenterY);
          ctx.rotate(wmAngle);

          const wmSpacingX = 220;
          const wmSpacingY = 150;
          const bound = 450;

          ctx.font = '700 12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          const wmOpacity = watermarkStyle === 'prominent' ? 0.22 : 0.12;
          ctx.fillStyle = `rgba(52, 211, 153, ${wmOpacity})`;

          for (let y = -bound; y <= bound; y += wmSpacingY) {
            const shift = (Math.abs(y / wmSpacingY) % 2) * (wmSpacingX / 2);
            for (let x = -bound; x <= bound; x += wmSpacingX) {
              ctx.fillText('FULL-STACK', x + shift, y);
            }
          }
          ctx.restore();

          // 3B. Central Glowing Watermark Emblem in the Vortex Horizon
          ctx.save();
          ctx.translate(vortexCenterX, vortexCenterY);

          // Rotating dashed cyber ring
          ctx.strokeStyle = `rgba(16, 185, 129, ${watermarkStyle === 'prominent' ? 0.38 : 0.22})`;
          ctx.lineWidth = 1.2;
          ctx.setLineDash([8, 6]);
          ctx.beginPath();
          ctx.arc(0, 0, 68, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);

          // Cyber brackets around central watermark
          const bSize = 58;
          ctx.strokeStyle = `rgba(52, 211, 153, ${watermarkStyle === 'prominent' ? 0.45 : 0.28})`;
          ctx.lineWidth = 1.4;

          // Top-left
          ctx.beginPath();
          ctx.moveTo(-bSize, -bSize + 12);
          ctx.lineTo(-bSize, -bSize);
          ctx.lineTo(-bSize + 12, -bSize);
          ctx.stroke();
          // Top-right
          ctx.beginPath();
          ctx.moveTo(bSize - 12, -bSize);
          ctx.lineTo(bSize, -bSize);
          ctx.lineTo(bSize, -bSize + 12);
          ctx.stroke();
          // Bottom-left
          ctx.beginPath();
          ctx.moveTo(-bSize, bSize - 12);
          ctx.lineTo(-bSize, bSize);
          ctx.lineTo(-bSize + 12, bSize);
          ctx.stroke();
          // Bottom-right
          ctx.beginPath();
          ctx.moveTo(bSize - 12, bSize);
          ctx.lineTo(bSize, bSize);
          ctx.lineTo(bSize, bSize - 12);
          ctx.stroke();

          // Main "FULL-STACK" text replacing shutterstock
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 14;
          ctx.font = '800 20px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
          ctx.letterSpacing = '3px';
          ctx.fillStyle = `rgba(209, 250, 229, ${watermarkStyle === 'prominent' ? 0.85 : 0.45})`;
          ctx.fillText('FULL-STACK', 0, -2);

          ctx.shadowBlur = 3;
          ctx.font = '600 9px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
          ctx.letterSpacing = '2px';
          ctx.fillStyle = `rgba(52, 211, 153, ${watermarkStyle === 'prominent' ? 0.75 : 0.4})`;
          ctx.fillText('ENGINEERING MATRIX', 0, 16);

          ctx.restore();
          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    // Interactive mouse movement handling via window
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      mouseRef.current.targetX = x * 2;
      mouseRef.current.targetY = y * 2;
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [density, speed, opacity, isRotating, watermarkStyle, interactive, isVisible]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden ${className}`}
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

export default BinaryVortexCanvas;
