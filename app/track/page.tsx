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

  // QR Payload for Admin Verification
  const qrPayload = JSON.stringify({
    taskId: task.id,
    type: "TASK_VERIFICATION",
    source: "WEB_PORTAL",
    timestamp: new Date().toISOString(),
  });

  return (
    <div className="container max-w-2xl py-12 px-4 mx-auto">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Portal
      </Link>

      <div className="grid gap-8">
        <Card className="overflow-hidden border-2 border-primary/10 shadow-2xl shadow-primary/5 rounded-[32px]">
          <CardHeader className="bg-primary/5 border-b border-primary/10 pb-8 pt-8">
            <div className="flex justify-between items-start">
              <Badge variant="outline" className="bg-background/50 backdrop-blur-sm border-primary/20 text-primary font-bold px-3 py-1 mb-4">
                Live Task Status
              </Badge>
              <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center shadow-sm border border-primary/10">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl font-black tracking-tight leading-tight">
              {task.title}
            </CardTitle>
            <CardDescription className="text-base mt-2">
              ID: <span className="font-mono font-bold text-foreground">{task.id}</span>
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-10 pb-10 flex flex-col items-center">
            {/* Main QR Code Section */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/20 rounded-[48px] blur-3xl group-hover:bg-primary/30 transition-all duration-500 opacity-50" />
              <div className="relative bg-white p-8 rounded-[40px] shadow-2xl border-8 border-background">
                <QRCodeSVG
                  value={qrPayload}
                  size={240}
                  level="H"
                  includeMargin={false}
                  imageSettings={{
                    src: "/favicon.ico",
                    x: undefined,
                    y: undefined,
                    height: 40,
                    width: 40,
                    excavate: true,
                  }}
                />
              </div>
            </div>

            <div className="mt-10 text-center space-y-4 px-6">
              <div className="p-4 rounded-2xl bg-muted/50 border border-border/50 inline-flex flex-col gap-2 w-full">
                <p className="text-sm font-bold text-foreground leading-relaxed">
                  {task.description || "No description provided."}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-2 pt-3 border-t border-border/30">
                   <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      <MapPin className="h-3 w-3" /> {task.location || "Station Unknown"}
                   </div>
                   <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      <Clock className="h-3 w-3" /> {task.hours} Hours
                   </div>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground max-w-[280px] mx-auto leading-5 font-medium italic opacity-70">
                Show this QR code to the station supervisor to verify your attendance and log your hours.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Status Timeline or Meta Info */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-3xl bg-card border border-border/50 flex items-center gap-4 shadow-sm">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Date Assigned</p>
              <p className="text-sm font-bold">{new Date(task.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>
          <div className="p-5 rounded-3xl bg-card border border-border/50 flex items-center gap-4 shadow-sm">
             <div className="h-10 w-10 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
              <div className="h-2 w-2 rounded-full bg-current animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</p>
              <p className="text-sm font-bold capitalize">{task.status || "Pending"}</p>
            </div>
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
