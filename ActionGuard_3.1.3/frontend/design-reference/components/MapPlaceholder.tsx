import type { Shelter } from '@/types'
import { Pill } from './StatusBadge'
import styles from './MapPlaceholder.module.css'

const W = 360
const H = 220

/** 지도 라이브러리 없는 SVG 플레이스홀더. 경로선·길안내는 그리지 않는다. */
export function MapPlaceholder({ shelters, origin }: { shelters: Shelter[]; origin: { x: number; y: number } }) {
  const meX = (origin.x / 100) * W
  const meY = (origin.y / 100) * H
  const roadsX = [60, 140, 220, 300]
  const roadsY = [50, 110, 170]

  return (
    <figure className={styles.wrap}>
      <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg} role="img" aria-label="예시 위치와 지정 대피시설 위치를 직선거리 기준으로 보여 주는 약도">
        <rect width={W} height={H} fill="var(--color-block)" />
        {/* 물 영역 */}
        <path d={`M0 ${H - 60} C 80 ${H - 90}, 150 ${H - 20}, 230 ${H - 50} S ${W} ${H - 80}, ${W} ${H - 70} V ${H} H 0 Z`} fill="var(--color-water)" />
        {/* 격자 도로 */}
        {roadsX.map((x) => (
          <rect key={`x${x}`} x={x - 4} y={0} width={8} height={H} fill="var(--color-road)" />
        ))}
        {roadsY.map((y) => (
          <rect key={`y${y}`} x={0} y={y - 4} width={W} height={8} fill="var(--color-road)" />
        ))}
        {/* 내 위치 */}
        <circle cx={meX} cy={meY} r={16} fill="var(--color-primary)" fillOpacity={0.18} />
        <circle cx={meX} cy={meY} r={7} fill="var(--color-primary)" stroke="#fff" strokeWidth={3} />
        <text x={meX} y={meY + 30} textAnchor="middle" className={styles.label}>
          예시 위치
        </text>
        {/* 대피시설 마커 */}
        {shelters.map((s) => {
          const x = (s.mapX / 100) * W
          const y = (s.mapY / 100) * H
          return (
            <g key={s.id}>
              <path d={`M${x} ${y + 16} l-10 -14 a12 12 0 1 1 20 0 z`} fill="var(--color-emergency-bg)" />
              <text x={x} y={y + 1} textAnchor="middle" className={styles.marker}>
                {s.marker}
              </text>
            </g>
          )
        })}
      </svg>
      <span className={styles.pill}>
        <Pill variant="dark">지도 연결 예시</Pill>
      </span>
    </figure>
  )
}
