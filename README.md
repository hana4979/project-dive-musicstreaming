# 🎧 DIVE - 음악 스트리밍 웹 플랫폼 (Music Streaming Web Platform)

<p align="left">
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=black" />
  <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=flat-square&logo=Spring-Boot&logoColor=white" />
  <img src="https://img.shields.io/badge/Spring_Security-6DB33F?style=flat-square&logo=Spring-Security&logoColor=white" />
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=MySQL&logoColor=white" />
  <img src="https://img.shields.io/badge/AWS-232F3E?style=flat-square&logo=Amazon-AWS&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=Docker&logoColor=white" />
</p>

> **"내 취향대로, 손쉽게 만드는 재생목록부터 나만을 위한 감정 기반 음악 추천까지!"**  
> DIVE는 기존 스트리밍 서비스(지니, 네이버 VIBE, 유튜브 뮤직 등)를 벤치마킹하여 사용자 취향 중심의 스트리밍, 감정 기반 AI 챗봇 추천, 멤버십 및 음원/선물 결제, 관리자 통계 시각화 기능을 통합 제공하는 웹 스트리밍 플랫폼입니다.

---

## 📌 목차
1. [프로젝트 개요](#1-프로젝트-개요)
2. [기술 스택 (Tech Stack)](#2-기술-스택-tech-stack)
3. [팀원 구성 및 역할 (Team & Roles)](#3-팀원-구성-및-역할-team--roles)
4. [개발 일정 (Timeline)](#4-개발-일정-timeline)
5. [데이터베이스 설계 (DB ERD)](#5-데이터베이스-설계-db-erd)
6. [주요 화면 및 담당 기능](#6-주요-화면-및-담당-기능)
7. [트러블슈팅 (Troubleshooting)](#7-트러블슈팅-troubleshooting)
8. [프로젝트 링크 및 참조](#8-프로젝트-링크-및-참조)

---

## 1. 프로젝트 개요

* **프로젝트명**: DIVE (팀 DIVE)
* **개발 기간**: 2025.02.07 ~ 2025.03.03 (약 4주)
* **목표 서비스**:
  * 사용자 기분 및 취향에 맞춘 자동 재생 알고리즘 및 AI 추천 챗봇
  * 무제한 듣기/다운로드/선물하기 등 다양한 토스 페이먼츠 기반 결제 시스템
  * 연령/성별/스트리밍 통계 시각화 중심의 통합 관리자(Admin) 시스템

---

## 2. 기술 스택 (Tech Stack)

### Development
| 구분 | 기술 / 도구 |
| :--- | :--- |
| **Frontend** | React, JavaScript, HTML5, CSS3 |
| **Backend** | Java, Spring Boot, Spring Data JPA, Spring Security |
| **Database** | MySQL |
| **Infra & DevOps** | AWS S3, AWS CloudFront, Docker, AWS EC2 |
| **Tools** | IntelliJ IDEA, VS Code, Git, GitHub, Notion, Slack |

---

## 3. 팀원 구성 및 역할 (Team & Roles)

| 이름 | 담당 역할 및 핵심 개발 영역 |
| :---: | :--- |
| **노하나** *(팀장)* | • **프로젝트 총괄 및 시큐리티 구축**<br>• 회원가입/로그인 백엔역 로직 개발<br>• 멤버십 구매/선물/활성화 백엔드 구현<br>• 감정 기반 자동 연속재생 알고리즘(백엔드) 및 음악 추천 챗봇 개발 |
| **허내강** | • **음악 재생 및 결제 핵심 시스템 개발**<br>• 음악 재생 기능(Front/Back) 연동<br>• 개별 곡 장바구니 / 구매 / 선물하기 개발<br>• 마이페이지 선물함 백엔드 및 인기차트 백엔드 구축<br>• 토스 페이먼츠 결제 시스템 연동 |
| **이윤형** | • **프론트엔드 총괄 및 AWS 배포**<br>• 음악/앨범/아티스트 메인 및 상세 화면(Front)<br>• 플레이리스트 생성/추가, 좋아요 보관함, 결제내역 조회(Front)<br>• 회원 정보 조회 및 수정, 음원 MP3 다운로드 구현<br>• AWS 인프라 구축 및 배포 |
| **류인형** | • **사용자 페이지 UI/UX 및 AI 챗봇**<br>• 인기차트 화면 구현(Front)<br>• 댓글 작성/조회 및 좋아요 등록 기능 개발<br>• 관리자 페이지 멤버십 추가 화면 구현<br>• AI 챗봇 인터페이스 및 연동 담당 |
| **강성일** | • **관리자(Admin) 시스템 총괄**<br>• 통계 대시보드 (스트리밍 총계, 성별/연령별 비율 시각화)<br>• 아티스트/앨범/음원 CRUD 관리 기능<br>• 회원 정보 관리, 결제 내역 조회 및 멤버십 정책 관리 |

---

## 4. 개발 일정 (Timeline)

```text
[Step 1] 기획 및 DB 설계, Git 환경 구축 (02.07 ~ 02.10)
   └── [Step 2] 시큐리티 적용, 메인 UI & 카테고리별 구조화 (02.11 ~ 02.19)
          └── [Step 3] 멘토링 피드백 반영 및 세부 기능 구현 (02.20 ~ 02.26)
                 └── [Step 4] 프론트-백엔드 데이터 연동 및 마무리 (02.26 ~ 02.28)
                        └── [Step 5] AWS 배포 및 final 검수 (02.28 ~ 03.03)
```

---

## 5. 데이터베이스 설계 (DB ERD)

DIVE 플랫폼은 회원, 음원 정보, 결제 및 멤버십, 플레이리스트 간의 유기적인 연관관계를 위해 다각도로 엔티티를 설계했습니다.

```
       [ Member ] ───┬───< Membership_user > ─── [ Membership ]
           │         ├───< Payment >
           │         ├───< Cart > ─── [ Music ] ─── [ Album ]
           │         ├───< Playlist >                 │
           │         └───< Likes / Reply >            └─── [ Artist ]
```

* **핵심 엔티티**: `Member`, `Membership`, `Membership_user`, `Payment`, `Music`, `Artist`, `Album`, `Playlist`, `Playcountlist`, `MemberRecentMusics`, `PurchasedMusic`, `Cart`, `Likes`, `Reply`, `DailyCount`, `Allpage`

---

## 6. 주요 화면 및 담당 기능

### 🎵 1) 사용자 메인 & 음악 재생 (Player)
* **감정 선택 기반 추천**: 메인 화면에서 그날의 기분(행복/슬픔/화남/지루함/평범함)을 선택 시 감정 및 장르(Mood/Genre)에 맞는 200곡 추출 연속 재생.
* **하단 미니 플레이어**: 로컬 스토리지(LocalStorage)를 활용하여 페이지 전환 시에도 중단 없는 음원 스트리밍 제공.
* **챗봇(DIVER) 연동**: Open AI GPT 3.5 기반 감정 대화형 음원 추천 서비스 제공.

### 💳 2) 멤버십 & MP3 결제 (Toss Payments)
* **토스 페이먼츠 API**: 카드, 계좌이체, 간편결제(Toss/Payco 등)를 활용한 구독 및 음원 구매/선물.
* **복합 결제 지원**: MP3 다운로드 이용권 잔여 횟수를 우선 차감 후 부족한 수량만 추가 유료 결제하는 차감/복합 결제 로직 구현.
* **선물하기 기능**: 회원 간 이용권 및 individual 음원 선물 지원 및 마이페이지 선물함 등록.

### 📊 3) 통합 관리자 대시보드 (Admin)
* **통계 시각화**: 자정마다 스케줄러(`@Scheduled`)로 집계되는 스트리밍 건수, 성별 비율, 연령대별 이용 패턴 시각화.
* **음원 데이터 통합 등록**: 아티스트 ➡️ 앨범 ➡️ 음원 단계별 등록 및 관리 프로세스 구축.
* **멤버십 정책 제어**: 멤버십 추가, 삭제 및 노출 여부(활성화/비활성화) 토글 제어.

---

## 7. 트러블슈팅 (Troubleshooting)

<details>
<summary><b>🔥 1. JPA 양방향 연관관계 순환 참조(Infinite Recursion) 및 불필요한 데이터 노출</b></summary>

* **문제 상황**
  * `Music` - `Artist` - `Album` 간 양방향 참조 관계에서 엔티티 조회 시 JSON 직렬화 과정에서 무한 루프가 발생하거나, 단순 음악 조회 요청 시 아티스트의 전체 앨범 목록까지 함께 출력되는 오버헤드가 발생함.
* **해결 방법**
  * 엔티티 객체를 프론트엔드로 직접 전달하지 않고, 필요한 응답 필드만 정의한 DTO(`AlbumDto`, `ArtistDto`, `MusicDto`) 모델을 도입.
  * 순환 참조 현상을 완전 차단하고 데이터 전송 용량을 단축하여 성능 최적화 달성.

</details>

<details>
<summary><b>🔥 2. 멤버십 정책(가격/기간) 변경 시 기존 구독 사용자의 데이터 정합성 문제</b></summary>

* **문제 상황**
  * 관리자가 원본 `Membership` 엔티티의 이용 기간이나 단가를 수정/삭제할 경우, 이미 해당 멤버십을 결제하여 이용 중인 사용자(`Membership_user`)의 혜택 및 종료일 계산에 오류가 발생하는 위험 발생.
* **해결 방법**
  * 결제 시점의 멤버십 명칭, 기간, 카테고리 등의 주요 속성을 `Membership_user` 엔티티 내 스냅샷 필드로 복사하여 저장하도록 구현.
  * 원본 멤버십 원장이 변경되거나 삭제되더라도, 과거 구매 이력 및 사용자 이용 권한은 구매 당시 정책대로 안전하게 보존됨.

</details>

---

## 8. 프로젝트 링크 및 참조

* 📋 [기능정의서 (Notion)](https://pumped-date-0b2.notion.site/1a0d8b2427c980ecb8ddfb761444e685?v=1a0d8b2427c9801c8638000cd820bf76)
* 📊 [API 정의서 (Google Sheets)](https://docs.google.com/spreadsheets/d/1GksnewH8uIOEdx3Og2dgB4dq_KCed_aY0rNzicSNKKo/edit?usp=sharing)

```
Copyright (c) 2025 TEAM DIVE All Rights Reserved.
```
