-- ============================================
-- SPORTIUM - Seed Data
-- Popola il database con dati di test
-- ============================================

-- ============================================
-- ACHIEVEMENTS
-- ============================================
INSERT INTO public.achievements (code, title, description, points_reward, requirement_type, requirement_value)
VALUES
  ('first_win', 'Prima Vittoria', 'Vinci la tua prima asta', 500, 'auction_wins', 1),
  ('quiz_master', 'Quiz Master', 'Completa 10 quiz correttamente', 1000, 'quiz_correct', 10),
  ('big_spender', 'Grande Spendaccione', 'Spendi 10,000 Fans Points', 2000, 'total_spent', 10000),
  ('streak_king', 'Re dello Streak', 'Raggiungi 7 giorni di streak', 1500, 'streak_days', 7),
  ('bidding_beast', 'Bestia del Bidding', 'Piazza 50 offerte', 800, 'bid_count', 50),
  ('social_butterfly', 'Social Butterfly', 'Invita 5 amici', 2500, 'referral_count', 5),
  ('challenge_champion', 'Campione delle Sfide', 'Completa 20 sfide giornaliere', 1200, 'challenge_count', 20),
  ('leaderboard_legend', 'Leggenda della Classifica', 'Raggiungi Top 10 in classifica', 3000, 'leaderboard_rank', 10)
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- QUIZ QUESTIONS (Serie A)
-- ============================================
INSERT INTO public.quiz_questions (category, difficulty, question, options, correct_answer, points_reward)
VALUES
  -- Easy questions
  ('serie_a', 'easy', 'Quale squadra ha vinto più Scudetti nella storia?', 
   '["Juventus", "Inter", "Milan", "Roma"]'::jsonb, 0, 100),
  
  ('serie_a', 'easy', 'In quale città gioca la Lazio?', 
   '["Milano", "Roma", "Torino", "Napoli"]'::jsonb, 1, 100),
  
  ('serie_a', 'easy', 'Quale è il soprannome dell''Inter?', 
   '["Rossoneri", "Nerazzurri", "Bianconeri", "Giallorossi"]'::jsonb, 1, 100),
  
  -- Medium questions
  ('serie_a', 'medium', 'Chi ha segnato più gol in una singola stagione di Serie A?', 
   '["Cristiano Ronaldo", "Gonzalo Higuain", "Ciro Immobile", "Luca Toni"]'::jsonb, 1, 200),
  
  ('serie_a', 'medium', 'Quale stadio ospita il Derby della Madonnina?', 
   '["Allianz Stadium", "San Siro", "Olimpico", "Diego Armando Maradona"]'::jsonb, 1, 200),
  
  ('serie_a', 'medium', 'Quale squadra viene soprannominata "La Dea"?', 
   '["Atalanta", "Fiorentina", "Lazio", "Roma"]'::jsonb, 0, 200),
  
  -- Hard questions
  ('serie_a', 'hard', 'In che anno è stata fondata la Serie A?', 
   '["1898", "1929", "1945", "1960"]'::jsonb, 1, 300),
  
  ('serie_a', 'hard', 'Chi è stato il primo giocatore straniero a vincere il Pallone d''Oro giocando in Serie A?', 
   '["Michel Platini", "Marco van Basten", "Diego Maradona", "Zinedine Zidane"]'::jsonb, 0, 300)
ON CONFLICT DO NOTHING;

-- ============================================
-- QUIZ QUESTIONS (Champions League)
-- ============================================
INSERT INTO public.quiz_questions (category, difficulty, question, options, correct_answer, points_reward)
VALUES
  ('champions', 'easy', 'Quale squadra italiana ha vinto più Champions League?', 
   '["Juventus", "Inter", "Milan", "Roma"]'::jsonb, 2, 100),
  
  ('champions', 'medium', 'In quale anno il Milan ha vinto la sua settima Champions?', 
   '["2003", "2005", "2007", "2010"]'::jsonb, 2, 200),
  
  ('champions', 'hard', 'Quale squadra italiana ha vinto la prima Coppa dei Campioni nel 1963?', 
   '["Inter", "Milan", "Juventus", "Torino"]'::jsonb, 1, 300)
ON CONFLICT DO NOTHING;

-- ============================================
-- DAILY CHALLENGES (Today)
-- ============================================
INSERT INTO public.daily_challenges (title, description, type, requirement, points_reward, active_date)
VALUES
  ('Login Giornaliero', 'Accedi oggi a SPORTIUM', 'login', 
   '{"count": 1}'::jsonb, 100, CURRENT_DATE),
  
  ('Quiz del Giorno', 'Completa 5 quiz correttamente', 'quiz', 
   '{"count": 5, "correct": true}'::jsonb, 500, CURRENT_DATE),
  
  ('Fai un''Offerta', 'Piazza almeno 1 offerta in un''asta', 'auction', 
   '{"count": 1}'::jsonb, 200, CURRENT_DATE),
  
  ('Spin Wheel', 'Gira la ruota della fortuna', 'spin', 
   '{"count": 1}'::jsonb, 150, CURRENT_DATE)
ON CONFLICT DO NOTHING;

-- ============================================
-- REWARDS
-- ============================================
INSERT INTO public.rewards (title, description, category, cost_points, stock_total, stock_remaining, image_url)
VALUES
  -- Tickets
  ('Biglietto VIP - Serie A', 'Biglietto VIP per una partita di Serie A a scelta', 'tickets', 
   15000, 20, 20, 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800'),
  
  ('Meet & Greet Calciatore', 'Incontro esclusivo con un calciatore professionista', 'experiences', 
   25000, 5, 5, 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800'),
  
  -- Merchandise
  ('Maglia Autografata', 'Maglia ufficiale autografata dal capitano', 'merchandise', 
   8000, 30, 30, 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800'),
  
  ('Sciarpa Ufficiale', 'Sciarpa ufficiale della tua squadra del cuore', 'merchandise', 
   2000, 100, 100, 'https://images.unsplash.com/photo-1513028179155-324cfec2d017?w=800'),
  
  -- Digital
  ('Badge Esclusivo "Legend"', 'Badge digitale esclusivo per il tuo profilo', 'digital', 
   5000, NULL, NULL, 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=800'),
  
  ('Tema Premium "Champions"', 'Tema grafico esclusivo Champions per l''app', 'digital', 
   3000, NULL, NULL, 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800')
ON CONFLICT DO NOTHING;

-- ============================================
-- COMPLETED!
-- ============================================
-- Seed data inserted successfully
-- Database is now ready for testing!
