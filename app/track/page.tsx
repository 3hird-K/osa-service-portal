"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Calendar, MapPin, Clock, ArrowLeft, ShieldCheck, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function TrackContent() {
  const searchParams = useSearchParams();
  const taskId = searchParams.get("id");
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (taskId) {
      fetchTask(taskId);
    }
  }, [taskId]);

  const fetchTask = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://server-osa-service.onrender.com/tasks/${id}`);
      if (!res.ok) {
        throw new Error("Task not found or invalid ID");
      }
      const data = await res.json();
      setTask(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!taskId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
          <Search className="h-10 w-10 text-muted-foreground opacity-50" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight">Track Your Task</h1>
          <p className="text-muted-foreground max-w-xs mx-auto">
            Enter a valid Task ID from your mobile app to view the verification QR code.
          </p>
        </div>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Fetching task details...</p>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
        <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-destructive">Tracking Failed</h1>
          <p className="text-muted-foreground max-w-xs mx-auto">
            {error || "We couldn't find a task with that ID. Please check the ID in your app and try again."}
          </p>
        </div>
        <Link href="/track">
          <Button variant="outline">Try Again</Button>
        </Link>
      </div>
    );
  }

  // QR Payload synchronized with Manage Tasks section
  const qrPayload = JSON.stringify({
    id: task.id,
    title: task.title,
    description: task.description,
    location: task.location,
    hours: task.hours,
    status: task.status,
    assignee_id: task.assigned_to || task.assignee?.id
  });

  return (
    <div className="flex flex-col h-screen bg-muted/30 overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-lg mx-auto w-full gap-4">

        {/* Compact Back Link */}
        <Link href="/" className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-2">
          <ArrowLeft className="mr-1.5 h-3 w-3" /> Back to Portal
        </Link>

        <Card className="w-full overflow-hidden border-2 border-primary/10 shadow-2xl shadow-primary/5 rounded-[40px] flex flex-col bg-card">
          <CardHeader className="bg-primary/5 border-b border-primary/10 py-6 px-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <Badge variant="outline" className="bg-background/50 backdrop-blur-sm border-primary/20 text-primary font-bold text-[9px] uppercase tracking-[0.2em] px-3 py-0.5">
                Verification Required
              </Badge>
              <CardTitle className="text-2xl font-black tracking-tight leading-tight">
                {task.title}
              </CardTitle>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Task ID:</span>
                <span className="font-mono font-bold text-xs text-foreground bg-muted px-2 py-0.5 rounded">{task.id}</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="py-8 flex flex-col items-center gap-6">
            {/* Centered QR Code */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/20 rounded-[48px] blur-3xl group-hover:bg-primary/30 transition-all duration-500 opacity-50" />
              <div className="relative bg-white p-6 rounded-[36px] shadow-2xl border-4 border-background">
                <QRCodeSVG
                  value={qrPayload}
                  size={180}
                  level="H"
                  includeMargin={false}
                  imageSettings={{
                    src: "/favicon.ico",
                    x: undefined,
                    y: undefined,
                    height: 36,
                    width: 36,
                    excavate: true,
                  }}
                />
              </div>
            </div>

            {/* Task Snapshot */}
            <div className="w-full px-4 space-y-4">
              <div className="p-4 rounded-2xl bg-muted/50 border border-border/50 text-center">
                <p className="text-xs font-bold text-foreground leading-relaxed line-clamp-2 mb-3 px-2">
                  {task.description || "No description provided."}
                </p>
                <div className="flex items-center justify-center gap-4 pt-3 border-t border-border/30">
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                    <MapPin className="h-3 w-3 text-primary" /> {task.location || "Station"}
                  </div>
                  <div className="h-3 w-[1px] bg-border/50" />
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                    <Clock className="h-3 w-3 text-primary" /> {task.hours} Hours
                  </div>
                  <div className="h-3 w-[1px] bg-border/50" />
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-green-500 uppercase tracking-wider">
                    <div className="h-1.5 w-1.5 rounded-full bg-current animate-pulse mr-1" /> {task.status || "Live"}
                  </div>
                </div>
              </div>

              <p className="text-[9px] text-muted-foreground text-center px-4 leading-relaxed font-bold uppercase tracking-[0.1em] opacity-40">
                Show this to your supervisor to verify attendance
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer Meta */}
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-2 opacity-50">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="text-[9px] font-bold uppercase tracking-widest">Secure Verification Portal</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <main className="min-h-screen bg-muted/30">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }>
        <TrackContent />
      </Suspense>
    </main>
  );
}
