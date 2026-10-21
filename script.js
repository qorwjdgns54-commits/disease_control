// --------------------------------------------------------------------------
// 질병관리청(KDCA) 디지털 안내관 대화형 스크립트
// --------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  initMissionTabs();
  initNewsFilterAndSearch();
  initSupportFinder();
  initScrollTop();
});

/**
 * 1. 핵심 업무 탭 전환 기능
 */
function initMissionTabs() {
  const tabButtons = document.querySelectorAll("#missionTabs .tab-btn");
  const tabPanes = document.querySelectorAll(".tab-contents .tab-pane");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-tab");

      // 모든 탭 버튼 및 내용 비활성화
      tabButtons.forEach(b => b.classList.remove("active"));
      tabPanes.forEach(pane => pane.classList.remove("active"));

      // 클릭한 탭 활성화
      btn.classList.add("active");
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add("active");
      }
    });
  });
}

/**
 * 2. 뉴스 카테고리 필터링 및 실시간 검색 기능
 */
function initNewsFilterAndSearch() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const searchInput = document.getElementById("newsSearchInput");
  const searchClearBtn = document.getElementById("searchClearBtn");
  const newsCards = document.querySelectorAll(".news-card");

  let currentCategory = "all";

  // 카테고리 필터 클릭
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.getAttribute("data-category");
      applyFilterAndSearch();
    });
  });

  // 실시간 검색어 입력
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      if (e.target.value.trim().length > 0) {
        searchClearBtn.style.display = "block";
      } else {
        searchClearBtn.style.display = "none";
      }
      applyFilterAndSearch();
    });
  }

  // 검색어 초기화 버튼
  if (searchClearBtn) {
    searchClearBtn.addEventListener("click", () => {
      searchInput.value = "";
      searchClearBtn.style.display = "none";
      applyFilterAndSearch();
      searchInput.focus();
    });
  }

  function applyFilterAndSearch() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : "";

    newsCards.forEach(card => {
      const cardCategory = card.getAttribute("data-category");
      const title = card.querySelector(".news-title")?.textContent.toLowerCase() || "";
      const excerpt = card.querySelector(".news-excerpt")?.textContent.toLowerCase() || "";

      const matchesCategory = (currentCategory === "all" || cardCategory === currentCategory);
      const matchesSearch = (!query || title.includes(query) || excerpt.includes(query));

      if (matchesCategory && matchesSearch) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  }
}

/**
 * 3. 국민 맞춤형 지원 혜택 진단 (Checklist & Finder)
 */
