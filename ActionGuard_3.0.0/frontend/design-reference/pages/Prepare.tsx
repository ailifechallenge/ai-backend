import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ActionSteps } from '@/components/ActionSteps'
import { AlertStateView } from '@/components/AlertStateView'
import { ButtonAnchor } from '@/components/Button'
import { Card, Note, PageBody } from '@/components/Card'
import { AlertTriangleIcon, ExternalIcon } from '@/components/Icons'
import { PageHeader } from '@/components/PageHeader'
import { SOS_PHRASES, SosCard, type SosKey } from '@/components/SosCard'
import { useGuidance, useTranslation } from '@/hooks/useAlertAnalysis'
import { useAsync } from '@/hooks/useAsync'
import { useCurrentAlert } from '@/hooks/useCurrentAlert'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { SCHEDULE_KIND_LABELS } from '@/lib/labels'
import { listSchedule } from '@/services/scheduleService'
import styles from './Prepare.module.css'

// 사전 대비 모드 — 준비물·현지어 카드·구매처 안내는 이 화면에만 둔다.

const mapsUrl = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${q} near Houston, TX`)}`

const SUPPLIES = [
  { ko: '물', en: 'Bottled water', place: '가까운 매장', query: 'grocery store' },
  { ko: '보조배터리', en: 'Portable charger', place: '가까운 매장', query: 'electronics store' },
  { ko: '상비약', en: 'First aid kit', place: '가까운 약국', query: 'pharmacy' },
]

type Tab = 'supplies' | 'sos' | 'official'

const TABS: [Tab, string][] = [
  ['supplies', '사전 대비 물품'],
  ['sos', 'SOS 카드'],
  ['official', '공식 행동 카드'],
]

export default function Prepare() {
  const [params] = useSearchParams()
  const fromId = params.get('from')
  const { load, alert, retry } = useCurrentAlert()
  // 일정 화면 "대비 방법 보기"에서 넘어온 경우 그 일정을 찾는다
  const { data: items } = useAsync(listSchedule, [])
  const fromItem = fromId ? items?.find((i) => i.id === fromId) : undefined

  const [tab, setTab] = useState<Tab>('supplies')
  const [phrase, setPhrase] = useState<SosKey>('emergency')
  const [address, setAddress] = useLocalStorage('ag.prepare.hotelAddress', '')

  // 공식 행동 카드 탭을 열 때만 행동지침·번역을 불러온다 (번역은 경보당 1회 캐시)
  const official = tab === 'official' ? alert : undefined
  const { step: guidance, retry: retryGuidance } = useGuidance(official)
  const { step: translation } = useTranslation(official)

  return (
    <>
      <PageHeader title="사전 대비" subtitle="재난이 오기 전에 미리 준비해요" />
      <PageBody>
        <p className={styles.warn}>
          <AlertTriangleIcon className={styles.warnIcon} />
          <span>긴급 상황에서는 이 화면 대신 홈의 공식 지시를 먼저 따르세요.</span>
        </p>

        <div className={styles.segment} role="tablist" aria-label="사전 대비 메뉴">
          {TABS.map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              className={`${styles.segItem} ${tab === key ? styles.segActive : ''}`}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {fromItem && (
          <p className={styles.fromChip}>
            {fromItem.title} · {SCHEDULE_KIND_LABELS[fromItem.kind]} 기준
          </p>
        )}

        {tab === 'supplies' && (
          <Card title="물품 안내 · 사전 구매 안내">
            <ul className={styles.supplies}>
              {SUPPLIES.map((s) => (
                <li key={s.en} className={styles.supply}>
                  <div className={styles.supplyText}>
                    <p className={styles.supplyKo}>{s.ko}</p>
                    <p className={styles.supplyEn} lang="en">
                      {s.en}
                    </p>
                  </div>
                  <ButtonAnchor variant="secondary" href={mapsUrl(s.query)} target="_blank" rel="noopener noreferrer">
                    {s.place} <ExternalIcon />
                  </ButtonAnchor>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {tab === 'sos' && (
          <>
            <div className={styles.chips}>
              {(Object.keys(SOS_PHRASES) as SosKey[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  aria-pressed={phrase === k}
                  className={`${styles.chip} ${phrase === k ? styles.chipActive : ''}`}
                  onClick={() => setPhrase(k)}
                >
                  {SOS_PHRASES[k].chip}
                </button>
              ))}
            </div>
            <SosCard phrase={phrase} address={address} />
            <Card>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>숙소 주소 (영문)</span>
                <input
                  className={styles.input}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="예: 1600 Smith St, Houston, TX"
                />
              </label>
              <Note>이 기기(localStorage)에만 저장돼요. 문장은 고정 문구이며 편집·번역되지 않아요.</Note>
            </Card>
          </>
        )}

        {tab === 'official' &&
          (alert && load.status === 'ready' ? (
            <ActionSteps alert={alert} title="공식 행동 카드" guidance={guidance} translation={translation} onRetry={retryGuidance} />
          ) : (
            load.status !== 'ready' && <AlertStateView load={load} onRetry={retry} />
          ))}
      </PageBody>
    </>
  )
}
