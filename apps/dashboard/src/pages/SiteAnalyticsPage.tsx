import { useQuery } from '@tanstack/react-query'
import { Eye, Globe2, Link2, Users } from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import type { SiteAnalytics } from '@uidesired/types'
import { SiteSubnav } from '../components/SiteChrome'
import { sitesApi } from '../lib/endpoints'
import { Card, EmptyState, PageHeader } from '../ui/primitives'

const RANGES = [
  { days: 7, label: '7 days' },
  { days: 30, label: '30 days' },
  { days: 90, label: '90 days' },
] as const

function Metric({ label, value, icon: Icon }: { label: string; value: string | number; icon: typeof Eye }) {
  return (
    <Card className="relative overflow-hidden">
      <Icon className="absolute right-4 top-4 text-zinc-700" size={30} />
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
    </Card>
  )
}

function TrendChart({ trend }: { trend: SiteAnalytics['trend'] }) {
  const max = Math.max(1, ...trend.flatMap((row) => [row.views, row.uniques]))
  const points = (key: 'views' | 'uniques') =>
    trend
      .map((row, index) => `${trend.length === 1 ? 50 : (index / (trend.length - 1)) * 100},${100 - (row[key] / max) * 85}`)
      .join(' ')

  return (
    <div>
      <svg viewBox="0 0 100 105" preserveAspectRatio="none" className="h-52 w-full overflow-visible">
        <line x1="0" y1="100" x2="100" y2="100" stroke="#3f3f46" strokeWidth=".5" />
        <polyline points={points('views')} fill="none" stroke="#3b82f6" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        <polyline points={points('uniques')} fill="none" stroke="#10b981" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="mt-3 flex items-center justify-between text-xs text-zinc-600">
        <span>{trend.length ? new Date(trend[0].date).toLocaleDateString() : ''}</span>
        <span className="flex gap-4">
          <i className="not-italic text-blue-400">● Views</i>
          <i className="not-italic text-emerald-400">● Unique visitors</i>
        </span>
        <span>{trend.length ? new Date(trend[trend.length - 1].date).toLocaleDateString() : ''}</span>
      </div>
    </div>
  )
}

function TopList({
  title,
  icon: Icon,
  rows,
  empty,
}: {
  title: string
  icon: typeof Globe2
  rows: Array<{ label: string; views: number }>
  empty: string
}) {
  const max = Math.max(1, ...rows.map((row) => row.views))
  return (
    <Card>
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-white">
        <Icon size={15} className="text-zinc-500" />
        {title}
      </div>
      {rows.length === 0 ? (
        <p className="text-xs text-zinc-600">{empty}</p>
      ) : (
        <ul className="space-y-2">
          {rows.map((row) => (
            <li key={row.label} className="text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="truncate text-zinc-300" title={row.label}>
                  {row.label}
                </span>
                <span className="shrink-0 text-zinc-500">{row.views}</span>
              </div>
              <div className="mt-1 h-1 overflow-hidden rounded-full bg-zinc-800">
                <div className="h-full rounded-full bg-blue-500" style={{ width: `${(row.views / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

export function SiteAnalyticsPage() {
  const { id } = useParams()
  const [days, setDays] = useState<7 | 30 | 90>(7)

  const analytics = useQuery({
    queryKey: ['site-analytics', id, days],
    queryFn: () => sitesApi.analytics(id!, days),
    enabled: Boolean(id),
  })

  const data = analytics.data

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Page views this site's runtime records itself, with no Google Analytics setup required. Visits are counted without ever storing a visitor's IP address."
        actions={
          <div className="flex gap-1 rounded-lg border border-zinc-800 p-1">
            {RANGES.map((range) => (
              <button
                key={range.days}
                type="button"
                onClick={() => setDays(range.days)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  days === range.days ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        }
      />
      <SiteSubnav />

      {!analytics.isLoading && data && data.views === 0 ? (
        <Card className="px-6 py-12">
          <EmptyState
            title="No visits recorded yet"
            description="Once this site is published and gets its first visit, views will start showing up here."
          />
        </Card>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="Views" value={data?.views ?? 0} icon={Eye} />
            <Metric label="Unique visitors" value={data?.uniques ?? 0} icon={Users} />
            <Metric label="Pages visited" value={data?.top_pages.length ?? 0} icon={Globe2} />
            <Metric label="Referring sites" value={data?.top_referrers.length ?? 0} icon={Link2} />
          </div>

          <Card className="mt-4">{data ? <TrendChart trend={data.trend} /> : null}</Card>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <TopList
              title="Top pages"
              icon={Globe2}
              rows={(data?.top_pages ?? []).map((row) => ({ label: row.path, views: row.views }))}
              empty="No page views yet."
            />
            <TopList
              title="Top referrers"
              icon={Link2}
              rows={(data?.top_referrers ?? []).map((row) => ({ label: row.host, views: row.views }))}
              empty="No visits from another site yet."
            />
            <TopList
              title="Top countries"
              icon={Globe2}
              rows={(data?.top_countries ?? []).map((row) => ({ label: row.country, views: row.views }))}
              empty="No location data yet."
            />
          </div>
        </>
      )}
    </div>
  )
}
