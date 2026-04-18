import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const Home: any = lazy((): any => import('@/pages/Home'));

export default function App() {
  return (
      <BrowserRouter>
        <Suspense fallback="Loading...">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
  );
}