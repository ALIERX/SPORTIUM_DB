import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Volume2, VolumeX, Zap, Trophy, TrendingUp, Users, Award } from "lucide-react";
import { HexagonPattern } from "./HexagonPattern";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface NoiseSession {
  id: number;
  username: string;
  decibels: number;
  pointsEarned: number;
  timestamp: string;
}

export function NoiseMeterPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [currentDecibels, setCurrentDecibels] = useState(0);
  const [sessionPoints, setSessionPoints] = useState(0);
  const [totalSessionDecibels, setTotalSessionDecibels] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(0);

  // Simulated leaderboard
  const topNoiseMakers: NoiseSession[] = [
    { id: 1, username: "CalcioMaster", decibels: 118, pointsEarned: 2360, timestamp: "2 min fa" },
    { id: 2, username: "TifosoPro", decibels: 115, pointsEarned: 2300, timestamp: "5 min fa" },
    { id: 3, username: "UltrasKing", decibels: 112, pointsEarned: 2240, timestamp: "8 min fa" },
    { id: 4, username: "GoalGetter", decibels: 109, pointsEarned: 2180, timestamp: "12 min fa" },
    { id: 5, username: "SerieAFan", decibels: 105, pointsEarned: 2100, timestamp: "15 min fa" },
  ];

  const matchInfo = {
    homeTeam: "Inter",
    awayTeam: "Milan",
    stadium: "San Siro",
    time: "20:45",
    currentMinute: "67'",
  };

  // Simulate noise detection
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        // Simulate varying noise levels
        const noise = 60 + Math.random() * 60; // 60-120 dB
        setCurrentDecibels(Math.floor(noise));
        
        // Calculate points based on decibels (higher = more points)
        if (noise > 80) {
          const points = Math.floor((noise - 80) * 2);
          setSessionPoints((prev) => prev + points);
        }
        
        setTotalSessionDecibels((prev) => prev + noise);
        setSessionDuration((prev) => prev + 1);
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isRecording]);

  const handleToggleRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
    } else {
      // Start new session
      setIsRecording(true);
      setCurrentDecibels(0);
      setSessionPoints(0);
      setTotalSessionDecibels(0);
      setSessionDuration(0);
    }
  };

  const getDecibelColor = (db: number) => {
    if (db < 60) return "text-[#A9AFBC]";
    if (db < 80) return "text-[#00E0FF]";
    if (db < 100) return "text-[#A7FF1A]";
    return "text-[#FFD700]";
  };

  const getDecibelLevel = (db: number) => {
    if (db < 60) return "Silenzio";
    if (db < 80) return "Moderato";
    if (db < 100) return "Forte";
    if (db < 110) return "Assordante";
    return "ULTRAS MODE!";
  };

  const averageDecibels = sessionDuration > 0 
    ? Math.floor(totalSessionDecibels / sessionDuration) 
    : 0;

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden h-48 md:h-64">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1661450279873-01fe386873d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFkaXVtJTIwYXRtb3NwaGVyZSUyMG5pZ2h0fGVufDF8fHx8MTc1OTg2MzMzNHww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Stadium Atmosphere"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1020] via-[#0A1020]/80 to-transparent" />
        <HexagonPattern />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
          <Badge className="bg-[#00E0FF] text-[#0A1020] border-0 w-fit mb-3">
            <Volume2 className="w-3 h-3 mr-1" />
            Live allo Stadio
          </Badge>
          <h1 className="text-3xl md:text-4xl text-white mb-2">Noise Meter</h1>
          <p className="text-[#A9AFBC] max-w-2xl">
            Fai sentire la tua voce! Più alto è il volume, più Fans Points guadagni
          </p>
        </div>
      </div>

      {/* Current Match */}
      <Card className="bg-gradient-to-br from-[#111318] to-[#2B2F3A] border-[#A7FF1A]/30 overflow-hidden">
        <HexagonPattern />
        <div className="relative p-6">
          <Badge className="bg-red-500 text-white border-0 mb-4 animate-pulse">
            LIVE {matchInfo.currentMinute}
          </Badge>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-2xl text-white">{matchInfo.homeTeam}</h3>
            <span className="text-[#A9AFBC]">vs</span>
            <h3 className="text-2xl text-white">{matchInfo.awayTeam}</h3>
          </div>
          <div className="text-sm text-[#A9AFBC] flex items-center justify-center gap-2">
            <span>{matchInfo.stadium}</span>
            <span>•</span>
            <span>{matchInfo.time}</span>
          </div>
        </div>
      </Card>

      {/* Noise Meter */}
      <Card className="bg-[#111318] border-white/10 overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Decibel Display */}
          <div className="text-center space-y-4">
            <div className={`text-7xl ${getDecibelColor(currentDecibels)} transition-colors`}>
              {currentDecibels}
              <span className="text-3xl ml-2">dB</span>
            </div>
            <div className="text-xl text-white">
              {getDecibelLevel(currentDecibels)}
            </div>
            <Progress 
              value={(currentDecibels / 120) * 100} 
              className="h-3 bg-[#2B2F3A]"
            />
          </div>

          {/* Recording Button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleToggleRecording}
              className={`w-full md:w-auto ${
                isRecording
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-[#A7FF1A] hover:bg-[#8FE515] text-[#0A1020]"
              } transition-all glow-neon`}
            >
              {isRecording ? (
                <>
                  <VolumeX className="w-5 h-5 mr-2" />
                  Ferma Registrazione
                </>
              ) : (
                <>
                  <Volume2 className="w-5 h-5 mr-2" />
                  Inizia a Fare Rumore!
                </>
              )}
            </Button>
          </div>

          {/* Session Stats */}
          {isRecording && (
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
              <div className="text-center">
                <div className="text-2xl text-[#A7FF1A]">
                  {sessionPoints}
                </div>
                <div className="text-xs text-[#A9AFBC]">FP Guadagnati</div>
              </div>
              <div className="text-center">
                <div className="text-2xl text-[#00E0FF]">
                  {averageDecibels}
                </div>
                <div className="text-xs text-[#A9AFBC]">Media dB</div>
              </div>
              <div className="text-center">
                <div className="text-2xl text-white">
                  {Math.floor(sessionDuration / 2)}s
                </div>
                <div className="text-xs text-[#A9AFBC]">Durata</div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-[#111318] border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[#A7FF1A]/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-[#A7FF1A]" />
            </div>
            <div>
              <div className="text-sm text-[#A9AFBC]">Moltiplicatore</div>
              <div className="text-xl text-white">2x</div>
            </div>
          </div>
        </Card>

        <Card className="bg-[#111318] border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[#00E0FF]/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-[#00E0FF]" />
            </div>
            <div>
              <div className="text-sm text-[#A9AFBC]">Partecipanti Live</div>
              <div className="text-xl text-white">1,247</div>
            </div>
          </div>
        </Card>

        <Card className="bg-[#111318] border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[#A7FF1A]/10 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-[#A7FF1A]" />
            </div>
            <div>
              <div className="text-sm text-[#A9AFBC]">Record Stadio</div>
              <div className="text-xl text-white">124 dB</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Leaderboard */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl text-white">Classifica Rumorosi</h3>
          <Badge variant="outline" className="border-[#A7FF1A]/30 text-[#A7FF1A]">
            Ultimi 30 min
          </Badge>
        </div>

        <div className="space-y-3">
          {topNoiseMakers.map((session, index) => (
            <Card
              key={session.id}
              className={`p-4 ${
                index === 0
                  ? "bg-gradient-to-r from-[#A7FF1A]/20 to-transparent border-[#A7FF1A]/50"
                  : "bg-[#111318] border-white/10"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  index === 0 ? "bg-[#FFD700]/20 text-[#FFD700]"
                  : index === 1 ? "bg-[#C0C0C0]/20 text-[#C0C0C0]"
                  : index === 2 ? "bg-[#CD7F32]/20 text-[#CD7F32]"
                  : "bg-[#2B2F3A] text-[#A9AFBC]"
                }`}>
                  {index < 3 ? (
                    <Trophy className="w-5 h-5" />
                  ) : (
                    <span>#{index + 1}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-white truncate">{session.username}</div>
                  <div className="text-sm text-[#A9AFBC]">{session.timestamp}</div>
                </div>

                <div className="text-right">
                  <div className={`${getDecibelColor(session.decibels)}`}>
                    {session.decibels} dB
                  </div>
                  <div className="text-sm text-[#A7FF1A]">
                    +{session.pointsEarned} FP
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* How it Works */}
      <Card className="bg-gradient-to-br from-[#A7FF1A]/10 to-transparent border-[#A7FF1A]/30 p-6">
        <h3 className="text-xl text-white mb-4">Come Funziona</h3>
        <div className="space-y-3 text-[#A9AFBC]">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#A7FF1A] text-[#0A1020] flex items-center justify-center flex-shrink-0 mt-0.5">
              1
            </div>
            <p>Attiva il Noise Meter durante la partita allo stadio</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#A7FF1A] text-[#0A1020] flex items-center justify-center flex-shrink-0 mt-0.5">
              2
            </div>
            <p>Fai sentire la tua voce! Più alto è il volume, più punti guadagni</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#A7FF1A] text-[#0A1020] flex items-center justify-center flex-shrink-0 mt-0.5">
              3
            </div>
            <p>Guadagna bonus extra se superi 100 dB durante i momenti chiave</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#A7FF1A] text-[#0A1020] flex items-center justify-center flex-shrink-0 mt-0.5">
              4
            </div>
            <p>Scala la classifica e vinci premi speciali a fine partita</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
