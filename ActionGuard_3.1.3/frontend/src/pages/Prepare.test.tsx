import {beforeEach,it,expect} from 'vitest'
import {render,screen,fireEvent} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import {Workspace} from '../integrated/hooks/workspace'
import Prepare from './Prepare'
beforeEach(()=>localStorage.clear())
it('splits a previously checked combined supply group into individually saved items',()=>{
 localStorage.setItem('ag-team-supplies',JSON.stringify(['물 · Bottled water · 飲料水','손전등 · 여권 사본 · 비상 연락처']))
 render(<MemoryRouter><Workspace><Prepare/></Workspace></MemoryRouter>)
 expect(screen.getAllByRole('checkbox')).toHaveLength(6)
 expect(screen.getByRole('checkbox',{name:'여권 사본'})).toBeChecked()
 expect(screen.getByRole('checkbox',{name:'비상 연락처'})).toBeChecked()
 expect(screen.getByRole('status')).toHaveTextContent('4 / 6개')
 fireEvent.click(screen.getByRole('checkbox',{name:'여권 사본'}))
 expect(screen.getByRole('checkbox',{name:'손전등'})).toBeChecked()
 expect(JSON.parse(localStorage.getItem('ag-team-supplies')!)).not.toContain('여권 사본')
 expect(screen.queryByText(/현지어:/)).toBeNull()
})
