import {render,screen,act,cleanup} from '@testing-library/react'
import {afterEach,expect,it,vi} from 'vitest'
import {NativeLaunchScreen,LAUNCH_VISIBLE_MS} from './NativeLaunchScreen'
const platform=vi.hoisted(()=>({native:true}))
vi.mock('@capacitor/core',()=>({Capacitor:{isNativePlatform:()=>platform.native}}))
afterEach(()=>{cleanup();vi.useRealTimers();vi.unstubAllGlobals();platform.native=true})
it('shows inline artwork on each native mount and keeps it visible after the first frame',()=>{
 vi.useFakeTimers()
 vi.stubGlobal('requestAnimationFrame',(cb:FrameRequestCallback)=>setTimeout(()=>cb(0),16))
 vi.stubGlobal('cancelAnimationFrame',clearTimeout)
 const view=render(<NativeLaunchScreen/>)
 expect(screen.getByRole('status').querySelector('svg path')).not.toBeNull()
 act(()=>vi.advanceTimersByTime(16+LAUNCH_VISIBLE_MS-1))
 expect(screen.getByRole('status')).toBeVisible()
 act(()=>vi.advanceTimersByTime(1))
 expect(screen.queryByRole('status')).toBeNull()
 view.unmount();render(<NativeLaunchScreen/>)
 expect(screen.getByRole('status')).toBeVisible()
})
it('does not cover the browser website with a native launch screen',()=>{
 platform.native=false;render(<NativeLaunchScreen/>);expect(screen.queryByRole('status')).toBeNull()
})
