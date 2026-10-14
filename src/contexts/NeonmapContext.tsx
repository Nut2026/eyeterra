import React, { createContext, useContext, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/db/supabase';
import { useAccessibility } from './AccessibilityContext';

interface NeonmapContextType {
  heatmapVisible: boolean;
}

const NeonmapContext = createContext<NeonmapContextType>({
  heatmapVisible: false,
});

function getSessionId(): string {
  let sid = sessionStorage.getItem('eyeterra-session');
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem('eyeterra-session', sid);
  }
  return sid;
}

export const NeonmapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { neonmap } = useAccessibility();
  const [heatmapVisible, setHeatmapVisible] = React.useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleClick = async (e: MouseEvent) => {
      const db = supabase;
      if (!db) return;
      await db.from('click_events').insert({
        session_id: getSessionId(),
        page_url: window.location.pathname,
        x_coord: e.clientX / window.innerWidth,
        y_coord: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const removeCanvas = useCallback(() => {
    if (canvasRef.current?.parentNode) {
      canvasRef.current.parentNode.removeChild(canvasRef.current);
    }
    canvasRef.current = null;
  }, []);

  const renderHeatmap = useCallback(async () => {
    const db = supabase;
    if (!neonmap || !db) return;

    const { data } = await db
      .from('click_events')
      .select('x_coord, y_coord')
      .eq('page_url', window.location.pathname)
      .order('created_at', { ascending: false })
      .limit(1000);

    removeCanvas();
    if (!data?.length) return;

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:9998;pointer-events:none;';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    canvasRef.current = canvas;

    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const { x_coord, y_coord } of data) {
      const x = x_coord * canvas.width;
      const y = y_coord * canvas.height;
      const r = 35;
      const grd = ctx.createRadialGradient(x, y, 0, x, y, r);
      grd.addColorStop(0, 'rgba(255,30,0,0.28)');
      grd.addColorStop(0.5, 'rgba(255,120,0,0.13)');
      grd.addColorStop(1, 'rgba(255,200,0,0)');
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
    }
  }, [neonmap, removeCanvas]);

  useEffect(() => {
    if (neonmap) {
      setHeatmapVisible(true);
      renderHeatmap();
    } else {
      setHeatmapVisible(false);
      removeCanvas();
    }
  }, [neonmap, renderHeatmap]);

  useEffect(() => {
    if (!neonmap) return;
    renderHeatmap();
    return () => removeCanvas();
  }, [location.pathname, neonmap, renderHeatmap]);

  return (
    <NeonmapContext.Provider value={{ heatmapVisible }}>
      {children}
    </NeonmapContext.Provider>
  );
};

export const useNeonmap = () => useContext(NeonmapContext);
