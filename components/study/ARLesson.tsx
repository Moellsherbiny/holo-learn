"use client";

// components/study/lessons/ARLesson.tsx
// Uses AR.js + A-Frame loaded via CDN scripts (no npm install needed)

import { useEffect, useRef, useState } from "react";
import { Layers, Camera, AlertTriangle, Loader2, Info } from "lucide-react";
import type { LessonWithProgress } from "@/types/study";

interface Props {
  lesson: LessonWithProgress;
}

type ARState = "idle" | "loading" | "ready" | "error";

export function ARLesson({ lesson }: Props) {
  const [arState, setArState] = useState<ARState>("idle");
  const [arError, setArError] = useState<string | null>(null);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLElement | null>(null);

  // Dynamically load A-Frame + AR.js scripts once
  useEffect(() => {
    const existing = document.getElementById("aframe-script");
    if (existing) {
      setScriptsLoaded(true);
      return;
    }

    let cancelled = false;

    function loadScript(src: string, id: string): Promise<void> {
      return new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = src;
        s.id = id;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.head.appendChild(s);
      });
    }

    (async () => {
      try {
        await loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/aframe/1.5.0/aframe.min.js",
          "aframe-script"
        );
        await loadScript(
          "https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js",
          "arjs-script"
        );
        if (!cancelled) setScriptsLoaded(true);
      } catch (err) {
        if (!cancelled)
          setArError(
            "Failed to load AR libraries. Check your internet connection."
          );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  function startAR() {
    if (!scriptsLoaded) return;
    setArState("loading");
    setArError(null);

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then(() => {
        setArState("ready");
      })
      .catch(() => {
        setArState("error");
        setArError(
          "Camera access denied. Please allow camera access to use AR."
        );
      });
  }

  function stopAR() {
    setArState("idle");
    // Remove the injected a-scene if present
    if (sceneRef.current) {
      sceneRef.current.remove();
      sceneRef.current = null;
    }
  }

  // Inject A-Frame scene when arState becomes "ready"
  useEffect(() => {
    if (arState !== "ready" || !containerRef.current || !lesson.arModelUrl) return;

    // Clean up previous scene
    if (sceneRef.current) {
      sceneRef.current.remove();
    }

    const isGlb =
      lesson.arModelUrl.endsWith(".glb") ||
      lesson.arModelUrl.endsWith(".gltf");

    // Build the a-scene HTML string
    const sceneHtml = `
      <a-scene
        embedded
        arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
        renderer="logarithmicDepthBuffer: true; precision: mediump;"
        vr-mode-ui="enabled: false"
        style="width:100%;height:100%;"
      >
        <a-assets>
          ${isGlb ? `<a-asset-item id="ar-model" src="${lesson.arModelUrl}"></a-asset-item>` : ""}
        </a-assets>

        <a-marker preset="hiro">
          ${
            isGlb
              ? `<a-entity
                  gltf-model="#ar-model"
                  scale="0.5 0.5 0.5"
                  position="0 0 0"
                  rotation="-90 0 0"
                  animation="property: rotation; to: -90 360 0; loop: true; dur: 10000; easing: linear"
                ></a-entity>`
              : `<a-box position="0 0.5 0" material="color: #7C3AED;" scale="1 1 1"
                  animation="property: rotation; to: 0 360 0; loop: true; dur: 8000; easing: linear">
                </a-box>`
          }
        </a-marker>

        <a-entity camera></a-entity>
      </a-scene>
    `;

    const wrapper = document.createElement("div");
    wrapper.innerHTML = sceneHtml.trim();
    const scene = wrapper.firstElementChild as HTMLElement;

    containerRef.current.appendChild(scene);
    sceneRef.current = scene;

    return () => {
      if (sceneRef.current) {
        sceneRef.current.remove();
        sceneRef.current = null;
      }
    };
  }, [arState, lesson.arModelUrl]);

  return (
    <div className="space-y-4">
      {/* Description */}
      {lesson.content && (
        <div
          className="prose prose-invert prose-sm max-w-none text-white/70 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: lesson.content }}
        />
      )}

      {/* AR Panel */}
      <div className="rounded-xl border border-fuchsia-500/20 bg-fuchsia-500/5 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-fuchsia-500/10">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-fuchsia-400" />
            <span className="text-sm font-semibold text-fuchsia-300">
              AR Experience
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-400">
              AR
            </span>
          </div>
          {arState === "ready" && (
            <button
              onClick={stopAR}
              className="text-xs text-white/40 hover:text-white transition-colors"
            >
              Stop AR
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Idle state */}
          {arState === "idle" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="w-16 h-16 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center">
                <Layers className="w-8 h-8 text-fuchsia-400" />
              </div>
              <div className="text-center">
                <p className="text-white font-medium mb-1">
                  View in Augmented Reality
                </p>
                <p className="text-sm text-white/40 max-w-xs">
                  Point your camera at a{" "}
                  <a
                    href="https://raw.githack.com/AR-js-org/AR.js/master/data/images/HIRO.jpg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-fuchsia-400 hover:underline"
                  >
                    Hiro marker
                  </a>{" "}
                  to see the 3D model appear.
                </p>
              </div>

              {/* Instructions */}
              <div className="w-full max-w-xs rounded-lg bg-white/3 border border-white/5 p-3 space-y-2 text-xs text-white/50">
                <p className="flex items-start gap-2">
                  <span className="text-fuchsia-400 font-bold shrink-0">1.</span>
                  Print or display the Hiro marker on another screen
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-fuchsia-400 font-bold shrink-0">2.</span>
                  Click "Launch AR" and allow camera access
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-fuchsia-400 font-bold shrink-0">3.</span>
                  Point your camera at the marker to see the 3D model
                </p>
              </div>

              <button
                onClick={startAR}
                disabled={!scriptsLoaded}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
              >
                <Camera className="w-4 h-4" />
                {scriptsLoaded ? "Launch AR" : "Loading libraries…"}
              </button>
            </div>
          )}

          {/* Loading state */}
          {arState === "loading" && (
            <div className="flex flex-col items-center gap-3 py-8">
              <Loader2 className="w-8 h-8 text-fuchsia-400 animate-spin" />
              <p className="text-sm text-white/50">
                Requesting camera access…
              </p>
            </div>
          )}

          {/* Error state */}
          {arState === "error" && (
            <div className="flex flex-col items-center gap-3 py-6">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-rose-400" />
              </div>
              <p className="text-sm text-rose-400 text-center max-w-xs">
                {arError}
              </p>
              <button
                onClick={startAR}
                className="text-xs px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                Try again
              </button>
            </div>
          )}

          {/* AR viewer — container for A-Frame scene injection */}
          {arState === "ready" && (
            <div className="space-y-2">
              <div
                ref={containerRef}
                className="relative w-full rounded-lg overflow-hidden bg-black"
                style={{ height: "480px" }}
              />
              <p className="flex items-center gap-1.5 text-xs text-white/30">
                <Info className="w-3.5 h-3.5" />
                Point at the Hiro marker. Keep the marker well-lit and fully visible.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Download model (if glb/gltf) */}
      {lesson.arModelUrl && (
        <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-white/3 border border-white/5">
          <span className="text-xs text-white/40">3D Model file</span>
          <a
            href={lesson.arModelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            Open file
          </a>
        </div>
      )}
    </div>
  );
}