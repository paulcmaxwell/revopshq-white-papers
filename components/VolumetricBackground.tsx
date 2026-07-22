'use client';

import { useEffect, useRef } from 'react';

/**
 * A slow, living mesh-gradient field rendered with a WebGL fragment shader —
 * soft emerald/mint light centers drifting over paper. Motion is calm but
 * clearly present (blob orbits ~12–20s). Reads the live --paper / --mint /
 * --accent / --accent-2 tokens (adapts to light/dark), honors reduced-motion
 * (static frame), and hides itself if WebGL is unavailable (CSS fallback shows).
 */
export default function VolumetricBackground({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const glCtx = canvas.getContext('webgl', { antialias: true, alpha: false });
    if (!glCtx) {
      canvas.style.display = 'none';
      return;
    }
    const gl: WebGLRenderingContext = glCtx;
    const cv: HTMLCanvasElement = canvas;

    const vsrc = `attribute vec2 p; void main(){ gl_Position = vec4(p,0.0,1.0); }`;
    const fsrc = `
      precision highp float;
      uniform float u_time; uniform vec2 u_res;
      uniform vec3 u_paper, u_mint, u_accent, u_deep;
      // soft gaussian influence of a moving center
      float blob(vec2 p, vec2 c, float k){ vec2 d = p - c; return exp(-k*dot(d,d)); }
      void main(){
        vec2 uv = gl_FragCoord.xy / u_res.xy;
        float ar = u_res.x / max(u_res.y, 1.0);
        vec2 p = vec2(uv.x * ar, uv.y);
        float t = u_time * 0.32;                 // clearly-moving but calm
        vec2 c0 = vec2(0.28*ar + 0.20*sin(t*0.90),        0.62 + 0.16*cos(t*0.80));
        vec2 c1 = vec2(0.74*ar + 0.18*cos(t*0.70 + 1.0),  0.34 + 0.18*sin(t*1.10));
        vec2 c2 = vec2(0.52*ar + 0.24*sin(t*0.55 + 2.0),  0.86 + 0.12*cos(t*0.65));
        vec2 c3 = vec2(0.90*ar + 0.16*sin(t*1.20 + 3.0),  0.70 + 0.16*cos(t*0.95 + 2.0));
        float k = 7.0;
        // Restrained: mostly tonal light/shade drift (so the MOTION reads),
        // with only a whisper of green. Not a green wash.
        vec3 shade = mix(u_paper, u_deep, 0.10);   // faint cool shade for tonal depth
        vec3 col = u_paper;
        col = mix(col, shade,   clamp(blob(p,c0,k)*0.85, 0.0, 0.55));
        col = mix(col, u_mint,  clamp(blob(p,c1,k*1.1)*0.30, 0.0, 0.22));  // hint of green
        col = mix(col, shade,   clamp(blob(p,c2,k*0.85)*0.7, 0.0, 0.45));
        col = mix(col, u_mint,  clamp(blob(p,c3,k*1.2)*0.18, 0.0, 0.13));
        // keep the top band clean for the masthead type
        col = mix(col, u_paper, smoothstep(0.28, 1.0, uv.y) * 0.42);
        gl_FragColor = vec4(col, 1.0);
      }`;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vsrc));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fsrc));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      canvas.style.display = 'none';
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_res');
    const uPaper = gl.getUniformLocation(prog, 'u_paper');
    const uMint = gl.getUniformLocation(prog, 'u_mint');
    const uAccent = gl.getUniformLocation(prog, 'u_accent');
    const uDeep = gl.getUniformLocation(prog, 'u_deep');

    const hexToRgb = (hex: string): [number, number, number] => {
      const h = (hex || '').trim().replace('#', '');
      const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : (h || 'F7F8F6');
      const v = parseInt(n, 16);
      return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
    };
    function readColors() {
      const cs = getComputedStyle(document.documentElement);
      gl.uniform3fv(uPaper, hexToRgb(cs.getPropertyValue('--paper') || '#F7F8F6'));
      gl.uniform3fv(uMint, hexToRgb(cs.getPropertyValue('--mint') || '#8FD3B6'));
      gl.uniform3fv(uAccent, hexToRgb(cs.getPropertyValue('--accent') || '#0E6B4E'));
      gl.uniform3fv(uDeep, hexToRgb(cs.getPropertyValue('--accent-2') || '#0B5A41'));
    }
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      cv.width = Math.max(1, Math.floor(cv.clientWidth * dpr));
      cv.height = Math.max(1, Math.floor(cv.clientHeight * dpr));
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(uRes, cv.width, cv.height);
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    readColors();
    resize();

    const themeObs = new MutationObserver(readColors);
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    window.addEventListener('resize', resize);

    let raf = 0;
    const start = performance.now();
    const frame = (now: number) => {
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    };
    if (reduce) {
      gl.uniform1f(uTime, 6.0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      themeObs.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
