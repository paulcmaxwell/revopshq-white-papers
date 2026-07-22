'use client';

import { useEffect, useRef } from 'react';

/**
 * Ambient moving field for the masthead. NEUTRAL — soft tonal light/shade
 * drifting over paper (no color in the field; green stays an accent elsewhere).
 * Motion is intentionally visible (large soft blobs sweeping slowly). Reads the
 * live --paper token so it works in light/dark, honors reduced-motion (static
 * frame), and hides itself if WebGL is unavailable (CSS fallback shows).
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
      uniform float u_time; uniform vec2 u_res; uniform vec3 u_paper;
      float blob(vec2 p, vec2 c, float k){ vec2 d = p - c; return exp(-k*dot(d,d)); }
      void main(){
        vec2 uv = gl_FragCoord.xy / u_res.xy;
        float ar = u_res.x / max(u_res.y, 1.0);
        vec2 p = vec2(uv.x * ar, uv.y);
        float t = u_time * 0.5;                     // visibly moving
        vec2 c0 = vec2(0.30*ar + 0.36*sin(t*0.60),       0.55 + 0.30*cos(t*0.50));
        vec2 c1 = vec2(0.70*ar + 0.32*cos(t*0.45 + 1.0), 0.45 + 0.32*sin(t*0.70));
        vec2 c2 = vec2(0.55*ar + 0.42*sin(t*0.35 + 2.0), 0.80 + 0.26*cos(t*0.55));
        float k = 2.1;                              // large soft blobs
        vec3 shade = clamp(u_paper - 0.055, 0.0, 1.0);   // neutral tonal darkening
        vec3 col = u_paper;
        col = mix(col, shade, clamp(blob(p,c0,k)*0.90, 0.0, 0.50));
        col = mix(col, shade, clamp(blob(p,c1,k*1.1)*0.80, 0.0, 0.45));
        col = mix(col, shade, clamp(blob(p,c2,k*0.9)*0.70, 0.0, 0.40));
        col = mix(col, u_paper, smoothstep(0.12, 1.0, uv.y) * 0.22);
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
      cv.style.display = 'none';
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

    const hexToRgb = (hex: string): [number, number, number] => {
      const h = (hex || '').trim().replace('#', '');
      const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : (h || 'F7F8F6');
      const v = parseInt(n, 16);
      return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
    };
    function readColors() {
      const cs = getComputedStyle(document.documentElement);
      gl.uniform3fv(uPaper, hexToRgb(cs.getPropertyValue('--paper') || '#F7F8F6'));
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
