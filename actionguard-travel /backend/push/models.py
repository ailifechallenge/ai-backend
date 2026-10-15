import re
from typing import Literal
from pydantic import BaseModel,ConfigDict,Field,field_validator,model_validator
COASTS=set('100 101 102 110 111 120 200 201 202 210 220 230 240 250 300 310 311 312 320 321 330 340 341 350 360 361 370 380 390 391 400 500 510 520 521 522 530 540 550 551 560 570 580 590 600 601 610 700 701 710 711 712 720 730 731 740 750 751 760 770 771 772 773 800 801 802'.split())

class Preferences(BaseModel):
    model_config=ConfigDict(extra='forbid')
    prefectures:list[str]=Field(default_factory=list,max_length=47)
    tsunami_regions:list[str]=Field(default_factory=list,max_length=66)
    seismic_hazards:list[Literal['earthquake','tsunami']]=Field(default_factory=lambda:['earthquake','tsunami'],max_length=2)
    weather_regions:list[str]=Field(default_factory=list,max_length=10)
    weather_hazards:list[Literal['rain','flood','wind','storm','snow','heat','cold','coastal','landslide','fire','fog','other']]=Field(default_factory=list,max_length=12)
    @field_validator('seismic_hazards','weather_hazards','weather_regions')
    @classmethod
    def selections(cls,v):return sorted(set(v))
    @field_validator('weather_regions')
    @classmethod
    def weather_regions_valid(cls,v):
        from backend.push.weather import STATES
        for scope in v:
            if re.fullmatch(r'US:[A-Z]{2}:[A-Z]{2}[CZ][0-9]{3}',scope):
                _,state,zone=scope.split(':')
                if state not in STATES or zone[:2]!=state:raise ValueError('미국 경보 구역을 확인하세요.')
            elif not re.fullmatch(r'JP:[0-9]{6}:[0-9]{7}',scope):raise ValueError('기상경보 지역 형식을 확인하세요.')
        return v
    minimum_intensity:Literal['1','2','3','4','5-','5+','6-','6+','7']='3'
    @field_validator('prefectures')
    @classmethod
    def prefectures_valid(cls,v):
        if any(not re.fullmatch(r'0[1-9]|[1-3][0-9]|4[0-7]',x) for x in v):raise ValueError('일본 도도부현 코드가 필요합니다.')
        return sorted(set(v))
    @field_validator('tsunami_regions')
    @classmethod
    def coasts_valid(cls,v):
        if any(x not in COASTS for x in v):raise ValueError('쓰나미 예보구 코드가 필요합니다.')
        return sorted(set(v))
    @model_validator(mode='after')
    def selected(self):
        if bool(self.weather_regions)!=bool(self.weather_hazards):raise ValueError('기상경보 지역과 재난 유형을 함께 선택하세요.')
        if not (self.prefectures and 'earthquake' in self.seismic_hazards or self.tsunami_regions and 'tsunami' in self.seismic_hazards or self.weather_regions and self.weather_hazards):raise ValueError('알림을 받을 지역과 재난 유형을 선택하세요.')
        return self
class Registration(BaseModel):
    model_config=ConfigDict(extra='forbid')
    enrollment_code:str=Field(min_length=20,max_length=128)
    provider:Literal['apns','fcm']
    token:str=Field(min_length=20,max_length=4096,repr=False)
    preferences:Preferences
    @model_validator(mode='after')
    def token_format(self):
        if self.provider=='apns' and not re.fullmatch(r'[A-Fa-f0-9]{64,256}',self.token):raise ValueError('APNs 기기 토큰 형식이 올바르지 않습니다.')
        if self.provider=='fcm' and not all(33<=ord(c)<=126 for c in self.token):raise ValueError('FCM 기기 토큰 형식이 올바르지 않습니다.')
        return self
class Update(BaseModel):
    model_config=ConfigDict(extra='forbid')
    token:str|None=Field(default=None,min_length=20,max_length=4096,repr=False)
    preferences:Preferences
    @field_validator('token')
    @classmethod
    def token_valid(cls,v):
        if v and not all(33<=ord(c)<=126 for c in v):raise ValueError('기기 토큰을 확인하세요.')
        return v
