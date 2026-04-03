// app/page.tsx
// Главная страница — определяет город и редиректит
// Для Яндекс Директ: трафик идёт напрямую на /stavropol/ — эта страница для прямых заходов

import { redirect } from 'next/navigation'
import { cities } from '@/data/cities'

export default function HomePage() {
  // При SSG — показываем дефолтный город (Ставрополь)
  // На клиенте — JS определит город по IP и редиректнет
  redirect('/stavropol/')
}
