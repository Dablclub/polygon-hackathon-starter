import PageWithAppbar from '@/components/layout/page-wrapper'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <PageWithAppbar>
      <div className="page space-y-8 text-center">
        <h1>Onchain Starter</h1>
        <h3>
          Get a head start on your hack with
          <br />
          <Link href="https://dabl.club">Dabl Club</Link>
        </h3>
        <Link href="https://learn.dabl.club" target="_blank">
          <Button size="lg">check the tutorial!</Button>
        </Link>
      </div>
    </PageWithAppbar>
  )
}
