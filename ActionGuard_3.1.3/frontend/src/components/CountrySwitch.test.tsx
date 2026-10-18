import {beforeEach,expect,it} from 'vitest'
import {render,screen,fireEvent} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import {Workspace,useWorkspace} from '../integrated/hooks/workspace'
import {CountrySwitch} from './CountrySwitch'
function Probe(){const ws=useWorkspace();return <><button onClick={()=>{ws.setPlace({country:'US',name:'LA',lat:34,lon:-118});ws.update('old US warning')}}>등록</button><p data-testid="text">{ws.text}</p><p data-testid="place">{ws.place?.name??'none'}</p></>}
beforeEach(()=>localStorage.clear())
it('opens a country list from a compact button, clears incompatible source and persists the choice',()=>{render(<MemoryRouter><Workspace><CountrySwitch/><Probe/></Workspace></MemoryRouter>);fireEvent.click(screen.getByText('등록'));expect(screen.getByTestId('text')).toHaveTextContent('old US warning');expect(screen.queryByRole('group')).toBeNull();fireEvent.click(screen.getByRole('button',{name:'서비스 국가 선택 · 현재 미국'}));fireEvent.click(screen.getByRole('button',{name:/일본 JMA/}));expect(screen.getByRole('button',{name:'서비스 국가 선택 · 현재 일본'})).toHaveAttribute('aria-expanded','false');expect(screen.getByTestId('text')).toBeEmptyDOMElement();expect(screen.getByTestId('place')).toHaveTextContent('none');expect(localStorage.getItem('ag-country')).toBe('JP')})
it('closes with Escape and restores focus',()=>{render(<MemoryRouter><Workspace><CountrySwitch/></Workspace></MemoryRouter>);const b=screen.getByRole('button',{name:/서비스 국가 선택/});fireEvent.click(b);fireEvent.keyDown(document,{key:'Escape'});expect(b).toHaveFocus();expect(screen.queryByRole('group')).toBeNull()})
