"use server"
import dynamic from 'next/dynamic';
const LineGraph = dynamic(() => import('@/components/LineGraph'), { ssr: false });
const AreaGraph = dynamic(() => import('@/components/AreaGraph'), { ssr: false});
const PieGraph = dynamic(() => import('@/components/PieGraph'), { ssr: false});

export default async function Home() {
  return (
    <>
      <div className="mb-4">
        <PieGraph/>
      </div>
      <div className="mb-4">
        <LineGraph/>
      </div>
      <div>
        <AreaGraph/>
      </div>
    </>
  ) 
}