const BENEFIT_DATABASE = {
  child: {
    title: "어린이 국가필수예방접종(NIP) 18종 전액 국비 지원",
    icon: "💉",
    tag: "영유아/어린이",
    cost: "전액 무료 (국비 100%)",
    desc: "생후 0개월부터 만 12세까지 BCG(결핵), B형간염, 수두, MMR, 최신 폐렴구균(PCV20) 등 총 18종의 필수 백신 접종 비용을 국가가 전액 부담합니다.",
    howto: "신청 방법: 전국 지정 의료기관(소아과 등) 또는 보건소 방문 시 신분증/아기수첩 지참",
    linkText: "예방접종도우미에서 접종일정 확인 &rarr;",
    linkUrl: "https://nip.kdca.go.kr"
  },
  teen: {
    title: "청소년 자궁경부암(HPV) & 인플루엔자 무료 접종",
    icon: "🌸",
    tag: "청소년 보건",
    cost: "무료 지원",
    desc: "12~17세 여성 청소년 및 12세 남성 청소년 대상 HPV 백신 무료 접종과 함께, 호흡기 유행철 인플루엔자(독감) 예방접종을 지원합니다.",
    howto: "신청 방법: 가까운 위탁 의료기관에 방문하여 당일 무료 접종",
    linkText: "HPV 무료 지원 대상 기준 조회 &rarr;",
    linkUrl: "https://nip.kdca.go.kr"
  },
  senior: {
    title: "어르신 인플루엔자 & 23가 폐렴구균 평생 무료 접종",
    icon: "🧓",
    tag: "어르신 건강복지",
    cost: "전액 무료",
    desc: "만 65세 이상 어르신의 치명적인 합병증을 막기 위해 매년 가을 인플루엔자(독감) 백신 1회 및 폐렴구균(23가 다당질) 1회 무료 접종을 제공합니다.",
    howto: "신청 방법: 주민등록상 65세 이상 도래 시 신분증 지참 후 전국 위탁 의료기관 방문",
    linkText: "어르신 지정 위탁의료기관 찾기 &rarr;",
    linkUrl: "https://nip.kdca.go.kr"
  },
  pregnant: {
    title: "임신부 및 태아 보호 인플루엔자 무료 접종",
    icon: "🤰",
    tag: "모자 보건",
    cost: "전액 무료",
    desc: "임신부 본인의 호흡기 질환 중증 합병증을 예방하고, 출생 후 생후 6개월 미만 영아에게 모체 면역을 전달하기 위해 인플루엔자 백신을 전액 무료 지원합니다.",
    howto: "신청 방법: 임신확인서, 산모수첩 또는 임신진단서 지참 후 위탁의료기관 방문",
    linkText: "임신부 접종 안내 및 Q&A &rarr;",
    linkUrl: "https://nip.kdca.go.kr"
  },
  chronic: {
    title: "고혈압·당뇨병 등록관리 및 지속치료 지원",
    icon: "🩺",
    tag: "만성질환 케어",
    cost: "진료비·약제비 지원 연계",
    desc: "지역사회 보건소와 동네의원이 연계하여 만 65세 이상 고혈압·당뇨병 환자에게 매월 진료비(1,500원) 및 약제비(건당 2,000원)와 영양·운동 맞춤상담을 제공합니다.",
    howto: "이용 방법: 고혈압·당뇨병 등록관리사업 참여 동네의원 또는 관할 보건소 신청",
    linkText: "국가 만성질환 예방관리 정보 보기 &rarr;",
    linkUrl: "https://www.kdca.go.kr"
  },
  rare: {
    title: "희귀질환 헬프라인 의료비 지원 및 맞춤 진단",
    icon: "🎗️",
    tag: "희귀질환 극복",
    cost: "요양급여 본인부담금 100% 지원 등",
    desc: "국가관리 희귀질환 산정특례 대상자에게 요양급여 본인부담금을 지원하고, 진단이 어려운 극희귀질환 유전자 무료 진단지원 및 특수식(특수분유) 구입비를 지원합니다.",
    howto: "신청 방법: 주민등록지 관할 보건소 방문 신청 또는 희귀질환 헬프라인 온라인 신청",
    linkText: "희귀질환 헬프라인(의료비 지원 신청) &rarr;",
    linkUrl: "https://helpline.kdca.go.kr"
  },
  vaccine_injury: {
    title: "예방접종 국가 피해보상 제도",
    icon: "🛡️",
    tag: "접종 안전망",
    cost: "진료비, 간병비, 사망일시보상금 등",
    desc: "국가예방접종 후 불가피하게 발생한 이상반응(부작용)에 대해 인과성을 전문적으로 심의하여 진료비 본인부담금 및 보상금을 국가가 보상합니다.",
    howto: "신청 방법: 이상반응 발생일로부터 5년 이내 주소지 관할 보건소에 보상신청서 제출",
    linkText: "피해보상 신청 서식 및 심의 절차 안내 &rarr;",
    linkUrl: "https://nip.kdca.go.kr"
  },
  travel: {
    title: "해외감염병 Now & Q-CODE(검역정보사전입력) 서비스",
    icon: "✈️",
    tag: "해외여행 안심케어",
    cost: "무료 정보/사전검역",
    desc: "출국 전 방문 국가별 주의 감염병(황열, 뎅기열, 말라리아 등)과 예방접종 정보를 안내하고, 귀국 시 Q-CODE를 통해 신속한 검역 통과를 돕습니다.",
    howto: "이용 방법: 질병관리청 해외감염병NOW 웹사이트에서 국가명 검색 및 예방약 처방",
    linkText: "해외감염병NOW 국가별 정보 검색 &rarr;",
    linkUrl: "https://www.kdca.go.kr"
  },
  certificate: {
    title: "예방접종증명서 온라인 즉시 무료 발급",
    icon: "📄",
    tag: "민원 편의",
    cost: "무료 수수료",
    desc: "자녀의 초등학교·중학교 취학 시 필요한 접종 완료 확인서 및 해외 유학·비자 발급용 영문 예방접종증명서를 공인인증서/간편인증으로 즉시 출력·PDF 저장할 수 있습니다.",
    howto: "발급 방법: 질병관리청 예방접종도우미 또는 정부24에서 본인/자녀 증명서 즉시 발급",
    linkText: "예방접종증명서 발급 바로가기 &rarr;",
    linkUrl: "https://nip.kdca.go.kr"
  },
  call1339: {
    title: "1339 24시간 감염병 전문 콜센터 상담",
    icon: "📞",
    tag: "24시간 핫라인",
    cost: "통화료 일반 요금 (상담 무료)",
    desc: "감염병 의심 증상 문의, 격리 및 방역지침 안내, 휴일·야간 선별진료 의료기관 안내 등을 365일 24시간 전문 간호사 상담원이 친절히 안내합니다.",
    howto: "이용 방법: 유선전화나 휴대폰으로 국번없이 1339 연결",
    linkText: "1339 콜센터 소개 및 상담안내 &rarr;",
    linkUrl: "https://www.kdca.go.kr"
  },
  bio_data: {
    title: "국가통합바이오빅데이터 프로젝트 참여 혜택",
    icon: "🧬",
    tag: "미래 정밀의료",
    cost: "참여 무료 (검진 혜택 제공)",
    desc: "미래 바이오헬스 연구에 기여하는 국민 참여형 프로젝트로, 참여자에게는 상세 건강검진 및 본인의 유전체 분석 리포트(연구 진행 일정에 따름) 등의 피드백을 제공합니다.",
    howto: "참여 방법: 국가통합바이오빅데이터 공식 누리집 또는 연계 검진기관 신청",
    linkText: "바이오빅데이터 사업단 참여 신청 안내 &rarr;",
    linkUrl: "https://www.nih.go.kr"
  }
};

