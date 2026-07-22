'use client';

import { useEffect, useRef } from 'react';

/**
 * Subtle, slow, volumetric field rendered with a WebGL fragment shader
 * (domain-warped fBm noise) in the journal's own palette. Reads the live
 * --paper / --mint / --accent tokens so it adapts to light/dark, honors
 * reduced-motion (renders a single static frame), and falls back to a CSS
 * gradient if WebGL is unavailable.
 */
export default function VolumetricBackground({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: true, premultipliedAlpha: false });
    if (!gl) {
      canvas.style.display = 'none';
      return;
    }

    const vsrc = `attribute vec2 p; void main(){ gl_Position = vec4(p,0.0,1.0); }`;
    const fsrc = `
      precision highp float;
      uniform float u_time; uniform vec2 u_res;
      uniform vec3 u_paper; uniform vec3 u_mint; uniform vec3 u_accent;
      float hash(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
      float noise(vec2 p){ vec2 i=floor(p),f=fract(p);
        float a=hash(i),b=hash(i+vec2(1.,0.)),c=hash(i+vec2(0.,1.)),d=hash(i+vec2(1.,1.));
        vec2 u=f*f*(3.-2.*f); return mix(mix(a,b,u.x),mix(c,d,u.x),u.y); }
      float fbm(vec2 p){ float v=0.,a=.5; for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.02; a*=.5; } return v; }
      void main(){
        vec2 uv = gl_FragCoord.xy/u_res.xy;
        vec2 p = uv*vec2(u_res.x/u_res.y,1.0)*2.2;
        float t = u_time*0.025;
        vec2 q = vec2(fbm(p+vec2(0.0,t)), fbm(p+vec2(5.2,-t)));
        float f = fbm(p + q*1.8 + vec2(t*0.5,0.0));
        vec3 col = mix(u_paper, u_mint, smoothstep(0.32,0.9,f)*0.55);
        col = mix(col, u_accent, smoothstep(0.62,0.98,f)*0.14);
        col = mix(col, u_paper, smoothstep(0.0,0.72,uv.y)*0.40);   // fade to paper up top for legibility
        gl_FragColor = vec4(col,1.0);
      }`;

    function compile(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      return s;
    }
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

    const hexToRgb = (hex: string): [number, number, number] => {
      const h = hex.trim().replace('#', '');
      const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
      const v = parseInt(n || 'F7F8F6', 16);
      return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
    };
    function readColors() {
      const cs = getComputedStyle(document.documentElement);
      gl!.uniform3fv(uPaper, hexToRgb(cs.getPropertyValue('--paper') || '#F7F8F6'));
      gl!.uniform3fv(uMint, hexToRgb(cs.getPropertyValue('--mint') || '#8FD3B6'));
      gl!.uniform3fv(uAccent, hexToRgb(cs.getPropertyValue('--accent') || '#0E6B4E'));
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = canvas!.clientWidth, h = canvas!.clientHeight;
      canvas!.width = Math.max(1, Math.floor(w * dpr));
      canvas!.height = Math.max(1, Math.floor(h * dpr));
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
      gl!.uniform2f(uRes, canvas!.width, canvas!.height);
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    readColors();
    resize();

    const themeObs = new MutationObserver(readColors);
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    window.addEventListener('resize', resize);

    let raf = 0;
    const start = performance.now();
    function frame(now: number) {
      gl!.uniform1f(uTime, (now - start) / 1000);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    }
    if (reduce) {
      gl.uniform1f(uTime, 12.0);
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
