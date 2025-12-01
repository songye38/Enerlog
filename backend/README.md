# 프로젝트명

간단한 설명: 이 프로젝트는 FastAPI + Python + PostgreSQL + Railway 기반으로 **OOO 기능**을 제공하는 서버입니다.

---

## 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [아키텍처](#아키텍처)
3. [데이터베이스](#데이터베이스)
4. [API](#api)
5. [환경 변수 & 설정](#환경-변수--설정)
6. [배포](#배포)
7. [유지보수 가이드](#유지보수-가이드)
8. [추가 자료](#추가-자료)

---

## 프로젝트 개요

* **주요 기능**

  * 기능 A
  * 기능 B
  * 기능 C
* **기술 스택:** FastAPI, Python, PostgreSQL, Railway, Pydantic 등

---

## 아키텍처

* **서비스 구조**: 서버 ↔ DB ↔ 클라이언트
* 주요 컴포넌트:

  * FastAPI 서버: 엔드포인트, 요청/응답 처리
  * PostgreSQL: 테이블 구조, 관계
  * Railway: 배포 환경, 환경 변수, CI/CD

---

## 데이터베이스

---

### 데이터베이스 구조 설명

이 프로젝트의 데이터베이스는 **사용자 활동 기록과 관련된 행동(Behave), 태그, 에너지 레벨, 편지, 통계, 설정** 등을 관리하도록 설계됨.
PostgreSQL을 기준으로 모델링했으며, UUID를 PK로 사용하고, Enum과 관계(Relationship)로 다양한 연관 데이터를 연결함.

---

### 1. Users (사용자)

| 컬럼              | 타입       | 설명       |
| --------------- | -------- | -------- |
| id              | UUID     | PK       |
| email           | String   | 이메일 (고유) |
| hashed_password | String   | 비밀번호 해시  |
| nickname        | String   | 닉네임      |
| is_deleted      | Boolean  | 삭제 여부    |
| created_at      | DateTime | 생성 시각    |
| updated_at      | DateTime | 수정 시각    |

* **관계**

  * `activities`: 사용자가 등록한 활동(Activity)
  * `user_tags`: 사용자가 만든 커스텀 태그(UserTag)
  * `behaves`: 사용자의 행동 기록(Behave)
  * `letters`: 사용자가 작성한 편지(Letter)
  * `settings`: 사용자별 세팅(UserSettings)

---

### 2. Activities (활동)

| 컬럼                     | 타입       | 설명                    |
| ---------------------- | -------- | --------------------- |
| id                     | UUID     | PK                    |
| user_id                | UUID     | FK → users.id         |
| title                  | String   | 활동 제목                 |
| description            | Text     | 활동 설명                 |
| is_public              | Boolean  | 공개 여부                 |
| duration_minutes       | String   | 활동 소요 시간              |
| good_point             | Text     | 활동 장점                 |
| insight                | Text     | 인사이트                  |
| energy_level_id        | UUID     | FK → energy_levels.id |
| is_deleted             | Boolean  | 삭제 여부                 |
| created_at, updated_at | DateTime | 생성/수정 시각              |

* **관계**

  * `user`: 활동을 등록한 사용자
  * `behaves`: 활동과 연관된 행동 기록
  * `letters`: 활동 관련 편지

---

### 3. ActivityTemplate (활동 템플릿)

* Activity와 비슷하지만, 미리 정의된 템플릿용
* `energy_level_id`로 에너지 레벨 연동

---

### 4. EnergyLevel (에너지 레벨)

| 컬럼           | 타입          | 설명    |
| ------------ | ----------- | ----- |
| id           | UUID        | PK    |
| title        | String      | 레벨 이름 |
| energy_level | Enum (0~10) | 레벨 값  |
| value        | Integer     | 레벨 점수 |
| description  | Text        | 설명    |

* **관계**

  * `preset_tags`: 해당 에너지 레벨과 관련된 프리셋 태그(PresetTag)

---

### 5. Tag / PresetTag / UserTag / BehaveTag (태그)

### Tag

* `title`: 태그 이름
* `type`: body / mental
* **관계**

  * `preset_tags`, `user_tags`, `behave_tags`와 다대다 관계

### PresetTag

* 에너지 레벨과 연결된 미리 정의된 태그
* `type`: body / mental

### UserTag

* 사용자가 만든 커스텀 태그
* `type`: body / mental

### BehaveTag

* 행동 기록(Behave)와 연결되는 태그
* `phase`: before / after

**태그 연결 테이블**

* `preset_tag_tags`: PresetTag ↔ Tag
* `user_tag_tags`: UserTag ↔ Tag
* `behave_tag_tags`: BehaveTag ↔ Tag

---

### 6. Behave (행동 기록)

| 컬럼                 | 타입      | 설명                                              |
| ------------------ | ------- | ----------------------------------------------- |
| id                 | UUID    | PK                                              |
| user_id            | UUID    | FK → users.id                                   |
| activity_id        | UUID    | FK → activities.id                              |
| before_energy      | Enum    | 행동 전 에너지 레벨                                     |
| after_energy       | Enum    | 행동 후 에너지 레벨 (선택적)                               |
| before_description | Text    | 행동 전 코멘트                                        |
| after_description  | Text    | 행동 후 코멘트                                        |
| status             | Enum    | emotion_recorded / activity_pending / completed |
| is_deleted         | Boolean | 삭제 여부                                           |

* **관계**

  * `behave_tags`: 행동 관련 태그
  * `photos`: 행동 관련 사진

* **편의 속성**

  * `before_tags`, `after_tags`
  * `before_mental_tags`, `before_body_tags`, `after_mental_tags`, `after_body_tags`

---

### 7. BehavePhoto (행동 사진)

* `photo_url` 저장
* FK → Behave.id

---

### 8. Letter (편지)

* 사용자가 남긴 글
* 관련 활동(optional): `related_activity_id`

---

### 9. 통계(UserEnergyTagStats)

* 사용자의 태그 선택 통계
  | 컬럼 | 타입 | 설명 |
  |------|------|------|
  | user_id | UUID | FK → users.id |
  | energy_level | Enum | 선택한 에너지 레벨 |
  | tag_type | Enum | body / mental |
  | tag_id | UUID | FK → tags.id |
  | selected_count | Integer | 선택 횟수 |

---

### 10. UserSettings (사용자 설정)

* `max_recommendations`: 추천 최대 개수


---

## API

* FastAPI 자동 문서: [`/docs` (Swagger) (Redoc)](https://api.enerlog.kr/docs#/)
* 주요 엔드포인트 요약:

| Method | Endpoint | 요청 예시              | 응답 예시                       | 설명        |
| ------ | -------- | ------------------ | --------------------------- | --------- |
| GET    | /users   | -                  | JSON list                   | 사용자 목록 조회 |
| POST   | /users   | `{ "name": "송이" }` | `{ "id": 1, "name": "송이" }` | 사용자 생성    |


---

## Pydantic 스키마

이 프로젝트에서는 **FastAPI + Pydantic**을 활용해 DB 모델과 API 요청/응답 데이터를 명확하게 구분함.
모든 스키마는 `orm_mode=True` 또는 Pydantic 2.x 기준 `model_config={"from_attributes": True}`를 적용해 **SQLAlchemy ORM 객체 → JSON 변환**이 가능하게 설계됨.

---

### 1. User 관련 스키마

| 스키마          | 용도        | 주요 필드                                                   |
| ------------ | --------- | ------------------------------------------------------- |
| `UserCreate` | 회원 가입 요청  | email, hashed_password, nickname                        |
| `UserLogin`  | 로그인 요청    | email, password                                         |
| `UserOut`    | 사용자 정보 응답 | id, email, nickname, is_deleted, created_at, updated_at |

* **설명:** 회원 생성/로그인/조회 등 사용자 관련 API에 사용됨.
* `UserOut`은 ORM 객체에서 직접 변환 가능.

---

### 2. Activity 관련 스키마

| 스키마                      | 용도        | 주요 필드                                                                              |
| ------------------------ | --------- | ---------------------------------------------------------------------------------- |
| `ActivityCreate`         | 활동 생성 요청  | title, description, duration_minutes, energy_level (Enum)                          |
| `ActivityUpdate`         | 활동 수정 요청  | title, description, duration_minutes, energy_level                                 |
| `ActivityOut`            | 활동 응답     | id, title, description, energy_level: `EnergyLevelMiniOut`, created_at, updated_at |
| `ActivityTemplateCreate` | 템플릿 생성 요청 | title, description, energy_level                                                   |
| `ActivityTemplateOut`    | 템플릿 조회 응답 | id, title, description, energy_level, count                                        |

* **설명:**

  * `energy_level`을 Enum으로 받아 DB 모델과 연결
  * `ActivityOut`은 `EnergyLevelMiniOut` 관계 객체를 포함하여 API 응답 시 에너지 레벨 정보까지 제공
  * 템플릿은 생성과 조회 시 count 필드를 통해 추천 수나 사용 통계 표현 가능

---

### 3. EnergyLevel 관련 스키마

| 스키마                   | 용도    | 주요 필드                                                          |
| --------------------- | ----- | -------------------------------------------------------------- |
| `EnergyLevelCreate`   | 생성 요청 | user_id, title, value, description                             |
| `EnergyLevelOut`      | 조회 응답 | id, user_id, title, value, description, created_at, updated_at |
| `EnergyLevelRequest`  | 요청 바디 | level (0~10)                                                   |
| `EnergyLevelResponse` | 응답    | id (UUID 문자열)                                                  |

* **설명:**

  * 에너지 레벨은 사용자별/활동별로 관리됨
  * 요청 시 0~10 범위 체크(`Field(ge=0, le=10)`)

---

### 4. Tag 관련 스키마

| 스키마                | 용도        | 주요 필드                                           |
| ------------------ | --------- | ----------------------------------------------- |
| `TagCreate`        | 태그 생성     | title, type(body/mental)                        |
| `TagOut`           | 태그 조회     | id, title, type, created_at, updated_at         |
| `PresetTagCreate`  | 프리셋 태그 생성 | energy_level_id, type, tag_ids                  |
| `PresetTagOut`     | 프리셋 태그 조회 | id, energy_level_id, type, tags: `List[TagOut]` |
| `UserTagsRequest`  | 유저 태그 요청  | energy_level(Enum)                              |
| `UserTagsResponse` | 유저 태그 응답  | tags: `List[TagOut]`                            |

* **설명:**

  * DB 모델에서의 PresetTag, UserTag, BehaveTag 구조를 반영
  * 다대다 관계를 리스트로 포함하여 응답 제공

---

### 5. Behave (행동 기록) 관련 스키마

| 스키마                   | 용도       | 주요 필드                                                               |
| --------------------- | -------- | ------------------------------------------------------------------- |
| `BehaveCreateRequest` | 행동 기록 생성 | before_energy, before_description, status, user_tags, preset_tags   |
| `BehaveResponse`      | 행동 기록 조회 | id, user_id, before_energy, before_description, status, behave_tags |
| `BehaveTagCreate`     | 행동 태그 추가 | behave_id, tag_ids, phase(before/after)                             |
| `BehaveTagOut`        | 행동 태그 응답 | id, behave_id, phase, tags: List[TagPayload]                        |
| `BehavePhotoCreate`   | 행동 사진 등록 | behave_id, photo_url                                                |
| `BehavePhotoOut`      | 행동 사진 응답 | id, behave_id, photo_url, created_at, updated_at                    |

* **설명:**

  * `phase` (before/after)로 행동 전후 태그 구분
  * 태그를 리스트 형태로 관리하여 여러 태그 동시 저장 가능
  * 행동 사진도 별도 스키마로 관리

---

### 6. Letter 관련 스키마

| 스키마            | 용도       | 주요 필드                                                           |
| -------------- | -------- | --------------------------------------------------------------- |
| `LetterCreate` | 편지 생성 요청 | user_id, related_activity_id, content                           |
| `LetterOut`    | 편지 조회 응답 | id, user_id, content, related_activity: `Optional[ActivityOut]` |

* **설명:**

  * 관련 활동(optional) 포함 가능
  * ORM 모델 기반 변환 가능

---

### 7. 공통 패턴

1. **ORM 변환 가능**:

   * `orm_mode=True` (Pydantic <2.x)
   * `model_config={"from_attributes": True}` (Pydantic 2.x)

2. **Enum 활용**:

   * `EnergyLevelEnum`, `BehaveStatusEnum`, `TagTypeEnum`, `PhaseEnum` 등으로 타입 안정성 확보

3. **관계 포함**:

   * Activity → EnergyLevel
   * PresetTag → Tag
   * Behave → BehaveTag → Tag
   * Letter → Activity

4. **선택적 필드**:

   * Optional 타입 사용으로 요청/응답 유연성 확보



## 환경 변수 & 설정

```env
DATABASE_URL=postgresql://user:pass@host:port/dbname
SECRET_KEY=your_secret_key
RAILWAY_ENV=production
```

---

## 배포

1. Railway 프로젝트 생성
2. GitHub 연동 및 자동 배포
3. 환경 변수 설정
4. 배포 확인: `curl https://your-app.up.railway.app/`

---

## 유지보수 가이드

* 코드 구조 설명
* 기능 추가 시 참고 사항
* DB 마이그레이션: Alembic 사용

---

