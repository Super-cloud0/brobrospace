// backend/server.js
import express from 'express';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();
const app = express();
app.use(express.json());

const SUPA_URL = process.env.SUPABASE_URL;
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE; // ТОЛЬКО НА СЕРВЕРЕ
const supabase = createClient(SUPA_URL, SUPA_KEY);

// Получить все объекты
app.get('/api/objects', async (req, res) => {
  const { data, error } = await supabase.from('space_objects').select('*').order('name');
  if (error) return res.status(500).json({ error });
  res.json(data);
});

// Вставка новой записи (например после загрузки файла)
app.post('/api/objects', async (req, res) => {
  const payload = req.body; // ожидаем объект с полями name,type,description,...
  const { data, error } = await supabase.from('space_objects').insert([payload]).select();
  if (error) return res.status(500).json({ error });
  res.json(data);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server listening ${PORT}`));
