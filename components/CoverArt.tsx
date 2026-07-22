'use client';

import { useEffect, useRef } from 'react';

/**
 * Contained generative cover art — a slow flowing gradient rendered in WebGL,
 * sized to its frame (so it can never clip against a section edge). Rich but
 * refined palette (emerald / teal / ink / warm highlight). Clearly moves.
 * Falls back to a static CSS gradient if WebGL is unavailable; respects
 * reduced-motion.
 */
export default function CoverArt({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const glCtx = canvas.getContext('webgl', { antialias: true, alpha: false });
    if (!glCtx) return;
    const gl: WebGLRenderingContext = glCtx;
    const cv: HTMLCanvasElement = canvas;

    const vsrc = `attribute vec2 p; void main(){ gl_Position = vec4(p,0.0,1.0); }`;
    const fsrc = `
      precision highp float;
      uniform float u_time; uniform vec2 u_res;
      // palette
      vec3 A = vec3(0.043,0.353,0.255);   // emerald
      vec3 B = vec3(0.043,0.239,0.239);   // deep teal
      vec3 C = vec3(0.106,0.102,0.082);   // ink
      vec3 D = vec3(0.847,0.906,0.784);   // pale highlight
      float blob(vec2 p, vec2 c, float k){ vec2 d=p-c; return exp(-k*dot(d,d)); }
      void main(){
        vec2 uv = gl_FragCoord.xy/u_res.xy;
        float ar = u_res.x/max(u_res.y,1.0);
        vec2 p = vec2(uv.x*ar, uv.y);
        float t = u_time*0.28;
        vec2 c0 = vec2(0.30*ar + 0.34*sin(t*0.7),      0.60 + 0.28*cos(t*0.6));
        vec2 c1 = vec2(0.72*ar + 0.30*cos(t*0.5+1.0),  0.40 + 0.30*sin(t*0.8));
        vec2 c2 = vec2(0.55*ar + 0.38*sin(t*0.4+2.0),  0.78 + 0.24*cos(t*0.55));
        vec2 c3 = vec2(0.20*ar + 0.26*cos(t*0.9+3.0),  0.30 + 0.22*sin(t*0.65));
        float k = 2.3;
        vec3 col = B;
        col = mix(col, A, clamp(blob(p,c0,k)*1.1, 0.0, 1.0));
        col = mix(col, C, clamp(blob(p,c1,k*1.2)*0.9, 0.0, 0.9));
        col = mix(col, A, clamp(blob(p,c2,k*0.9)*0.9, 0.0, 0.9));
        col = mix(col, D, clamp(blob(p,c3,k*1.6)*0.55, 0.0, 0.55));
        // subtle vignette for depth
        vec2 q = uv-0.5; col *= 1.0 - dot(q,q)*0.5;
        gl_FragColor = vec4(col, 1.0);
      }`;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vsrc));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fsrc));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_res');

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.max(1, Math.floor(cv.clientWidth * dpr));
      cv.height = Math.max(1, Math.floor(cv.clientHeight * dpr));
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(uRes, cv.width, cv.height);
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    resize();
    window.addEventListener('resize', resize);

    let raf = 0;
    const start = performance.now();
    const frame = (now: number) => {
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    };
    if (reduce) { gl.uniform1f(uTime, 8.0); gl.drawArrays(gl.TRIANGLES, 0, 3); }
    else raf = requestAnimationFrame(frame);

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