function initSupportFinder() {
  const checkboxes = document.querySelectorAll('input[name="supportCheck"]');
  const btnRun = document.getElementById("btnRunFinder");
  const btnReset = document.getElementById("btnResetFinder");
  const resultArea = document.getElementById("finderResultArea");
  const resultList = document.getElementById("resultList");
  const resultCountSummary = document.getElementById("resultCountSummary");

  // 체크박스 클릭 시 스타일 토글
  checkboxes.forEach(cb => {
    cb.addEventListener("change", () => {
      const parentLabel = cb.closest(".custom-checkbox");
      if (cb.checked) {
        parentLabel?.classList.add("is-checked");
      } else {
        parentLabel?.classList.remove("is-checked");
      }
    });
  });

  // 초기화 버튼
  btnReset?.addEventListener("click", () => {
    checkboxes.forEach(cb => {
      cb.checked = false;
      cb.closest(".custom-checkbox")?.classList.remove("is-checked");
    });
    if (resultArea) resultArea.style.display = "none";
  });

  // 맞춤 결과 찾기 실행
  btnRun?.addEventListener("click", () => {
    const selectedValues = Array.from(checkboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);

    renderFinderResults(selectedValues);
  });

  function renderFinderResults(selectedKeys) {
    if (!resultArea || !resultList) return;

    // 만약 하나도 선택하지 않은 경우: 국민 모두에게 유용한 기본 3대 서비스 추천
    let isDefaultRecommendation = false;
    let targetKeys = selectedKeys;

    if (targetKeys.length === 0) {
      isDefaultRecommendation = true;
      targetKeys = ["call1339", "certificate", "travel"];
    }

    resultList.innerHTML = "";

    targetKeys.forEach(key => {
      const item = BENEFIT_DATABASE[key];
      if (!item) return;

      const card = document.createElement("div");
      card.className = "benefit-card";
      card.innerHTML = `
        <div class="benefit-icon">${item.icon}</div>
        <div class="benefit-content">
          <div class="benefit-tag-row">
            <span class="benefit-tag">${item.tag}</span>
            <span class="benefit-cost">${item.cost}</span>
          </div>
          <h5 class="benefit-title">${item.title}</h5>
          <p class="benefit-desc">${item.desc}</p>
          <div class="benefit-action-row">
            <span class="benefit-howto">📌 ${item.howto}</span>
            <a href="${item.linkUrl}" target="_blank" rel="noopener noreferrer" class="benefit-link">${item.linkText}</a>
          </div>
        </div>
      `;
      resultList.appendChild(card);
    });

    if (resultCountSummary) {
      if (isDefaultRecommendation) {
        resultCountSummary.innerHTML = `선택된 항목이 없어, <strong>대한민국 국민 누구나 즉시 이용 가능한 3대 대표 지원 서비스</strong>를 추천해 드립니다.`;
      } else {
        resultCountSummary.innerHTML = `선택하신 상황에 맞춰 총 <strong>${targetKeys.length}개</strong>의 핵심 맞춤 지원 서비스를 찾아냈습니다.`;
      }
    }

    resultArea.style.display = "block";

    // 결과 위치로 부드럽게 스크롤
    resultArea.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/**
 * 4. 국민 건강 상식 퀴즈 함수
 */
window.checkQuiz = function(seconds, buttonElement) {
  const resultDiv = document.getElementById("quizResult");
  if (!resultDiv) return;

  resultDiv.style.display = "block";

  if (seconds === 30) {
    resultDiv.className = "quiz-result quiz-correct";
    resultDiv.innerHTML = "🎉 <strong>정답입니다!</strong> 질병관리청은 손바닥, 손등, 손가락 사이, 엄지손가락, 손톱 밑까지 흐르는 물에 비누로 <strong>최소 30초 이상</strong> 꼼꼼하게 씻을 것을 권장합니다.";
  } else {
    resultDiv.className = "quiz-result quiz-wrong";
    resultDiv.innerHTML = "🤔 <strong>아쉽습니다!</strong> 질병관리청에서 권장하는 올바른 손 씻기 최소 시간은 <strong>30초 이상</strong>입니다. 생일 축하 노래를 두 번 부르는 정도의 시간 동안 구석구석 씻어주세요!";
  }
};

/**
 * 5. 맨 위로 가기 버튼 스크롤 연동
 */
function initScrollTop() {
  const scrollBtn = document.getElementById("scrollTopBtn");
  if (!scrollBtn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      scrollBtn.classList.add("visible");
    } else {
      scrollBtn.classList.remove("visible");
    }
  });

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}
