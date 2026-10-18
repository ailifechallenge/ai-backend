import {expect,it} from 'vitest'
import {render,screen} from '@testing-library/react'
import {CategoryExplanation,categoryMention} from './CategoryExplanation'
it('explains source category 4 as wind intensity rather than an app evacuation grade',()=>{render(<CategoryExplanation source="Category 4 Typhoon Warning" translation="카테고리 4 등급의 태풍"/>);expect(screen.getByRole('heading')).toHaveTextContent('바람의 세기');expect(screen.getByText(/209~251km/)).toBeVisible();expect(screen.getByText(/대피 단계와 다릅니다/)).toBeVisible()})
it('marks a category found only in the translation as unconfirmed',()=>{render(<CategoryExplanation source="Typhoon Warning" translation="카테고리 4 태풍"/>);expect(screen.getByText(/원문에서 이 등급은 확인하지 못했습니다/)).toBeVisible()})
it('uses the source and calls out a contradictory translated category',()=>{render(<CategoryExplanation source="Category 3 hurricane" translation="카테고리 4 태풍"/>);expect(screen.getByRole('heading')).toHaveTextContent('카테고리 3');expect(screen.getByText(/원문과 번역의 풍속 등급이 다릅니다/)).toBeVisible()})
it('does not infer categories from numbers or match category 10 as category 1',()=>{expect(categoryMention('Warning at 4 PM')).toBeNull();expect(categoryMention('Category 10')).toBeNull();render(<CategoryExplanation source="Wind Advisory" translation="강풍 주의보"/>);expect(screen.queryByRole('complementary')).toBeNull()})
