# 3D 프린터의 활용

웹사이트: https://suguri123.github.io/3D_swmirae20261118/

`main` 브랜치에 푸시하면 GitHub Actions가 `dist` 폴더를 GitHub Pages에 자동 배포합니다. 저장소의 **Actions**에서 배포 진행 상황을 확인할 수 있습니다.

2026-11-18 교육용 PowerPoint 54장을 원본 비율과 배치로 보여 주는 정적 웹사이트입니다.

`dist/index.html`을 브라우저에서 바로 열거나 `dist` 폴더를 정적 웹 서버로 서비스합니다. 외부 라이브러리와 빌드 과정이 필요하지 않습니다.

- 목차에서 제목과 본문 검색
- 좌우 방향키, Page Up/Down, Home/End 및 모바일 좌우 밀기로 이동
- 전체화면(F), 세로 모아보기, 슬라이드 번호로 바로 이동
- 원본 텍스트 읽기 및 PowerPoint 다운로드
- `#slide-22` 형태의 페이지 링크

슬라이드는 PowerPoint에서 1920×1080 PNG로 내보낸 원본 이미지입니다. 웹에서 슬라이드 개별 객체 편집이나 PowerPoint 애니메이션은 지원하지 않습니다. 원본 PPT는 다운로드할 수 있습니다.

재생성할 때 `scripts/export-slides.ps1`로 슬라이드를 내보내고 `scripts/prepare-data.mjs`로 미리 추출한 텍스트에서 브라우저 데이터를 생성합니다.
