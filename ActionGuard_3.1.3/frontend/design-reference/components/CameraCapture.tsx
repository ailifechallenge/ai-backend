import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CameraIcon } from './Icons'
import styles from './CameraCapture.module.css'

interface Props {
  open: boolean
  onClose: () => void
  /** 촬영한 사진 (JPEG) */
  onCapture: (file: File) => void
  /** 카메라를 열 수 없을 때(미지원·권한 거부) — 휴대폰 기본 카메라 입력으로 대신한다 */
  onUnavailable: (reason: string) => void
}

/** 기기 카메라를 열어 미리보기 후 촬영한다 (getUserMedia, 후면 카메라 우선) */
export function CameraCapture({ open, onClose, onCapture, onUnavailable }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    setReady(false)

    if (!navigator.mediaDevices?.getUserMedia) {
      onUnavailable('이 브라우저에서는 카메라를 바로 열 수 없어요.')
      return
    }
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          void videoRef.current.play().then(() => !cancelled && setReady(true))
        }
      })
      .catch((e: unknown) => {
        if (cancelled) return
        const denied = e instanceof DOMException && (e.name === 'NotAllowedError' || e.name === 'SecurityError')
        onUnavailable(denied ? '카메라 권한이 거부됐어요. 브라우저 설정에서 카메라를 허용해 주세요.' : '카메라를 열 수 없어요.')
      })

    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
  }, [open, onUnavailable])

  const shoot = () => {
    const video = videoRef.current
    if (!video || !video.videoWidth) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')?.drawImage(video, 0, 0)
    canvas.toBlob(
      (blob) => {
        if (!blob) return
        onCapture(new File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' }))
      },
      'image/jpeg',
      0.9,
    )
  }

  if (!open) return null

  return createPortal(
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="카메라로 촬영">
      <video ref={videoRef} className={styles.video} playsInline muted />
      {!ready && (
        <p className={styles.status} role="status">
          카메라를 여는 중이에요…
        </p>
      )}
      <div className={styles.controls}>
        <button type="button" className={styles.cancel} onClick={onClose}>
          취소
        </button>
        <button type="button" className={styles.shutter} onClick={shoot} disabled={!ready} aria-label="촬영">
          <CameraIcon width={28} height={28} />
        </button>
        <span className={styles.spacer} aria-hidden />
      </div>
    </div>,
    document.body,
  )
}
