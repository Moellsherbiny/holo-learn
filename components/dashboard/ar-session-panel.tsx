"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Sparkles, Smartphone, Wifi, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ARSessionPanel() {
  const t = useTranslations("student");
  // In production this would be driven by a websocket / polling from the teacher
  const [hologramLive] = useState(false);
  const [joined, setJoined] = useState(false);

  return (
    <div className="rounded-xl border bg-card overflow-hidden" style={{ borderColor: "rgb(139 92 246 / 0.25)" }}>
      <div className="px-5 py-4 border-b border-border flex items-center gap-3 bg-linear-to-r from-violet-500/8 to-purple-500/5">
        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", hologramLive ? "bg-violet-500" : "bg-muted")}>
          <Sparkles size={17} className={hologramLive ? "text-white" : "text-muted-foreground"} />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{t("ar_available")}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {hologramLive ? t("hologram_live") : "No active session"}
          </p>
        </div>
        {hologramLive && (
          <span className="ms-auto text-[10px] font-bold text-white bg-violet-500 px-2 py-0.5 rounded-full">LIVE</span>
        )}
      </div>

      <div className="p-5 space-y-4">
        {/* Device illustration */}
        <div className="rounded-lg bg-linear-to-br from-violet-500/8 to-purple-500/5 border border-violet-500/15 p-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center shrink-0 mt-0.5">
            <Smartphone size={19} className="text-violet-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground leading-snug">Follow in AR</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Point your mobile at the hologram fan in the classroom to overlay lesson content in augmented reality.
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <span className={cn("w-2 h-2 rounded-full shrink-0", hologramLive ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/30")} />
          <span className="text-xs text-muted-foreground">
            {hologramLive ? "Teacher is broadcasting – join now" : "Waiting for teacher to start hologram"}
          </span>
        </div>

        <Button
          className={cn("w-full h-10 gap-2", hologramLive ? "bg-violet-600 hover:bg-violet-700 text-white border-0" : "")}
          variant={hologramLive ? "default" : "outline"}
          disabled={!hologramLive}
          onClick={() => hologramLive && setJoined(!joined)}
        >
          {joined ? <Eye size={14} /> : <Wifi size={14} />}
          {joined ? t("watch_hologram") : t("join_ar")}
        </Button>
      </div>
    </div>
  );
}