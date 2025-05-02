import PageWithAppbar from '@/components/layout/page-wrapper'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <PageWithAppbar>
      <div className="page space-y-8 text-center">
        <h1>Polygon Hackathon Starter</h1>
        <h3>
          get a head start on your hack with
          <br />
          <Link href="https://ethglobal.com/events/bangkok/prizes#polygon">
            Polygon
          </Link>{' '}
          and{' '}
          <Link href="https://ethglobal.com/events/bangkok/prizes#dynamic">
            Dynamic.xyz
          </Link>
        </h3>
        <Link href="https://learn.dabl.club" target="_blank">
          <Button size="lg">check the tutorial!</Button>
        </Link>
      </div>
    </PageWithAppbar>
  )
}
