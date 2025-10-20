import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Brain, Clock, Trophy, Zap } from "lucide-react";
import { HeroBanner } from "./HeroBanner";
import { HeroBanner } from "./HeroBanner";

interface Quiz {
  id: number;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  questions: number;
  timeLimit: number; // in minutes
  reward: number; // points
  category: string;
}

export function QuizPage() {
  const quizzes: Quiz[] = [
    {
      id: 1,
      title: "Leggende del Calcio Italiano",
      difficulty: "medium",
      questions: 10,
      timeLimit: 5,
      reward: 500,
      category: "Storia"
    },
    {
      id: 2,
      title: "Champions League 2024",
      difficulty: "easy",
      questions: 8,
      timeLimit: 3,
      reward: 250,
      category: "Attualità"
    },
    {
      id: 3,
      title: "Tattiche e Formazioni",
      difficulty: "hard",
      questions: 15,
      timeLimit: 10,
      reward: 1000,
      category: "Tattica"
    },
    {
      id: 4,
      title: "Serie A Quiz Rapido",
      difficulty: "easy",
      questions: 5,
      timeLimit: 2,
      reward: 150,
      category: "Serie A"
    },
  ];
  
  const getDifficultyColor = (difficulty: Quiz["difficulty"]) => {
    switch (difficulty) {
      case "easy":
        return "text-[#A7FF1A] border-[#A7FF1A]/30";
      case "medium":
        return "text-[#00E0FF] border-[#00E0FF]/30";
      case "hard":
        return "text-[#FF1A75] border-[#FF1A75]/30";
    }
  };
  
  const getDifficultyLabel = (difficulty: Quiz["difficulty"]) => {
    switch (difficulty) {
      case "easy":
        return "Facile";
      case "medium":
        return "Medio";
      case "hard":
        return "Difficile";
    }
  };
  
  return (
    <div className="space-y-6 pb-24 md:pb-8">
      <HeroBanner
        imageUrl="https://images.unsplash.com/photo-1661450279873-01fe386873d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFkaXVtJTIwYXRtb3NwaGVyZSUyMG5pZ2h0fGVufDF8fHx8MTc1OTg2MzMzNHww&ixlib=rb-4.1.0&q=80&w=1080"
        title="Quiz & Sfide"
        subtitle="Metti alla prova la tua conoscenza e vinci Fans Points"
        badge="QUIZ DEL GIORNO"
        height="small"
      />
      
      {/* Featured Quiz */}
      <Card className="bg-gradient-to-br from-[#A7FF1A]/20 via-[#00E0FF]/10 to-transparent border-[#A7FF1A]/30 overflow-hidden">
        <div className="p-6 space-y-4">
          <Badge className="bg-[#A7FF1A] text-[#0A1020] border-0">
            Quiz del Giorno
          </Badge>
          <h3 className="text-2xl text-white">Coppa del Mondo: I Momenti Storici</h3>
          <p className="text-[#A9AFBC]">
            Un viaggio attraverso i momenti più iconici della storia della Coppa del Mondo
          </p>
          
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 text-[#A9AFBC]">
              <Brain className="w-4 h-4 text-[#A7FF1A]" />
              12 domande
            </div>
            <div className="flex items-center gap-2 text-[#A9AFBC]">
              <Clock className="w-4 h-4 text-[#A7FF1A]" />
              8 minuti
            </div>
            <div className="flex items-center gap-2 text-[#A7FF1A]">
              <Trophy className="w-4 h-4" />
              1,500 FP
            </div>
          </div>
          
          <Button className="w-full sm:w-auto bg-[#A7FF1A] hover:bg-[#8FE515] text-[#0A1020] glow-neon">
            <Zap className="w-4 h-4 mr-2" />
            Gioca Ora
          </Button>
        </div>
      </Card>
      
      {/* Quiz Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="bg-[#111318] border-white/10 hover:border-[#A7FF1A]/30 transition-all group">
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Badge variant="outline" className="mb-3 border-[#00E0FF]/30 text-[#00E0FF]">
                    {quiz.category}
                  </Badge>
                  <h3 className="text-lg text-white mb-2">{quiz.title}</h3>
                </div>
                <Badge variant="outline" className={getDifficultyColor(quiz.difficulty)}>
                  {getDifficultyLabel(quiz.difficulty)}
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-[#A9AFBC]">
                  <Brain className="w-4 h-4" />
                  {quiz.questions} domande
                </div>
                <div className="flex items-center gap-2 text-[#A9AFBC]">
                  <Clock className="w-4 h-4" />
                  {quiz.timeLimit} min
                </div>
                <div className="flex items-center gap-2 text-[#A7FF1A]">
                  <Trophy className="w-4 h-4" />
                  {quiz.reward} FP
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full border-white/10 hover:border-[#A7FF1A]/50 hover:bg-[#A7FF1A]/10 group-hover:text-[#A7FF1A]"
              >
                Inizia Quiz
              </Button>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 bg-[#111318] border-white/10 text-center">
          <div className="text-2xl text-[#A7FF1A] mb-1">24</div>
          <div className="text-sm text-[#A9AFBC]">Completati</div>
        </Card>
        <Card className="p-4 bg-[#111318] border-white/10 text-center">
          <div className="text-2xl text-[#00E0FF] mb-1">87%</div>
          <div className="text-sm text-[#A9AFBC]">Precisione</div>
        </Card>
        <Card className="p-4 bg-[#111318] border-white/10 text-center">
          <div className="text-2xl text-[#A7FF1A] mb-1">12,450</div>
          <div className="text-sm text-[#A9AFBC]">Punti Vinti</div>
        </Card>
      </div>
    </div>
  );
}